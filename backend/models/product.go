package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProductID string             `bson:"productID" json:"productID"`
	Name      string             `bson:"name" json:"name"`
	Category  string             `bson:"category" json:"category"`
	Quantity  int                `bson:"quantity" json:"quantity"`
	Price     float64            `bson:"price" json:"price"`
}
