import { Link } from 'react-router-dom';
import Button from '../component/Buttom';

function NotFound() {
  return (
    <div className="container page-section">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>Page not found.</h1>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/">
          <Button>Return home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
