import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { NAV } from '../config';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { BagIcon, HeartIcon, Logo, SearchIcon, UserIcon } from './Icons';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [openMenu, setOpenMenu] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setQuery(params.get('q') || '');
  }, [params]);

  // debounced search suggestions
  useEffect(() => {
    const q = query.trim();
    if (!q || !focused) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      api(`/products/suggest?q=${encodeURIComponent(q)}`)
        .then((s) => !cancelled && setSuggestions(s))
        .catch(() => {});
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, focused]);

  const go = (url) => {
    setFocused(false);
    setSuggestions([]);
    navigate(url);
  };

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) go(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo" aria-label="Home">
        <Logo />
        <span className="logo-tag">CLONE</span>
      </Link>

      <nav className="header-nav">
        {NAV.map((section) => (
          <div
            key={section.key}
            className="nav-item"
            style={{ '--accent': section.color }}
            onMouseEnter={() => setOpenMenu(section.key)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <NavLink to={`/shop/${section.key}`} className="nav-link" onClick={() => setOpenMenu(null)}>
              {section.label}
            </NavLink>
            {openMenu === section.key && (
              <div className="mega-menu">
                {section.groups.map((g) => (
                  <div key={g.title} className="mega-col">
                    <Link
                      to={`/shop/${section.key}?category=${encodeURIComponent(g.items.join(','))}`}
                      className="mega-title"
                      onClick={() => setOpenMenu(null)}
                    >
                      {g.title}
                    </Link>
                    {g.items.map((item) => (
                      <Link
                        key={item}
                        to={`/shop/${section.key}?category=${encodeURIComponent(item)}`}
                        className="mega-link"
                        onClick={() => setOpenMenu(null)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <form className="header-search" onSubmit={submit} role="search">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more"
          aria-label="Search"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {focused && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.type + s.url}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(s.url)}>
                  <span>{s.label}</span>
                  <small>{s.type === 'category' ? `in ${s.sub}` : s.sub}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="header-actions">
        <div className="action profile-action">
          <Link to={user ? '/my/dashboard' : '/login'} className="action-link">
            <UserIcon />
            <span>Profile</span>
          </Link>
          <div className="profile-dropdown">
            {user ? (
              <>
                <p className="pd-title">Hello {user.name}</p>
                <p className="pd-sub">{user.email}</p>
                <hr />
                <Link to="/my/orders">Orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/my/coupons">Coupons</Link>
                <Link to="/my/addresses">Saved Addresses</Link>
                <Link to="/contactus">Contact Us</Link>
                <hr />
                <Link to="/my/profile">Edit Profile</Link>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <p className="pd-title">Welcome</p>
                <p className="pd-sub">To access account and manage orders</p>
                <Link to="/login" className="pd-login">
                  LOGIN / SIGNUP
                </Link>
                <hr />
                <Link to="/my/orders">Orders</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/contactus">Contact Us</Link>
              </>
            )}
          </div>
        </div>
        <Link to="/wishlist" className="action action-link">
          <HeartIcon />
          <span>Wishlist</span>
          {wishlist.length > 0 && <b className="badge">{wishlist.length}</b>}
        </Link>
        <Link to="/checkout/cart" className="action action-link">
          <BagIcon />
          <span>Bag</span>
          {cartCount > 0 && <b className="badge">{cartCount}</b>}
        </Link>
      </div>
    </header>
  );
}
