package scraper

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Runner orchestre tous les scrapers enregistrés, écrit les prix en BDD
// et rafraîchit la vue matérialisée cheapest_products_per_ingredient.
type Runner struct {
	pool     *pgxpool.Pool
	scrapers []ProductScraper
}

// NewRunner crée un Runner avec les scrapers fournis.
func NewRunner(pool *pgxpool.Pool, scrapers ...ProductScraper) *Runner {
	return &Runner{pool: pool, scrapers: scrapers}
}

// Run exécute tous les scrapers séquentiellement puis rafraîchit la vue.
// En production, on peut lancer Run dans une goroutine avec un ticker.
func (r *Runner) Run(ctx context.Context) error {
	start := time.Now()
	total := 0

	for _, s := range r.scrapers {
		log.Printf("[scraper/%s] démarrage", s.Name())

		prices, err := s.Scrape(ctx)
		if err != nil {
			log.Printf("[scraper/%s] erreur : %v", s.Name(), err)
			continue
		}

		n, err := r.persist(ctx, prices)
		if err != nil {
			log.Printf("[scraper/%s] erreur persistence : %v", s.Name(), err)
			continue
		}

		log.Printf("[scraper/%s] %d prix enregistrés", s.Name(), n)
		total += n
	}

	if total > 0 {
		if err := r.refreshView(ctx); err != nil {
			return fmt.Errorf("runner: refresh vue : %w", err)
		}
		log.Printf("[runner] vue matérialisée rafraîchie (%d prix en %s)", total, time.Since(start).Round(time.Millisecond))
	}

	return nil
}

// persist insère les prix dans product_price_history en résolvant external_id → product_id.
func (r *Runner) persist(ctx context.Context, prices []ScrapedPrice) (int, error) {
	if len(prices) == 0 {
		return 0, nil
	}

	const q = `
		INSERT INTO product_price_history (product_id, store_id, price_cents, scraped_at)
		SELECT p.id, $2, $3, $4
		FROM products p
		WHERE p.external_id = $1
		ON CONFLICT DO NOTHING`

	n := 0
	for _, sp := range prices {
		_, err := r.pool.Exec(ctx, q,
			sp.ProductExternalID,
			sp.StoreID,
			sp.PriceCents,
			sp.ScrapedAt,
		)
		if err != nil {
			log.Printf("[runner] insert %s : %v", sp.ProductExternalID, err)
			continue
		}
		n++
	}
	return n, nil
}

// refreshView rafraîchit la vue matérialisée pour que le generate handler
// utilise les prix les plus récents.
func (r *Runner) refreshView(ctx context.Context) error {
	_, err := r.pool.Exec(ctx, `REFRESH MATERIALIZED VIEW CONCURRENTLY cheapest_products_per_ingredient`)
	return err
}
