import PropTypes from 'prop-types';

function ProductItem({ product }) {
  return (
    <li>
      <strong>{product.name}</strong> - {product} - {product.category} - Qty: {product.quantity} - Price: ${product.price}
    </li>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    productID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductItem;
