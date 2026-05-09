import { useCompany } from '@/hooks/useCompany';
import './Footer.css';

const CONTACTS = [
  {
    name: 'João Carlos Mendes',
    role: 'Diretor Operacional',
    email: 'joao.mendes@aerotech.com.br',
    phone: '(45) 3224-1100',
    mobile: '(45) 99812-3456',
    address: 'Av. das Indústrias, 1420 — Palotina, PR',
  },
  {
    name: 'Fernanda Oliveira',
    role: 'Gerente Comercial',
    email: 'fernanda@aerotech.com.br',
    phone: '(45) 3224-1101',
    mobile: '(45) 99900-7788',
    address: 'Av. das Indústrias, 1420 — Palotina, PR',
  },
];

export default function Footer() {
  const year    = new Date().getFullYear();
  const company = useCompany();
  const name    = company.name || 'AeroTech Brasil';
  const initials = name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <footer className="footer">
      <div className="footer__inner container">
        {/* Top */}
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-logo">
              {company.icon_url
                ? <img src={company.icon_url} alt={name} className="footer__brand-icon-img" />
                : <div className="footer__brand-icon">{initials.slice(0, 2)}</div>
              }
              <span className="footer__brand-name">{name}</span>
            </div>
            <p className="footer__brand-desc">
              Referência nacional em aviação agrícola e serviços aeronáuticos
              desde 2005. Homologados pela ANAC, comprometidos com segurança
              e resultados de alto padrão.
            </p>
            <div className="footer__badges">
              <span className="footer__badge">ANAC Homologado</span>
              <span className="footer__badge">ISO 9001</span>
              <span className="footer__badge">18+ Anos</span>
            </div>
          </div>

          {/* Contacts */}
          <div className="footer__contacts">
            <h3 className="footer__contacts-title">Fale Conosco</h3>
            <div className="footer__contacts-grid">
              {CONTACTS.map((c) => {
                const ini = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                return (
                  <div key={c.email} className="footer__contact">
                    <div className="footer__contact-header">
                      <div className="footer__contact-avatar">{ini}</div>
                      <div>
                        <p className="footer__contact-name">{c.name}</p>
                        <p className="footer__contact-role">{c.role}</p>
                      </div>
                    </div>
                    <ul className="footer__contact-list">
                      <li><span>✉</span>{c.email}</li>
                      <li><span>☎</span>{c.phone}</li>
                      <li><span>📱</span>{c.mobile}</li>
                      <li><span>📍</span>{c.address}</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {year} {name}. Todos os direitos reservados.</p>
          <p>CNPJ: 12.345.678/0001-90 · Palotina, Paraná — Brasil</p>
        </div>
      </div>
    </footer>
  );
}