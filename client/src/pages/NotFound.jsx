import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state">
      <h3>We couldn't find this page</h3>
      <p>The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn-outline-pink">
        GO TO HOME
      </Link>
    </div>
  );
}
