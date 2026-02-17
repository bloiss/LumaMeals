package main

import (
	"fmt"
	"github.com/gocolly/colly/v2"
)

func main() {
	// 1. On crée le robot (le Collector)
	c := colly.NewCollector(
		// On se fait passer pour un vrai navigateur (très important !)
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
	)

	// 2. On définit ce qu'on cherche (Callback)
	// "À chaque fois que tu trouves une balise <h1> avec la classe 'title-1', fais ça..."
	c.OnHTML("h1.title-1", func(e *colly.HTMLElement) {
		fmt.Println("📢 Produit trouvé :", e.Text)
	})

	// "À chaque fois que tu trouves le prix..." (Sur OpenFoodFacts c'est plus dur, on cherche juste le titre pour l'instant)
	
	// 3. On lui dit quoi faire avant de commencer
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("🚀 Visite de :", r.URL)
	})

	// On teste sur du Nutella, ça ne disparait jamais !
	err := c.Visit("https://fr.openfoodfacts.org/produit/3017620422003/nutella-ferrero-pate-a-tartiner-aux-noisettes-et-au-cacao")
	if err != nil {
		fmt.Println("❌ Erreur :", err)
	}
}