import axios from "axios";

const API_URL = "http://localhost:8080";


export const getProducts = async () => {
  try {
    return await axios.get(`${API_URL}/products`);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
    console.log(product);
    return await axios.post(`${API_URL}/products`, product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedProduct) => {
  try {
    return await axios.put(`${API_URL}/products/${productId}`, updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (product) => {
  try {
    console.log("delete", product.id);
    return await axios.delete(`${API_URL}/products/${product.id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
