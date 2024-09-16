package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"inventory-system/models"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client

func SetClient(c *mongo.Client) {
	client = c
}

func InitializeDatabase(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Create database and collection
	collection := client.Database("inventory").Collection("products")

	// Create a unique index on the productId field
	indexModel := mongo.IndexModel{
		Keys:    bson.M{"productId": 1},
		Options: options.Index().SetUnique(true),
	}

	_, err := collection.Indexes().CreateOne(context.TODO(), indexModel)
	if err != nil {
		http.Error(w, "Failed to create index", http.StatusInternalServerError)
		log.Printf("Error creating index: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Database initialized successfully"))
}

func GetProducts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var products []models.Product
	collection := client.Database("inventory").Collection("products")

	cur, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error finding products: %v", err)
		return
	}
	defer cur.Close(context.TODO())

	for cur.Next(context.TODO()) {
		var product models.Product
		if err := cur.Decode(&product); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Error decoding product: %v", err)
			return
		}
		products = append(products, product)
	}

	if err := cur.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Cursor error: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(products); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error encoding products to JSON: %v", err)
	}
}

func CreateProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding request body: %v", err)
		return
	}

	collection := client.Database("inventory").Collection("products")
	_, err := collection.InsertOne(context.TODO(), product)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error inserting product: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(product); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error encoding product to JSON: %v", err)
	}
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get product ID from URL params
	params := mux.Vars(r)
	productId := params["id"]
	fmt.Println(productId)
	// Convert string ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(productId)
	if err != nil {
		fmt.Printf("Error converting product ID: %v\n", err)
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}
	fmt.Println(objectID)

	// Decode the updated product from the request body
	var updatedProduct models.Product
	if err := json.NewDecoder(r.Body).Decode(&updatedProduct); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("Error decoding request body: %v", err)
		return
	}

	// Prepare the update document
	update := bson.M{
		"$set": bson.M{
			"name":     updatedProduct.Name,
			"category": updatedProduct.Category,
			"quantity": updatedProduct.Quantity,
			"price":    updatedProduct.Price,
		},
	}

	// Update the product in the database
	collection := client.Database("inventory").Collection("products")
	result, err := collection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objectID}, // Use the correct _id field
		update,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error updating product: %v", err)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// Return the updated product
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(updatedProduct); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error encoding updated product to JSON: %v", err)
	}
}

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Extract productId from URL
	vars := mux.Vars(r)
	productID := vars["id"]

	// Convert string ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	// Implement the logic to delete the product
	collection := client.Database("inventory").Collection("products")
	result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": objectID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("Error deleting product: %v", err)
		return
	}

	// Return appropriate response
	if result.DeletedCount == 0 {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}
	log.Printf("Deleting product with ID: %s", productID)
	log.Printf("Delete result: %+v", result)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Product deleted successfully"))
}
