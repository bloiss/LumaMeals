package main

import (
	"fmt"

	"github.com/gocolly/colly/v2"
)

func main() {
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
	)

	c.OnHTML("h1.title-1", func(e *colly.HTMLElement) {
		fmt.Println("Produit trouvé :", e.Text)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visite de :", r.URL)
	})

	err := c.Visit("https://fr.openfoodfacts.org/produit/3017620422003/nutella-ferrero-pate-a-tartiner-aux-noisettes-et-au-cacao")
	if err != nil {
		fmt.Println("Erreur :", err)
	}
}
