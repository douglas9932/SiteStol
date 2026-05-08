import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { sendEmail, generatePassword } from '@/lib/emailService';
import './Login.css';
export default function Login() {
    const navigate = useNavigate();
    const [stage, setStage] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const emailRef = useRef(null);
    /* ── Login ── */
    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Preencha e-mail e senha.');
            return;
        }
        setLoading(true);
        try {
            if (!supabase)
                throw new Error('Supabase não configurado.');
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
                id: data.id,
                name: data.name,
                email: email.trim().toLowerCase(),
                at: Date.now(),
            }));
            navigate('/admin');
        }
        catch (err) {
            setError(err.message ?? 'Erro ao conectar. Tente novamente.');
        }
        finally {
            setLoading(false);
        }
    }
    /* ── Esqueci a senha — fluxo real ── */
    async function handleForgot(e) {
        e.preventDefault();
        if (!forgotEmail.trim())
            return;
        if (!supabase) {
            setStage('forgot-error');
            return;
        }
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
            if (!sw) {
                setStage('forgot-error');
                return;
            }
            // 3. Gera nova senha aleatória
            const newPassword = generatePassword(10);
            // 4. Atualiza no banco
            const { error: updateErr } = await supabase
                .from('admin_users')
                .update({ password: newPassword, updated_at: new Date().toISOString() })
                .eq('id', user.id);
            if (updateErr) {
                setStage('forgot-error');
                return;
            }
            // 5. Envia e-mail via EmailJS
            const sent = await sendEmail({
                to: forgotEmail.trim().toLowerCase(),
                userName: user.name,
                newPassword,
                softwareName: sw.name,
                softwareEmail: sw.email,
                softwarePhone: sw.phone,
                softwareWebsite: sw.website,
            });
            setStage(sent ? 'forgot-sent' : 'forgot-error');
        }
        catch {
            setStage('forgot-error');
        }
    }
    /* ── Render ── */
    return (_jsxs("div", { className: "login-page", children: [_jsxs("div", { className: "login-page__bg", children: [_jsx("div", { className: "login-page__orb login-page__orb--1" }), _jsx("div", { className: "login-page__orb login-page__orb--2" }), _jsx("div", { className: "login-page__orb login-page__orb--3" })] }), _jsxs("div", { className: "login-card", children: [_jsxs("div", { className: "login-card__brand", children: [_jsx("div", { className: "login-card__logo", children: _jsx("span", { children: "AT" }) }), _jsxs("div", { children: [_jsx("p", { className: "login-card__brand-name", children: "AeroTech Brasil" }), _jsx("p", { className: "login-card__brand-sub", children: "Painel Administrativo" })] })] }), _jsx("div", { className: "login-card__divider" }), stage === 'login' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "login-card__header", children: [_jsx("h1", { className: "login-card__title", children: "Bem-vindo de volta" }), _jsx("p", { className: "login-card__subtitle", children: "Entre com suas credenciais para continuar" })] }), _jsxs("form", { className: "login-form", onSubmit: handleLogin, noValidate: true, children: [_jsxs("div", { className: "login-form__field", children: [_jsx("label", { className: "login-form__label", children: "E-mail" }), _jsxs("div", { className: "login-form__input-wrap", children: [_jsx("span", { className: "login-form__icon", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), _jsx("polyline", { points: "22,6 12,13 2,6" })] }) }), _jsx("input", { ref: emailRef, className: "login-form__input", type: "email", placeholder: "seu@email.com", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email", autoFocus: true })] })] }), _jsxs("div", { className: "login-form__field", children: [_jsx("label", { className: "login-form__label", children: "Senha" }), _jsxs("div", { className: "login-form__input-wrap", children: [_jsx("span", { className: "login-form__icon", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }), _jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })] }) }), _jsx("input", { className: "login-form__input", type: showPass ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), autoComplete: "current-password" }), _jsx("button", { type: "button", className: "login-form__toggle-pass", onClick: () => setShowPass(!showPass), tabIndex: -1, children: showPass ? (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" }), _jsx("path", { d: "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" }), _jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })] })) : (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] })) })] })] }), error && (_jsxs("div", { className: "login-form__error", children: [_jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), error] })), _jsx("button", { className: "login-form__submit", type: "submit", disabled: loading, children: loading ? (_jsx("span", { className: "login-form__spinner" })) : (_jsxs(_Fragment, { children: ["Entrar", _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) })] })) }), _jsx("button", { type: "button", className: "login-form__forgot", onClick: () => { setStage('forgot'); setError(''); }, children: "Esqueceu a senha?" })] })] })), (stage === 'forgot' || stage === 'forgot-sending') && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "login-card__header", children: [_jsx("h1", { className: "login-card__title", children: "Recuperar senha" }), _jsx("p", { className: "login-card__subtitle", children: "Uma nova senha ser\u00E1 gerada e enviada ao seu e-mail" })] }), _jsxs("form", { className: "login-form", onSubmit: handleForgot, noValidate: true, children: [_jsxs("div", { className: "login-form__field", children: [_jsx("label", { className: "login-form__label", children: "E-mail cadastrado" }), _jsxs("div", { className: "login-form__input-wrap", children: [_jsx("span", { className: "login-form__icon", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), _jsx("polyline", { points: "22,6 12,13 2,6" })] }) }), _jsx("input", { className: "login-form__input", type: "email", placeholder: "seu@email.com", value: forgotEmail, onChange: (e) => setForgotEmail(e.target.value), autoFocus: true, disabled: stage === 'forgot-sending' })] })] }), _jsx("button", { className: "login-form__submit", type: "submit", disabled: stage === 'forgot-sending', children: stage === 'forgot-sending'
                                            ? _jsxs(_Fragment, { children: [_jsx("span", { className: "login-form__spinner" }), " Enviando..."] })
                                            : 'Gerar nova senha e enviar' }), _jsx("button", { type: "button", className: "login-form__forgot", onClick: () => setStage('login'), disabled: stage === 'forgot-sending', children: "\u2190 Voltar ao login" })] })] })), stage === 'forgot-sent' && (_jsxs("div", { className: "login-sent", children: [_jsx("div", { className: "login-sent__icon", children: "\u2709\uFE0F" }), _jsx("h2", { className: "login-sent__title", children: "E-mail enviado!" }), _jsxs("p", { className: "login-sent__text", children: ["Se o e-mail ", _jsx("strong", { children: forgotEmail }), " estiver cadastrado, voc\u00EA receber\u00E1 a nova senha em instantes. Verifique tamb\u00E9m a caixa de spam."] }), _jsx("button", { className: "login-form__submit", onClick: () => { setStage('login'); setForgotEmail(''); }, children: "Voltar ao login" })] })), stage === 'forgot-error' && (_jsxs("div", { className: "login-sent", children: [_jsx("div", { className: "login-sent__icon", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "login-sent__title", style: { color: '#fca5a5' }, children: "Falha no envio" }), _jsx("p", { className: "login-sent__text", children: "N\u00E3o foi poss\u00EDvel enviar o e-mail. Verifique sua conex\u00E3o ou contate o suporte t\u00E9cnico." }), _jsx("button", { className: "login-form__submit", onClick: () => setStage('forgot'), children: "Tentar novamente" })] })), _jsxs("p", { className: "login-card__footer", children: ["\u00A9 ", new Date().getFullYear(), " AeroTech Brasil \u2014 Acesso restrito"] })] })] }));
}
