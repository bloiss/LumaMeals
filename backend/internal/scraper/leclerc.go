package scraper

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
	"github.com/google/uuid"
)

// LeclercScraper scrape les prix E.Leclerc France via leclerc.fr.
// Même architecture que LidlScraper : tentative web d'abord, fallback simulation.
// NOTE : le site Leclerc est fortement JS — le scraping statique est limité.
// Pour un rendu complet, envisager chromedp à terme.
type LeclercScraper struct {
	storeID  uuid.UUID
	products []productTarget
}

// LeclercStoreID est l'UUID du magasin E.Leclerc National dans notre BDD.
var LeclercStoreID = uuid.MustParse("00000000-0000-0000-0007-000000000001")

// NewLeclercScraper crée un scraper Leclerc avec la liste des produits à cibler.
func NewLeclercScraper() *LeclercScraper {
	storeID := LeclercStoreID
	return &LeclercScraper{
		storeID: storeID,
		products: []productTarget{
			{ExternalID: "LEC-PAT-001", SearchName: "spaghetti", StoreID: storeID},
			{ExternalID: "LEC-RIZ-001", SearchName: "riz long grain", StoreID: storeID},
			{ExternalID: "LEC-FAR-001", SearchName: "farine de ble", StoreID: storeID},
			{ExternalID: "LEC-PDT-001", SearchName: "pommes de terre", StoreID: storeID},
			{ExternalID: "LEC-PAI-001", SearchName: "pain de mie", StoreID: storeID},
			{ExternalID: "LEC-OEU-001", SearchName: "oeufs", StoreID: storeID},
			{ExternalID: "LEC-POU-001", SearchName: "filet poulet", StoreID: storeID},
			{ExternalID: "LEC-LAR-001", SearchName: "lardons fumes", StoreID: storeID},
			{ExternalID: "LEC-THO-001", SearchName: "thon au naturel", StoreID: storeID},
			{ExternalID: "LEC-FRO-001", SearchName: "emmental rape", StoreID: storeID},
			{ExternalID: "LEC-TOM-001", SearchName: "tomates", StoreID: storeID},
			{ExternalID: "LEC-OIG-001", SearchName: "oignons", StoreID: storeID},
			{ExternalID: "LEC-CAR-001", SearchName: "carottes", StoreID: storeID},
			{ExternalID: "LEC-COU-001", SearchName: "courgette", StoreID: storeID},
			{ExternalID: "LEC-CHA-001", SearchName: "champignons de paris", StoreID: storeID},
		},
	}
}

func (s *LeclercScraper) Name() string { return "leclerc" }

// Scrape tente de récupérer les prix sur leclerc.fr.
// En cas d'échec (JS requis, anti-bot, etc.) il retombe sur simulatePrices.
func (s *LeclercScraper) Scrape(ctx context.Context) ([]ScrapedPrice, error) {
	prices, err := s.scrapeWeb(ctx)
	if err != nil || len(prices) == 0 {
		log.Printf("[scraper/leclerc] scraping web impossible (%v) → simulation prix", err)
		return s.simulatePrices(), nil
	}
	return prices, nil
}

// scrapeWeb tente de scraper les prix depuis le moteur de recherche Leclerc.
func (s *LeclercScraper) scrapeWeb(_ context.Context) ([]ScrapedPrice, error) {
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "+
			"AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"),
		colly.MaxDepth(1),
	)
	c.SetRequestTimeout(10 * time.Second)

	var prices []ScrapedPrice
	now := time.Now()

	// Sélecteurs E.Leclerc (susceptibles de changer)
	// Format prix : "1,29 €" ou "1.29 €"
	c.OnHTML("[data-price], .price, .product-price, [class*='price']", func(e *colly.HTMLElement) {
		raw := strings.TrimSpace(e.Text)
		cents, err := parseEuroPrice(raw)
		if err != nil || cents <= 0 {
			return
		}
		extID := e.Request.Ctx.Get("external_id")
		if extID == "" {
			return
		}
		storeIDStr := e.Request.Ctx.Get("store_id")
		storeID, _ := uuid.Parse(storeIDStr)
		prices = append(prices, ScrapedPrice{
			ProductExternalID: extID,
			StoreID:           storeID,
			PriceCents:        cents,
			ScrapedAt:         now,
		})
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("[scraper/leclerc] %s : %v", r.Request.URL, err)
	})

	for _, p := range s.products {
		url := fmt.Sprintf(
			"https://www.leclerc.com/recherche/?q=%s",
			strings.ReplaceAll(p.SearchName, " ", "+"),
		)
		ctx := colly.NewContext()
		ctx.Put("external_id", p.ExternalID)
		ctx.Put("store_id", p.StoreID.String())

		if err := c.Request("GET", url, nil, ctx, nil); err != nil {
			log.Printf("[scraper/leclerc] visit %s : %v", url, err)
		}
		// Politesse : pause entre les requêtes
		time.Sleep(900 * time.Millisecond)
	}

	return prices, nil
}

// simulatePrices génère des prix Leclerc réalistes (légèrement plus élevés que Lidl)
// avec une variation de ±4% — utile en développement ou quand le site est inaccessible.
func (s *LeclercScraper) simulatePrices() []ScrapedPrice {
	// Prix de référence Leclerc en centimes (légèrement supérieurs à Lidl en moyenne)
	seedPrices := map[string]int{
		"LEC-PAT-001": 95,  "LEC-RIZ-001": 109, "LEC-FAR-001": 72,
		"LEC-PDT-001": 139, "LEC-PAI-001": 85,  "LEC-OEU-001": 159,
		"LEC-POU-001": 219, "LEC-LAR-001": 95,  "LEC-THO-001": 199,
		"LEC-FRO-001": 129, "LEC-TOM-001": 109, "LEC-OIG-001": 85,
		"LEC-CAR-001": 75,  "LEC-COU-001": 65,  "LEC-CHA-001": 119,
	}

	prices := make([]ScrapedPrice, 0, len(s.products))
	now := time.Now()
	rng := rand.New(rand.NewSource(now.UnixNano()))

	for _, p := range s.products {
		base, ok := seedPrices[p.ExternalID]
		if !ok {
			continue
		}
		// Variation aléatoire ±4% arrondie au centime
		variation := 1.0 + (rng.Float64()*0.08 - 0.04)
		cents := int(float64(base)*variation + 0.5)
		if cents < 1 {
			cents = 1
		}
		prices = append(prices, ScrapedPrice{
			ProductExternalID: p.ExternalID,
			StoreID:           p.StoreID,
			PriceCents:        cents,
			ScrapedAt:         now,
		})
	}
	return prices
}
