# Inventory Management System

## Overview
The Inventory Management System is a web application designed to manage products, including adding, editing, and deleting products. It consists of a frontend built with React and a backend built with Go, using MongoDB as the database.

## Prerequisites
- npm (v6 or higher)
- Go (v1.16 or higher)
- MongoDB

## Installation

### Backend
1. Clone the repository:
   ```sh
   git clone https://github.com/DINESH-JUMANI/Inventory-System-CRUD-GO.git
   cd inventory-system/backend
   ```

2. Install Go dependencies:
   ```sh
   go mod tidy
   ```

3. Set up MongoDB:
   - Ensure MongoDB is running on your local machine or configure the connection string in the environment variables.

4. Run the backend server:
   ```sh
   go run main.go
   ```

### Frontend
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```

2. Install npm dependencies:
   ```sh
   npm install
   ```

3. Install additional dependencies:
   ```sh
   npm install react-icons react-toastify axios
   ```

4. Run the frontend development server:
   ```sh
   npm run dev
   ```

## Usage
1. Open your browser and navigate to `http://localhost:5173` to access the frontend.
2. Use the interface to add, edit, and delete products.

## Dependencies

### Backend
- [Go](https://golang.org/)
- [MongoDB](https://www.mongodb.com/)
- [gorilla/mux](https://github.com/gorilla/mux)
- [mongo-driver](https://github.com/mongodb/mongo-go-driver)

### Frontend
- [React](https://reactjs.org/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-toastify](https://fkhadra.github.io/react-toastify/)
- [axios](https://github.com/axios/axios)
