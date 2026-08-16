import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-img-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <div className="product-card-price">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
