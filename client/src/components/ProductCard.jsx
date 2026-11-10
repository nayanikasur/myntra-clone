import { Link } from 'react-router-dom';
import { formatCount } from '../api';
import { useShop } from '../context/ShopContext';
import { HeartIcon, StarIcon } from './Icons';

export default function ProductCard({ product, children }) {
  const { isWishlisted, toggleWishlist } = useShop();
  const wished = isWishlisted(product._id);

  return (
    <li className="product-card">
      <Link to={`/product/${product._id}`} className="pc-link">
        <div className="pc-image">
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
          {product.rating > 0 && (
            <span className="pc-rating">
              {product.rating.toFixed(1)} <StarIcon className="star" /> | {formatCount(product.ratingCount)}
            </span>
          )}
        </div>
        <div className="pc-info">
          <h3 className="pc-brand">{product.brand}</h3>
          <h4 className="pc-title">{product.title}</h4>
          <div className="pc-sizes">Sizes: {product.sizes.join(', ')}</div>
          <div className="pc-price">
            <span className="price">Rs. {product.price}</span>
            {product.discount > 0 && (
              <>
                <s className="mrp">Rs. {product.mrp}</s>
                <span className="off">({product.discount}% OFF)</span>
              </>
            )}
          </div>
        </div>
      </Link>
      {children || (
        <button
          type="button"
          className={`pc-wishlist ${wished ? 'wished' : ''}`}
          onClick={() => toggleWishlist(product._id)}
        >
          <HeartIcon filled={wished} width="16" height="16" />
          {wished ? 'WISHLISTED' : 'WISHLIST'}
        </button>
      )}
    </li>
  );
}
