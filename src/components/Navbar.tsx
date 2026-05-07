import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { path: '/sobre',      label: 'Sobre'               },
  { path: '/produtos',   label: 'Produtos'             },
  { path: '/noticias',   label: 'Notícias'             },
  { path: '/calibracao', label: 'Tabela de Calibração' },
  { path: '/stol',       label: 'Testes STOL'          },
  { path: '/contatos',   label: 'Contatos'             },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = location.pathname.startsWith('/admin');

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          {/* ── Logo ── */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            <div className="navbar__logo-icon">AT</div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">AeroTech</span>
              <span className="navbar__logo-sub">Brasil Aviação</span>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="navbar__links">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar__link ${isActive(item.path) ? 'navbar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ── Burger ── */}
          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-menu__link ${isActive(item.path) ? 'mobile-menu__link--active' : ''}`}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}