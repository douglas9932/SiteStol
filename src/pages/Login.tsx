import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { sendEmail, generatePassword } from '@/lib/emailService';
import './Login.css';

type Stage = 'login' | 'forgot' | 'forgot-sending' | 'forgot-sent' | 'forgot-error';

export default function Login() {
  const navigate  = useNavigate();

  const [stage,    setStage]    = useState<Stage>('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const emailRef = useRef<HTMLInputElement>(null);

  /* ── Login ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase não configurado.');

      const { data, error: sbError } = await supabase
        .from('admin_users')
        .select('id, name, active, password')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (sbError || !data) {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }

      if (!data.active) {
        setError('Usuário desativado. Contate o administrador.');
        setLoading(false);
        return;
      }

      if (data.password !== password) {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }

      // Atualiza last_login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      // Salva sessão simples no sessionStorage
      sessionStorage.setItem('admin_auth', JSON.stringify({
        id:    data.id,
        name:  data.name,
        email: email.trim().toLowerCase(),
        at:    Date.now(),
      }));

      navigate('/admin');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Esqueci a senha — fluxo real ── */
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    if (!supabase) { setStage('forgot-error'); return; }

    setStage('forgot-sending');

    try {
      // 1. Verifica se o usuário existe e está ativo
      const { data: user, error: userErr } = await supabase
        .from('admin_users')
        .select('id, name, active')
        .eq('email', forgotEmail.trim().toLowerCase())
        .single();

      if (userErr || !user || !user.active) {
        // Por segurança, simula sucesso mesmo se não encontrar
        setStage('forgot-sent');
        return;
      }

      // 2. Busca dados da SoftwareHouse
      const { data: sw } = await supabase
        .from('software_house')
        .select('name, email, phone, website')
        .single();

      if (!sw) { setStage('forgot-error'); return; }

      // 3. Gera nova senha aleatória
      const newPassword = generatePassword(10);

      // 4. Atualiza no banco
      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({ password: newPassword, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateErr) { setStage('forgot-error'); return; }

      // 5. Envia e-mail via EmailJS
      const sent = await sendEmail({
        to:               forgotEmail.trim().toLowerCase(),
        userName:         user.name,
        newPassword,
        softwareName:     sw.name,
        softwareEmail:    sw.email,
        softwarePhone:    sw.phone,
        softwareWebsite:  sw.website,
      });

      setStage(sent ? 'forgot-sent' : 'forgot-error');

    } catch {
      setStage('forgot-error');
    }
  }

  /* ── Render ── */
  return (
    <div className="login-page">

      {/* Fundo animado */}
      <div className="login-page__bg">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
        <div className="login-page__orb login-page__orb--3" />
      </div>

      {/* Card central */}
      <div className="login-card">

        {/* Logo / marca */}
        <div className="login-card__brand">
          <div className="login-card__logo">
            <span>AT</span>
          </div>
          <div>
            <p className="login-card__brand-name">AeroTech Brasil</p>
            <p className="login-card__brand-sub">Painel Administrativo</p>
          </div>
        </div>

        <div className="login-card__divider" />

        {/* ── Formulário de Login ── */}
        {stage === 'login' && (
          <>
            <div className="login-card__header">
              <h1 className="login-card__title">Bem-vindo de volta</h1>
              <p className="login-card__subtitle">Entre com suas credenciais para continuar</p>
            </div>

            <form className="login-form" onSubmit={handleLogin} noValidate>

              <div className="login-form__field">
                <label className="login-form__label">E-mail</label>
                <div className="login-form__input-wrap">
                  <span className="login-form__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    ref={emailRef}
                    className="login-form__input"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <div className="login-form__field">
                <label className="login-form__label">Senha</label>
                <div className="login-form__input-wrap">
                  <span className="login-form__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="login-form__input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-form__toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-form__error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button className="login-form__submit" type="submit" disabled={loading}>
                {loading ? (
                  <span className="login-form__spinner" />
                ) : (
                  <>
                    Entrar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              <button
                type="button"
                className="login-form__forgot"
                onClick={() => { setStage('forgot'); setError(''); }}
              >
                Esqueceu a senha?
              </button>

            </form>
          </>
        )}

        {/* ── Esqueci a senha ── */}
        {(stage === 'forgot' || stage === 'forgot-sending') && (
          <>
            <div className="login-card__header">
              <h1 className="login-card__title">Recuperar senha</h1>
              <p className="login-card__subtitle">Uma nova senha será gerada e enviada ao seu e-mail</p>
            </div>

            <form className="login-form" onSubmit={handleForgot} noValidate>
              <div className="login-form__field">
                <label className="login-form__label">E-mail cadastrado</label>
                <div className="login-form__input-wrap">
                  <span className="login-form__icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="login-form__input"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoFocus
                    disabled={stage === 'forgot-sending'}
                  />
                </div>
              </div>

              <button className="login-form__submit" type="submit" disabled={stage === 'forgot-sending'}>
                {stage === 'forgot-sending'
                  ? <><span className="login-form__spinner" /> Enviando...</>
                  : 'Gerar nova senha e enviar'
                }
              </button>

              <button
                type="button"
                className="login-form__forgot"
                onClick={() => setStage('login')}
                disabled={stage === 'forgot-sending'}
              >
                ← Voltar ao login
              </button>
            </form>
          </>
        )}

        {/* ── Sucesso ── */}
        {stage === 'forgot-sent' && (
          <div className="login-sent">
            <div className="login-sent__icon">✉️</div>
            <h2 className="login-sent__title">E-mail enviado!</h2>
            <p className="login-sent__text">
              Se o e-mail <strong>{forgotEmail}</strong> estiver cadastrado,
              você receberá a nova senha em instantes. Verifique também a caixa de spam.
            </p>
            <button
              className="login-form__submit"
              onClick={() => { setStage('login'); setForgotEmail(''); }}
            >
              Voltar ao login
            </button>
          </div>
        )}

        {/* ── Erro ── */}
        {stage === 'forgot-error' && (
          <div className="login-sent">
            <div className="login-sent__icon">⚠️</div>
            <h2 className="login-sent__title" style={{ color: '#fca5a5' }}>Falha no envio</h2>
            <p className="login-sent__text">
              Não foi possível enviar o e-mail. Verifique sua conexão ou contate o suporte técnico.
            </p>
            <button
              className="login-form__submit"
              onClick={() => setStage('forgot')}
            >
              Tentar novamente
            </button>
          </div>
        )}

        <p className="login-card__footer">
          © {new Date().getFullYear()} AeroTech Brasil — Acesso restrito
        </p>
      </div>
    </div>
  );
}