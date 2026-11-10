import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BagIcon, HeartIcon, UserIcon } from '../../components/Icons';

const TILES = [
  ['Orders', 'Check your order status', '/my/orders', BagIcon],
  ['Wishlist', 'All your curated product collections', '/wishlist', HeartIcon],
  ['Addresses', 'Save addresses for a hassle-free checkout', '/my/addresses', UserIcon],
  ['Coupons', 'Manage coupons for additional discounts', '/my/coupons', null],
  ['Profile Details', 'Change your profile details', '/my/profile', UserIcon],
];

export default function Overview() {
  const { user, logout } = useAuth();
  return (
    <div>
      <div className="overview-hero">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <strong>{user.email}</strong>
          {user.mobile && <p>{user.mobile}</p>}
        </div>
        <Link to="/my/profile" className="btn btn-outline btn-sm">
          EDIT PROFILE
        </Link>
      </div>
      <ul className="overview-tiles">
        {TILES.map(([title, sub, to, Icon]) => (
          <li key={title}>
            <Link to={to}>
              {Icon ? <Icon width="32" height="32" /> : <span className="tag-icon big">%</span>}
              <strong>{title}</strong>
              <span>{sub}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-primary logout-wide" onClick={logout}>
        LOGOUT
      </button>
    </div>
  );
}
