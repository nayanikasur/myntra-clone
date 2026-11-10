import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatCount, formatPrice } from '../api';
import ProductCard from '../components/ProductCard';
import { BagIcon, HeartIcon, StarIcon, TruckIcon } from '../components/Icons';
import { NAV } from '../config';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

// Measurements in inches (clothing) or UK size -> foot length in cm (footwear)
const SIZE_CHARTS = {
  Shirts: { cols: ['Size', 'Chest', 'Length', 'Sleeve'], rows: [['S', 38, 28, 24], ['M', 40, 29, 24.5], ['L', 42, 30, 25], ['XL', 44, 31, 25.5], ['XXL', 46, 32, 26]] },
  Tops: { cols: ['Size', 'Bust', 'Waist', 'Length'], rows: [['XS', 32, 26, 22], ['S', 34, 28, 22.5], ['M', 36, 30, 23], ['L', 38, 32, 23.5], ['XL', 40, 34, 24]] },
  Dresses: { cols: ['Size', 'Bust', 'Waist', 'Hip'], rows: [['XS', 32, 26, 35], ['S', 34, 28, 37], ['M', 36, 30, 39], ['L', 38, 32, 41], ['XL', 40, 34, 43]] },
  'Casual Shoes': { cols: ['UK', 'US', 'EU', 'Foot (cm)'], rows: [[6, 7, 40, 24.6], [7, 8, 41, 25.4], [8, 9, 42, 26.2], [9, 10, 43, 27.1], [10, 11, 44, 27.9], [11, 12, 45, 28.8]] },
  Heels: { cols: ['UK', 'US', 'EU', 'Foot (cm)'], rows: [[3, 5, 36, 22.5], [4, 6, 37, 23.3], [5, 7, 38, 24.1], [6, 8, 39, 25], [7, 9, 40, 25.8], [8, 10, 41, 26.7]] },
};

const BAR_COLORS = { 5: '#14958f', 4: '#14958f', 3: '#72bfbc', 2: '#fcb301', 1: '#f16565' };

