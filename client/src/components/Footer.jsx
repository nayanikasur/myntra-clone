import { Link } from 'react-router-dom';
import { BRAND_NAME, NAV } from '../config';

const POPULAR = ['Makeup', 'Dresses', 'Watches', 'Heels', 'Handbags', 'Sunglasses', 'Shirts', 'Tops', 'Fragrances', 'Jewellery', 'Skincare', 'Furniture', 'Home Decor', 'Casual Shoes'];

const Social = ({ label, d }) => (
  <span className="social" aria-label={label} title={label}>
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  </span>
);

export default function Footer() {
  const site = BRAND_NAME;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>ONLINE SHOPPING</h4>
          {NAV.map((n) => (
            <Link key={n.key} to={`/shop/${n.key}`}>
              {n.label}
            </Link>
          ))}
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/checkout/cart">Bag</Link>
        </div>
        <div className="footer-col">
          <h4>CUSTOMER POLICIES</h4>
          <Link to="/contactus">Contact Us</Link>
          <Link to="/faqs">FAQ</Link>
          <Link to="/termsofuse">Terms Of Use</Link>
          <Link to="/my/orders">Track Orders</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Cancellation &amp; Returns</Link>
          <Link to="/privacypolicy">Privacy policy</Link>
        </div>
        <div className="footer-col">
          <h4>USEFUL LINKS</h4>
          <span>Blog</span>
          <span>Careers</span>
          <span>Site Map</span>
          <span>Corporate Information</span>
          <h4 className="mt">KEEP IN TOUCH</h4>
          <div className="socials">
            <Social label="Facebook" d="M14 8h3V4h-3c-2.8 0-4 1.9-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" />
            <Social label="Twitter" d="M4 4h4.5l4 5.6L17 4h3l-6 7.3L21 20h-4.5l-4.3-6-4.9 6H4.2l6.4-7.6L4 4z" />
            <Social label="YouTube" d="M22 8.2c-.2-1.6-1-2.5-2.5-2.7C17.3 5.2 12 5.2 12 5.2s-5.3 0-7.5.3C3 5.7 2.2 6.6 2 8.2 1.8 9.8 1.8 12 1.8 12s0 2.2.2 3.8c.2 1.6 1 2.5 2.5 2.7 2.2.3 7.5.3 7.5.3s5.3 0 7.5-.3c1.5-.2 2.3-1.1 2.5-2.7.2-1.6.2-3.8.2-3.8s0-2.2-.2-3.8zM10 15V9l5.2 3L10 15z" />
            <Social label="Instagram" d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM17 6a1.1 1.1 0 1 0 0 2.2A1.1 1.1 0 0 0 17 6zM21.9 8c-.1-1.6-.4-3-1.6-4.2S17.6 2.2 16 2.1C14.3 2 9.7 2 8 2.1 6.4 2.2 5 2.5 3.8 3.7S2.2 6.4 2.1 8C2 9.7 2 14.3 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.3 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3.1-8zm-2.1 9.7a3.3 3.3 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.3 3.3 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.3 3.3 0 0 1 6.3 4.5C7.6 4 10.6 4.1 12 4.1s4.4-.1 5.7.4a3.3 3.3 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z" />
          </div>
        </div>
        <div className="footer-col footer-promise">
          <div className="promise">
            <span className="promise-icon">✓</span>
            <p>
              <strong>100% ORIGINAL</strong> guarantee for all products at {site}
            </p>
          </div>
          <div className="promise">
            <span className="promise-icon">↺</span>
            <p>
              <strong>Return within 14 days</strong> of receiving your order
            </p>
          </div>
          <div className="promise">
            <span className="promise-icon">⛟</span>
            <p>
              <strong>Free delivery</strong> on orders above ₹799
            </p>
          </div>
        </div>
      </div>

      <div className="popular">
        <h4>
          POPULAR SEARCHES <i />
        </h4>
        <p>
          {POPULAR.map((p, i) => (
            <span key={p}>
              <Link to={`/search?q=${encodeURIComponent(p)}`}>{p}</Link>
              {i < POPULAR.length - 1 && ' | '}
            </span>
          ))}
        </p>
      </div>

      <div className="footer-bottom">
        <span>
          In case of any concern,{' '}
          <Link to="/contactus" className="pink">
            <b>Contact Us</b>
          </Link>
        </span>
        <span>© 2026 {site}. A student project, not affiliated with Myntra.</span>
      </div>
    </footer>
  );
}
