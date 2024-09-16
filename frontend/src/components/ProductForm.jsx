import React, { useState, useEffect } from 'react';

const ProductForm = ({ onAddProduct, editingProduct }) => {
  const [product, setProduct] = useState({
    productID: '',
    name: '',
    category: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    } else {
      setProduct({
        productID: '',
        name: '',
        category: '',
        quantity: '',
        price: ''
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'quantity' || name === 'price' ? parseFloat(value) : value;

    setProduct({
      ...product,
      [name]: parsedValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(product);
    setProduct({
      productID: '',
      name: '',
      category: '',
      quantity: '',
      price: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
      <table>
        <tbody>
          <tr>
            <td><label htmlFor="productID">Product ID:</label></td>
            <td>
              {editingProduct ? (
                <input
                  type="text"
                  id="productID"
                  name="productID"
                  value={product.productID}
                  readOnly
                  disabled
                />
              ) : (
                <input
                  type="text"
                  id="productID"
                  name="productID"
                  value={product.productID}
                  onChange={handleChange}
                  placeholder="Product ID"
                  required
                />
              )}
            </td>
          </tr>
          <tr>
            <td><label htmlFor="name">Name:</label></td>
            <td>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="category">Category:</label></td>
            <td>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="quantity">Quantity:</label></td>
            <td>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                required
              />
            </td>
          </tr>
          <tr>
            <td><label htmlFor="price">Price:</label></td>
            <td>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <button type="submit" className='submit-button'>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default ProductForm;
