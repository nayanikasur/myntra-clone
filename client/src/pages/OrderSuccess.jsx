import { Link, useParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="order-success">
      <div className="success-check">✓</div>
      <h2>Order confirmed</h2>
      <p>Your order is confirmed. You will receive an order confirmation email shortly with the expected delivery date for your items.</p>
      <p className="order-id">Order ID: {id}</p>
      <div className="success-actions">
        <Link to="/profile" className="btn btn-outline-pink">
          VIEW ORDER
        </Link>
        <Link to="/" className="btn btn-primary">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
