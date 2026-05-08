import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
export default function PrivateRoute({ children }) {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Verifica se a sessão expirou (8 horas)
    try {
        const { at } = JSON.parse(auth);
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        if (Date.now() - at > TWENTY_FOUR_HOURS) {
            sessionStorage.removeItem('admin_auth');
            return _jsx(Navigate, { to: "/login", replace: true });
        }
    }
    catch {
        sessionStorage.removeItem('admin_auth');
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