// Spread the review count across 5..1 stars so the bars average out to the product's rating
function ratingBreakdown(rating, total) {
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.abs(s - rating) * 1.1));
  const sum = weights.reduce((a, b) => a + b, 0);
  return [5, 4, 3, 2, 1].map((s, i) => [s, Math.round((weights[i] / sum) * total)]);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart, cart, isWishlisted, toggleWishlist } = useShop();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState('');
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setData(null);
    setError('');
    setSize('');
    api(`/products/${id}`)
      .then((d) => {
        setData(d);
        if (d.product.sizes.length === 1) setSize(d.product.sizes[0]);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="empty-state"><h3>{error}</h3><Link to="/">Continue shopping</Link></div>;
  if (!data) return <div className="page-loader" />;

  const { product: p, similar } = data;
  const section = NAV.find((n) => n.key === p.gender);
  const inBag = cart.some((i) => i.product._id === p._id && i.size === size);
  const wished = isWishlisted(p._id);
  const bestPrice = p.price > 999 ? p.price - Math.min(300, Math.round(p.price * 0.1)) : p.price;
  const breakdown = ratingBreakdown(p.rating, p.ratingCount);

  const handleAdd = async () => {
    if (inBag) return navigate('/checkout/cart');
    if (!size) {
      setSizeError(true);
      return toast('Please select a size', 'error');
    }
    await addToCart(p._id, size);
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) return setDelivery('Please enter a valid 6-digit pincode');
    const date = new Date(Date.now() + 4 * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    setDelivery(`Get it by ${date}`);
  };

  return (
    <div className="pdp">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / {section && <Link to={`/shop/${p.gender}`}>{section.label}</Link>} /{' '}
        <Link to={`/shop/${p.gender}?category=${encodeURIComponent(p.category)}`}>{p.category}</Link> / <span>{p.brand}</span>
      </div>

      <div className="pdp-main">
        <div className="pdp-gallery">
          {p.images.slice(0, 6).map((src, i) => (
            <div key={src} className="pdp-img">
              <img src={src} alt={`${p.title} view ${i + 1}`} />
            </div>
          ))}
        </div>

        <div className="pdp-info">
          <h1 className="pdp-brand">{p.brand}</h1>
          <h2 className="pdp-title">{p.title}</h2>
          {p.rating > 0 && (
            <div className="pdp-rating">
              <b>
                {p.rating.toFixed(1)} <StarIcon className="star" />
              </b>
              <span>{formatCount(p.ratingCount)} Ratings</span>
            </div>
          )}
          <hr />
          <div className="pdp-price">
            <strong>{formatPrice(p.price)}</strong>
            {p.discount > 0 && (
              <>
                <span className="mrp">
                  MRP <s>{formatPrice(p.mrp)}</s>
                </span>
                <span className="off">({p.discount}% OFF)</span>
              </>
            )}
          </div>
          <p className="tax-note">inclusive of all taxes</p>

          <div className="size-head">
            <h3>SELECT SIZE</h3>
            {SIZE_CHARTS[p.category] && (
              <button type="button" className="link-btn" onClick={() => setShowChart(true)}>
                SIZE CHART &gt;
              </button>
            )}
          </div>
          <div className="size-buttons">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-btn ${size === s ? 'selected' : ''}`}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {sizeError && <p className="error-text">Please select a size</p>}

          <div className="pdp-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleAdd}>
              <BagIcon /> {inBag ? 'GO TO BAG' : 'ADD TO BAG'}
            </button>
            <button type="button" className={`btn btn-outline btn-lg ${wished ? 'wished' : ''}`} onClick={() => toggleWishlist(p._id)}>
              <HeartIcon filled={wished} /> {wished ? 'WISHLISTED' : 'WISHLIST'}
            </button>
          </div>
          <hr />

          <div className="delivery">
            <h3>
              DELIVERY OPTIONS <TruckIcon />
            </h3>
            <form onSubmit={checkPincode} className="pincode-form">
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter pincode" maxLength={6} inputMode="numeric" />
              <button type="submit">Check</button>
            </form>
            <p className="delivery-msg">{delivery || 'Please enter PIN code to check delivery time & Pay on Delivery Availability'}</p>
            <ul className="delivery-points">
              <li>100% Original Products</li>
              <li>Pay on delivery might be available</li>
              <li>Easy 14 days returns and exchanges</li>
            </ul>
          </div>
          <hr />

          <div className="offers">
            <h3>
              BEST OFFERS <span className="tag-icon">%</span>
            </h3>
            <p>
              Best Price: <b className="orange">{formatPrice(bestPrice)}</b>
            </p>
            <ul>
              <li>
                Coupon Discount: {formatPrice(p.price - bestPrice)} off <span>(check cart for final savings)</span>
              </li>
              <li>Applicable on: Orders above Rs. 999 (only on first purchase)</li>
              <li>
                Coupon code: <b>NEW300</b>
              </li>
            </ul>
            <p className="offer-bank">10% Instant Discount on select bank cards. Min spend ₹3500, max discount ₹1000.</p>
          </div>
          <hr />

          <div className="pdp-details">
            <h3>PRODUCT DETAILS</h3>
            <p>{p.description}</p>
            <h4>Specifications</h4>
            <dl>
              <dt>Category</dt>
              <dd>{p.category}</dd>
              <dt>Colour</dt>
              <dd>{p.color}</dd>
              <dt>Brand</dt>
              <dd>{p.brand}</dd>
            </dl>
          </div>

          {p.rating > 0 && (
            <>
              <hr />
              <div className="ratings">
                <h3>RATINGS ★</h3>
                <div className="ratings-body">
                  <div className="ratings-score">
                    <strong>
                      {p.rating.toFixed(1)} <span className="star">★</span>
                    </strong>
                    <span>{formatCount(p.ratingCount)} Verified Buyers</span>
                  </div>
                  <ul className="ratings-bars">
                    {breakdown.map(([stars, count]) => (
                      <li key={stars}>
                        <span>{stars} ★</span>
                        <i>
                          <b style={{ width: `${(count / p.ratingCount) * 100}%`, background: BAR_COLORS[stars] }} />
                        </i>
                        <span>{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showChart && (
        <div className="modal-backdrop" onClick={() => setShowChart(false)}>
          <div className="modal size-chart" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-head">
              <h4>Size Chart · {p.category}</h4>
              <button type="button" onClick={() => setShowChart(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  {SIZE_CHARTS[p.category].cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHARTS[p.category].rows.map((r) => (
                  <tr
                    key={r[0]}
                    className={String(r[0]) === size ? 'selected' : ''}
                    onClick={() => {
                      setSize(String(r[0]));
                      setSizeError(false);
                    }}
                  >
                    {r.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">Click a row to select that size. Clothing measurements are in inches.</p>
          </div>
        </div>
      )}

      {similar.length > 0 && (
        <>
          <h2 className="section-title small">SIMILAR PRODUCTS</h2>
          <ul className="product-grid">
            {similar.map((s) => (
              <ProductCard key={s._id} product={s} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
