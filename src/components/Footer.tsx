import { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { getContacts, Contact } from '@/lib/contentService';
import './Footer.css';

export default function Footer() {
  const year    = new Date().getFullYear();
  const company = useCompany();
  const name    = company.name || 'AeroTech Brasil';
  const initials = name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    getContacts().then(data => setContacts(data.filter(c => c.active)));
  }, []);

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
            {company.description && (
              <p className="footer__brand-desc">{company.description}</p>
            )}
          </div>

          {/* Contacts */}
          {contacts.length > 0 && (
            <div className="footer__contacts">
              <h3 className="footer__contacts-title">Fale Conosco</h3>
              <div className="footer__contacts-grid">
                {contacts.map((c) => {
                  const ini = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                  return (
                    <div key={c.id} className="footer__contact">
                      <div className="footer__contact-header">
                        <div className="footer__contact-avatar">{ini}</div>
                        <div>
                          <p className="footer__contact-name">{c.name}</p>
                          {c.role    && <p className="footer__contact-role">{c.role}</p>}
                        </div>
                      </div>
                      <ul className="footer__contact-list">
                        {c.email   && <li><span>✉</span><span className="footer__contact-text">{c.email}</span></li>}
                        {c.phone   && <li><span>☎</span><span className="footer__contact-text">{c.phone}</span></li>}
                        {c.mobile  && <li><span>📱</span><span className="footer__contact-text">{c.mobile}</span></li>}
                        {c.address && <li><span>📍</span><span className="footer__contact-text">{c.address}</span></li>}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {year} {name}. Todos os direitos reservados.</p>
          {company.cnpj && <p>{company.cnpj}</p>}
        </div>
      </div>
    </footer>
  );
}