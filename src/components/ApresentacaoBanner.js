import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import './ApresentacaoBanner.css';
const IS_APR = import.meta.env.VITE_MODE === 'apresentacao';
export default function ApresentacaoBanner() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [ready, setReady] = useState(false);
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const ref = useRef(null);
    useEffect(() => {
        if (!IS_APR)
            return;
        const w = ref.current?.offsetWidth ?? 340;
        const h = ref.current?.offsetHeight ?? 110;
        setPos({
            x: Math.round((window.innerWidth - w) / 2),
            y: Math.round((window.innerHeight - h) / 2) - 60,
        });
        setReady(true);
    }, []);
    const startDrag = (clientX, clientY) => {
        setDragging(true);
        offset.current = { x: clientX - pos.x, y: clientY - pos.y };
    };
    useEffect(() => {
        if (!dragging)
            return;
        const move = (e) => {
            e.preventDefault(); // impede scroll ao arrastar no mobile
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
            const el = ref.current;
            const w = el?.offsetWidth ?? 340;
            const h = el?.offsetHeight ?? 110;
            setPos({
                x: Math.max(0, Math.min(clientX - offset.current.x, window.innerWidth - w)),
                y: Math.max(0, Math.min(clientY - offset.current.y, window.innerHeight - h)),
            });
        };
        const up = () => setDragging(false);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('touchend', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', up);
        };
    }, [dragging]);
    if (!IS_APR)
        return null;
    return (_jsxs("div", { ref: ref, className: `apr-window ${dragging ? 'apr-window--drag' : ''}`, style: { left: pos.x, top: pos.y, visibility: ready ? 'visible' : 'hidden' }, children: [_jsxs("div", { className: "apr-window__titlebar", onMouseDown: e => startDrag(e.clientX, e.clientY), onTouchStart: e => { e.preventDefault(); startDrag(e.touches[0].clientX, e.touches[0].clientY); }, children: [_jsxs("div", { className: "apr-window__dots", children: [_jsx("span", { className: "apr-window__dot apr-window__dot--red" }), _jsx("span", { className: "apr-window__dot apr-window__dot--yellow" }), _jsx("span", { className: "apr-window__dot apr-window__dot--green" })] }), _jsx("span", { className: "apr-window__titlebar-label", children: "demo.apresentacao" }), _jsx("div", { style: { width: 48 } })] }), _jsxs("div", { className: "apr-window__body", children: [_jsx("div", { className: "apr-window__icon", children: "\uD83D\uDC41" }), _jsxs("div", { className: "apr-window__text", children: [_jsx("p", { className: "apr-window__title", children: "Vers\u00E3o de Apresenta\u00E7\u00E3o" }), _jsx("p", { className: "apr-window__sub", children: "Ambiente de demonstra\u00E7\u00E3o \u2014 visualiza\u00E7\u00E3o exclusiva para o cliente" })] })] })] }));
}
export { IS_APR };
