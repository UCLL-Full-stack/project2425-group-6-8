import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#95D3AC' }}>
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white text-decoration-none">
        {' '}
        Shared Gorcery List App
      </a>
      <nav className="nav justify-content-center">
        <Link href="/" className="nav-link px-4 fs-5 text-white">
          Home
        </Link>
      </nav>
      <nav className="nav justify-content-center">
        <Link href="/group" className="nav-link px-4 fs-5 text-white">
          Group
        </Link>
      </nav>
    </header>
  );
};

export default Header;
