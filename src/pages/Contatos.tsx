import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { getContacts, Contact } from '@/lib/contentService';
import './Contatos.css';

export default function Contatos() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getContacts()
      .then(data => setContacts(data.filter(c => c.active)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Fale Conosco</p>
        <h1 className="page-hero__title">Contatos</h1>
        <p className="page-hero__subtitle">Nossa equipe está pronta para atendê-lo da melhor forma.</p>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
              Carregando...
            </div>
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
              <p>Nenhum contato disponível no momento.</p>
            </div>
          ) : (
            <div className="contatos__grid">
              {contacts.map((c) => {
                const initials = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
                return (
                  <div key={c.id} className="contato-card">
                    <div className="contato-card__header">
                      <div className="contato-card__avatar">{initials}</div>
                      <div>
                        <h2 className="contato-card__name">{c.name}</h2>
                        {c.role && <p className="contato-card__role">{c.role}</p>}
                      </div>
                    </div>
                    <ul className="contato-card__list">
                      {c.email   && <li><span>✉</span><span>{c.email}</span></li>}
                      {c.phone   && <li><span>☎</span><span>{c.phone}</span></li>}
                      {c.mobile  && <li><span>📱</span><span>{c.mobile}</span></li>}
                      {c.address && <li><span>📍</span><span>{c.address}</span></li>}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}