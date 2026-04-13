package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/bloiss/lumeameals/internal/config"
	"github.com/bloiss/lumeameals/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	srv := server.New(cfg)
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("LumaMeals API listening on %s (env=%s)\n", addr, cfg.Env)
	log.Fatal(http.ListenAndServe(addr, srv.Router()))
}
