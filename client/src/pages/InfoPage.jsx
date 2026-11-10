import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND_NAME } from '../config';

// Help & policy pages. Content is written for this demo store and is not legal advice.
const PAGES = {
  contactus: {
    title: 'Contact Us',
    sections: [
      ['Need help with an order?', 'Go to Orders & Returns in your account to track, cancel or review any order. Most questions are answered there instantly.'],
      ['Write to us', `Email support@example.com and include your order ID. We reply within 24 hours.`],
      ['Call us', 'Our demo support line is available from 9 AM to 9 PM, all days of the week.'],
    ],
  },
  faqs: {
    title: 'Frequently Asked Questions',
    faq: [
      ['How do I place an order?', 'Pick a product, choose a size, tap Add to Bag, then go to your Bag and follow the Address and Payment steps.'],
      ['Which payment methods are supported?', 'This demo store supports Cash on Delivery only. Other methods are shown on the payment page but are disabled.'],
      ['How do I apply a coupon?', 'In your Bag, tap Apply under Coupons and pick an eligible coupon, or type a code and tap Check.'],
      ['Can I cancel an order?', 'Yes. Open the order from Orders & Returns and tap Cancel Order while it has not shipped.'],
      ['How do I change my delivery address?', 'You can add, edit or remove addresses from Saved Addresses in your account, or while checking out.'],
      ['Is my password safe?', 'Passwords are hashed before they are stored and are never shown to anyone.'],
    ],
  },
  termsofuse: {
    title: 'Terms of Use',
    sections: [
      ['About this site', `${BRAND_NAME} is a student/portfolio project built to practise full-stack web development. It is not a real store and is not affiliated with Myntra.`],
      ['Orders', 'Orders placed here are not fulfilled and no goods are shipped. Product data and images come from a public demo API.'],
      ['Accounts', 'Please do not reuse a password you use on any real website when creating an account here.'],
      ['Changes', 'These terms may change at any time as the project evolves.'],
    ],
  },
  privacypolicy: {
    title: 'Privacy Policy',
    sections: [
      ['What we store', 'Your name, email, optional mobile number, saved addresses, bag, wishlist and orders, in the project database.'],
      ['How it is used', 'Only to run the features of this demo: logging in, checkout and order history. Nothing is shared with third parties.'],
      ['Deleting your data', 'Ask the project owner to remove your account and all associated data.'],
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    sections: [
      ['Delivery charges', 'Shipping is free on every order in this demo. A flat ₹20 platform fee is added at checkout.'],
      ['Delivery time', 'The pincode checker on product pages shows an estimated delivery date about 4 days from today.'],
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    sections: [
      ['Return window', 'Items show a 14 day return window from delivery.'],
      ['Cancellations', 'Orders can be cancelled from the order details page until they are shipped. Cancelled orders are marked in your order history.'],
    ],
  },
};

const NAV = [
  ['contactus', 'Contact Us'],
  ['faqs', 'FAQ'],
  ['termsofuse', 'Terms of Use'],
  ['privacypolicy', 'Privacy Policy'],
  ['shipping', 'Shipping'],
  ['returns', 'Returns'],
];

export const INFO_SLUGS = Object.keys(PAGES);

export default function InfoPage() {
  const slug = useLocation().pathname.slice(1);
  const page = PAGES[slug];
  const [open, setOpen] = useState(0);

  return (
    <div className="info-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <span>{page.title}</span>
      </div>
      <div className="info-body">
        <nav className="info-nav">
          {NAV.map(([s, label]) => (
            <NavLink key={s} to={`/${s}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <article className="info-content">
          <h1>{page.title}</h1>
          {page.sections?.map(([h, p]) => (
            <section key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </section>
          ))}
          {page.faq && (
            <ul className="faq">
              {page.faq.map(([q, a], i) => (
                <li key={q} className={open === i ? 'open' : ''}>
                  <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
                    {q}
                    <span>{open === i ? '−' : '+'}</span>
                  </button>
                  {open === i && <p>{a}</p>}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </div>
  );
}
