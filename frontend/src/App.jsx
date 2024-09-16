import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/Api';

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    initializeAndFetchProducts();
  }, []);

  const initializeAndFetchProducts = async () => {
    try {
      fetchProducts();
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, newProduct);
        setEditingProduct(null);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(newProduct);
        toast.success('Product added successfully!');
      }
      fetchProducts();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast.error('Error adding/updating product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (product) => {
    try {
      if (product && product.id) {
        await deleteProduct(product);
        fetchProducts();
        toast.success('Product deleted successfully!');
      } else {
        console.error("Cannot delete product: Invalid product or product ID");
        toast.error('Error deleting product. Invalid product or product ID.');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Error deleting product. Please try again.');
    }
  };

  return (
    <div>
      <h1>Product Management System</h1>
      <div className="App">
        <ProductForm
          onAddProduct={handleAddProduct}
          editingProduct={editingProduct}
        />
        <ProductList
          products={products}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
