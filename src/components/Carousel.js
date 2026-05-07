import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import './Carousel.css';
export default function Carousel({ images, autoPlayMs = 5000 }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const go = useCallback((dir) => {
        setCurrent((prev) => (prev + dir + images.length) % images.length);
    }, [images.length]);
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
    if (!images.length) {
        return (_jsx("div", { className: "carousel carousel--empty", children: _jsx("p", { children: "Nenhuma imagem configurada no carrossel." }) }));
    }
    return (_jsxs("div", { className: "carousel", "aria-label": "Carrossel de imagens", children: [_jsx("div", { className: "carousel__track", style: { transform: `translateX(-${current * 100}%)` }, children: images.map((img, i) => (_jsxs("div", { className: "carousel__slide", children: [_jsx("img", { src: img.url, alt: img.alt, loading: i === 0 ? 'eager' : 'lazy', className: "carousel__img" }), _jsx("div", { className: "carousel__overlay" })] }, img.id))) }), _jsxs("div", { className: "carousel__content", children: [_jsx("p", { className: "carousel__tagline", children: "Excel\u00EAncia em Avia\u00E7\u00E3o" }), _jsxs("h1", { className: "carousel__title", children: ["Precis\u00E3o que ", _jsx("span", { children: "eleva" }), _jsx("br", {}), "seus resultados"] }), _jsx("p", { className: "carousel__subtitle", children: "Solu\u00E7\u00F5es aeron\u00E1uticas de alta performance para o agroneg\u00F3cio e al\u00E9m" })] }), _jsx("button", { className: "carousel__btn carousel__btn--prev", onClick: handlePrev, "aria-label": "Imagem anterior", children: "\u2039" }), _jsx("button", { className: "carousel__btn carousel__btn--next", onClick: handleNext, "aria-label": "Pr\u00F3xima imagem", children: "\u203A" }), _jsx("div", { className: "carousel__dots", role: "tablist", children: images.map((_, i) => (_jsx("button", { role: "tab", "aria-selected": i === current, "aria-label": `Ir para slide ${i + 1}`, className: `carousel__dot ${i === current ? 'carousel__dot--active' : ''}`, onClick: () => { goTo(i); resetTimer(); } }, i))) }), _jsx("div", { className: "carousel__progress", children: _jsx("div", { className: "carousel__progress-bar", style: { animationDuration: `${autoPlayMs}ms` } }) }, current)] }));
}
