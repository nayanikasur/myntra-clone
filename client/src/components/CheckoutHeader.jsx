import { Link, useLocation } from 'react-router-dom';
import { Logo, ShieldIcon } from './Icons';

const STEPS = [
  ['BAG', '/checkout/cart'],
  ['ADDRESS', '/checkout/address'],
  ['PAYMENT', '/checkout/payment'],
];

export default function CheckoutHeader() {
  const { pathname } = useLocation();
  // the order-success page counts as every step being done
  const current = pathname.startsWith('/checkout/success') ? STEPS.length : STEPS.findIndex(([, path]) => pathname.startsWith(path));

  return (
    <header className="header checkout-header">
      <Link to="/" className="header-logo" aria-label="Home">
        <Logo />
      </Link>
      <ol className="steps">
        {STEPS.map(([label], i) => (
          <li key={label} className={i === current ? 'active' : i < current ? 'done' : ''}>
            {label}
          </li>
        ))}
      </ol>
      <div className="secure">
        <ShieldIcon />
        <span>100% SECURE</span>
      </div>
    </header>
  );
}
