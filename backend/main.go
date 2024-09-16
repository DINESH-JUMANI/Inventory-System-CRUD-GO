package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"inventory-system/controllers"
	"inventory-system/middleware"
	"inventory-system/routes"
)

var client *mongo.Client

func main() {
	// Load .env file
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Retrieve MongoDB URI from .env
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI not set in .env file")
	}

	// Set up MongoDB connection
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err = mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Ping the MongoDB server to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB connection failed: ", err)
	}

	log.Println("Successfully connected to MongoDB")

	// Set up router
	router := mux.NewRouter()

	// Register routes
	routes.RegisterProductRoutes(router)

	// Apply CORS middleware
	corsHandler := middleware.CORSMiddleware(router)

	// Set client for controllers
	controllers.SetClient(client)

	// Start server
	log.Println("Server is running on :8080")
	log.Fatal(http.ListenAndServe(":8080", corsHandler))
}
