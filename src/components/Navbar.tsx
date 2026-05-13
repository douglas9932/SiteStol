import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompany';
import { IS_APR } from './ApresentacaoBanner';
import './Navbar.css';

const NAV_ITEMS = [
  { path: '/sobre',      label: 'Sobre'               },
  { path: '/produtos',   label: 'Produtos'             },
  { path: '/noticias',   label: 'Notícias'             },
  { path: '/calibracao', label: 'Tabela de Calibração' },
  { path: '/contatos',   label: 'Contatos'             },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const company = useCompany();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = location.pathname.startsWith('/admin');

  const closeMenu = () => setMenuOpen(false);

  const companyName = company.name || 'AeroTech';
  const firstWord   = companyName.split(' ')[0];
  const rest        = companyName.split(' ').slice(1).join(' ');

  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          {/* ── Logo ── */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            {company.icon_url
              ? <img src={company.icon_url} alt={companyName} className="navbar__logo-img" />
              : <div className="navbar__logo-icon">{companyName.slice(0, 2).toUpperCase()}</div>
            }
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">{firstWord}</span>
              {rest && <span className="navbar__logo-sub">{rest}</span>}
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
          {/* ── Botão Administração (só no modo apresentação) ── */}
          {IS_APR && (
            <button
              className="navbar__admin-btn"
              onClick={() => navigate('/login')}
            >
              🔐 Administração
            </button>
          )}

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