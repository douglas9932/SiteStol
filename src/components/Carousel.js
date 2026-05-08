import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import './Carousel.css';
export default function Carousel({ images = [], autoPlayMs = 5000, tagline, title, subtitle }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const safeLen = (images ?? []).length || 1;
    const go = useCallback((dir) => {
        setCurrent((prev) => (prev + dir + safeLen) % safeLen);
    }, [safeLen]);
    const goTo = (i) => setCurrent(i);
    // Reset timer on any navigation
    const resetTimer = useCallback(() => {
        if (timerRef.current)
            clearInterval(timerRef.current);
        timerRef.current = setInterval(() => go(1), autoPlayMs);
    }, [go, autoPlayMs]);
    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current)
            clearInterval(timerRef.current); };
    }, [resetTimer]);
    const handlePrev = () => { go(-1); resetTimer(); };
    const handleNext = () => { go(1); resetTimer(); };
    const safeImages = images ?? [];
    if (!safeImages.length) {
        return (_jsx("div", { className: "carousel carousel--empty", children: _jsx("p", { children: "Nenhuma imagem configurada no carrossel." }) }));
    }
    const hasText = !!(tagline || title || subtitle);
    return (_jsxs("div", { className: `carousel ${hasText ? '' : 'carousel--no-text'}`, "aria-label": "Carrossel de imagens", children: [_jsx("div", { className: "carousel__track", style: { transform: `translateX(-${current * 100}%)` }, children: safeImages.map((img, i) => (_jsxs("div", { className: "carousel__slide", children: [_jsx("img", { src: img.url, alt: img.alt, loading: i === 0 ? 'eager' : 'lazy', className: "carousel__img" }), hasText && _jsx("div", { className: "carousel__overlay" })] }, img.id))) }), hasText && (_jsxs("div", { className: "carousel__content", children: [tagline && _jsx("p", { className: "carousel__tagline", children: tagline }), title && _jsx("h1", { className: "carousel__title", children: title }), subtitle && _jsx("p", { className: "carousel__subtitle", children: subtitle })] })), _jsx("button", { className: "carousel__btn carousel__btn--prev", onClick: handlePrev, "aria-label": "Imagem anterior", children: "\u2039" }), _jsx("button", { className: "carousel__btn carousel__btn--next", onClick: handleNext, "aria-label": "Pr\u00F3xima imagem", children: "\u203A" }), _jsx("div", { className: "carousel__dots", role: "tablist", children: safeImages.map((_, i) => (_jsx("button", { role: "tab", "aria-selected": i === current, "aria-label": `Ir para slide ${i + 1}`, className: `carousel__dot ${i === current ? 'carousel__dot--active' : ''}`, onClick: () => { goTo(i); resetTimer(); } }, i))) }), _jsx("div", { className: "carousel__progress", children: _jsx("div", { className: "carousel__progress-bar", style: { animationDuration: `${autoPlayMs}ms` } }) }, current)] }));
}
