import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { NAV } from '../config';

const SLIDES = [
  { gender: 'women', kicker: 'END OF SEASON SALE', title: 'MIN. 50% OFF', sub: 'Dresses, tops, heels & more', bg: 'linear-gradient(110deg,#ffe3ea 0%,#ffc2d1 45%,#ff8fab 100%)', ink: '#9b0f37' },
  { gender: 'men', kicker: 'THE STYLE EDIT', title: 'UNDER ₹2,999', sub: 'Shirts, sneakers & watches', bg: 'linear-gradient(110deg,#e3efff 0%,#bcd6ff 45%,#7fa8f0 100%)', ink: '#13306b' },
  { gender: 'beauty', kicker: 'BEAUTY BONANZA', title: 'UP TO 60% OFF', sub: 'Makeup, skincare & fragrances', bg: 'linear-gradient(110deg,#defaf5 0%,#b0eee2 45%,#6ad3c1 100%)', ink: '#0a5c52' },
  { gender: 'home', kicker: 'HOME MAKEOVER', title: 'FROM ₹299', sub: 'Decor, furniture & kitchen', bg: 'linear-gradient(110deg,#fff6db 0%,#ffe7a3 45%,#f6c95c 100%)', ink: '#6b4a00' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    api('/products?limit=100').then((d) => setProducts(d.products)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // one tile per category, using the first product image we have for it
  const tiles = NAV.flatMap((n) =>
    [...new Set(n.groups.flatMap((g) => g.items))].map((cat) => ({
      gender: n.key,
      cat,
      product: products.find((p) => p.gender === n.key && p.category === cat),
    }))
  ).filter((t) => t.product);

  const deals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 12);
  const brands = [...new Map(products.map((p) => [p.brand, p])).values()].slice(0, 12);
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 12);

  return (
    <div className="home">
      <Link to="/checkout/cart" className="ticket coupon-ticket">
        <div className="ticket-left">
          <strong>Flat ₹300 Off</strong>
          <span>on orders above ₹999</span>
        </div>
        <div className="ticket-mid">
          <div className="ticket-code">
            <small>
              COUPON
              <br />
              CODE
            </small>
            <b>NEW300</b>
          </div>
          <span>On your first order | T&amp;C apply</span>
        </div>
        <div className="ticket-pct" aria-hidden="true">
          %
        </div>
      </Link>

      <section className="hero">
        {SLIDES.map((s, i) => {
          const pics = products.filter((p) => p.gender === s.gender).slice(0, 3);
          return (
            <Link
              key={s.kicker}
              to={`/shop/${s.gender}`}
              className={`hero-slide ${i === slide ? 'active' : ''}`}
              style={{ background: s.bg, color: s.ink }}
              aria-hidden={i !== slide}
              tabIndex={i === slide ? 0 : -1}
            >
              <div className="hero-copy">
                <span className="hero-kicker">{s.kicker}</span>
                <h2>{s.title}</h2>
                <p>{s.sub}</p>
                <span className="hero-cta" style={{ background: s.ink }}>
                  Shop Now
                </span>
              </div>
              <div className="hero-pics">
                {pics.map((p) => (
                  <img key={p._id} src={p.thumbnail} alt="" />
                ))}
              </div>
            </Link>
          );
        })}
      </section>
      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button key={s.kicker} type="button" aria-label={`Slide ${i + 1}`} className={i === slide ? 'active' : ''} onClick={() => setSlide(i)} />
        ))}
      </div>

      <div className="ticket bank-ticket">
        <div className="bank-cards" aria-hidden="true">
          <i />
          <i />
        </div>
        <div className="bank-copy">
          <strong>10% Instant Discount + Extra Cashback*</strong>
          <span>ON SELECT CREDIT &amp; DEBIT CARDS</span>
        </div>
        <small className="bank-tc">*T&amp;C Apply</small>
      </div>

      <Link to="/my/coupons" className="side-offer">
        UPTO ₹300 OFF
      </Link>

      <h2 className="section-title">MEDAL WORTHY BRANDS TO BAG</h2>
      <ul className="tile-row">
        {brands.map((p) => (
          <li key={p.brand}>
            <Link to={`/search?q=${encodeURIComponent(p.brand)}`} className="brand-tile">
              <img src={p.thumbnail} alt="" loading="lazy" />
              <div className="brand-band">
                <strong>{p.brand}</strong>
                <span>Min. {p.discount}% OFF</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="section-title">DEAL OF THE DAY</h2>
      <ul className="tile-row">
        {deals.map((p) => (
          <li key={p._id}>
            <Link to={`/product/${p._id}`} className="deal-tile">
              <img src={p.thumbnail} alt={p.title} loading="lazy" />
              <div className="deal-band">
                <strong>{p.category}</strong>
                <span className="deal-off">UP TO {p.discount}% OFF</span>
                <span>Shop Now</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="section-title">SHOP BY CATEGORY</h2>
      <ul className="category-grid">
        {tiles.map((t) => (
          <li key={`${t.gender}-${t.cat}`}>
            <Link to={`/shop/${t.gender}?category=${encodeURIComponent(t.cat)}`} className="category-tile">
              <img src={t.product.thumbnail} alt="" loading="lazy" />
              <div className="category-band">
                <strong>{t.cat}</strong>
                <span>40-80% OFF</span>
                <em>Shop Now</em>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="section-title">TRENDING NOW</h2>
      <ul className="tile-row">
        {trending.map((p) => (
          <li key={p._id}>
            <Link to={`/product/${p._id}`} className="trend-tile">
              <img src={p.thumbnail} alt={p.title} loading="lazy" />
              <strong>{p.brand}</strong>
              <span>{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
