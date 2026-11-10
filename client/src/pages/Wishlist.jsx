import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CloseIcon, HeartIcon } from '../components/Icons';
import { useShop } from '../context/ShopContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [picking, setPicking] = useState(null);

  if (wishlist.length === 0) {
    return (
      <div className="empty-state">
        <HeartIcon width="96" height="96" className="empty-icon" />
        <h3>YOUR WISHLIST IS EMPTY</h3>
        <p>Add items that you like to your wishlist. Review them anytime and easily move them to the bag.</p>
        <Link to="/" className="btn btn-outline-pink">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const moveToBag = async (product, size) => {
    if (await addToCart(product._id, size)) {
      await toggleWishlist(product._id);
      setPicking(null);
    }
  };

  return (
    <div className="wishlist-page">
      <h1 className="plp-title">
        My Wishlist <span>{wishlist.length} items</span>
      </h1>
      <ul className="product-grid wishlist-grid">
        {wishlist.map((p) => (
          <ProductCard key={p._id} product={p}>
            <button type="button" className="wl-remove" aria-label="Remove from wishlist" onClick={() => toggleWishlist(p._id)}>
              <CloseIcon width="12" height="12" />
            </button>
            <button
              type="button"
              className="wl-move"
              onClick={() => (p.sizes.length === 1 ? moveToBag(p, p.sizes[0]) : setPicking(p))}
            >
              MOVE TO BAG
            </button>
          </ProductCard>
        ))}
      </ul>

      {picking && (
        <div className="modal-backdrop" onClick={() => setPicking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <img src={picking.thumbnail} alt="" />
              <div>
                <p>{picking.title}</p>
                <strong>Rs. {picking.price}</strong>
              </div>
              <button type="button" onClick={() => setPicking(null)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <h4>Select Size</h4>
            <div className="size-buttons">
              {picking.sizes.map((s) => (
                <button key={s} type="button" className="size-btn" onClick={() => moveToBag(picking, s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
