package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL     string
	Port            string
	Env             string
	JWTSecret       string
	ScraperInterval time.Duration
}

func Load() (*Config, error) {
	// .env is loaded silently — missing file is fine in production
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	scraperInterval := time.Hour
	if raw := os.Getenv("SCRAPER_INTERVAL"); raw != "" {
		if d, err := time.ParseDuration(raw); err == nil {
			scraperInterval = d
		}
	}

	return &Config{
		DatabaseURL:     dbURL,
		Port:            getEnv("PORT", "8080"),
		Env:             getEnv("ENV", "development"),
		JWTSecret:       getEnv("JWT_SECRET", "dev-secret-change-in-production"),
		ScraperInterval: scraperInterval,
	}, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
