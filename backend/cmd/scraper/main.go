package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bloiss/lumeameals/internal/config"
	"github.com/bloiss/lumeameals/internal/repository/postgres"
	"github.com/bloiss/lumeameals/internal/scraper"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	pool, err := postgres.NewPool(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()

	// Scrapers enregistrés
	runner := scraper.NewRunner(pool,
		scraper.NewLidlScraper(),
		scraper.NewLeclercScraper(),
	)

	interval := cfg.ScraperInterval
	log.Printf("LumaMeals scraper démarré — intervalle %s", interval)

	// Premier run immédiat
	runOnce(runner)

	// Ticker pour les runs suivants
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	// Arrêt propre sur SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	for {
		select {
		case <-ticker.C:
			runOnce(runner)
		case <-quit:
			log.Println("scraper: arrêt propre")
			return
		}
	}
}

func runOnce(r *scraper.Runner) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()
	if err := r.Run(ctx); err != nil {
		log.Printf("scraper run error: %v", err)
	}
}
