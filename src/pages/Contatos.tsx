import Footer from '@/components/Footer';
import './Contatos.css';

const CONTACTS = [
  { name: 'João Carlos Mendes', role: 'Diretor Operacional', email: 'joao.mendes@aerotech.com.br', phone: '(45) 3224-1100', mobile: '(45) 99812-3456', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
  { name: 'Fernanda Oliveira',  role: 'Gerente Comercial',   email: 'fernanda@aerotech.com.br',    phone: '(45) 3224-1101', mobile: '(45) 99900-7788', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
  { name: 'Roberto Cascavel',   role: 'Suporte Técnico',     email: 'roberto@aerotech.com.br',     phone: '(45) 3224-1102', mobile: '(45) 99777-4433', address: 'Av. das Indústrias, 1420 — Palotina, PR' },
];

export default function Contatos() {
  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <p className="page-hero__label">Fale Conosco</p>
        <h1 className="page-hero__title">Contatos</h1>
        <p className="page-hero__subtitle">Nossa equipe está pronta para atendê-lo da melhor forma.</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="contatos__grid">
            {CONTACTS.map((c) => {
              const initials = c.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
              return (
                <div key={c.email} className="contato-card">
                  <div className="contato-card__header">
                    <div className="contato-card__avatar">{initials}</div>
                    <div>
                      <h2 className="contato-card__name">{c.name}</h2>
                      <p className="contato-card__role">{c.role}</p>
                    </div>
                  </div>
                  <ul className="contato-card__list">
                    <li><span>✉</span><span>{c.email}</span></li>
                    <li><span>☎</span><span>{c.phone}</span></li>
                    <li><span>📱</span><span>{c.mobile}</span></li>
                    <li><span>📍</span><span>{c.address}</span></li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
