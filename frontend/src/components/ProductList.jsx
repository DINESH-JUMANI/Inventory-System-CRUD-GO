import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

const ProductList = ({ products, onEditProduct, onDeleteProduct }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-list">
      <h2>List of Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product._id}>
                <td><strong>{product.productID}</strong></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>
                  <button className='edit-button' onClick={() => onEditProduct(product)}>
                    <FaEdit /> Edit
                  </button>
                  <button className='delete-button' onClick={() => onDeleteProduct(product)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-products">No products Available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={currentPage === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </button>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return <span key={pageNumber}>...</span>;
          }
          return null;
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      productID: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onEditProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};

export default ProductList;
