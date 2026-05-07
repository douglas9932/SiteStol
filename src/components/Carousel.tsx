import { useState, useEffect, useCallback, useRef } from 'react';
import { CarouselImage } from '@/context/ContentContext';
import './Carousel.css';

interface CarouselProps {
  images: CarouselImage[];
  autoPlayMs?: number;
}

export default function Carousel({ images, autoPlayMs = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setCurrent((prev) => (prev + dir + images.length) % images.length);
    },
    [images.length]
  );

  const goTo = (i: number) => setCurrent(i);

  // Reset timer on any navigation
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), autoPlayMs);
  }, [go, autoPlayMs]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handlePrev = () => { go(-1); resetTimer(); };
  const handleNext = () => { go(1);  resetTimer(); };

  if (!images.length) {
    return (
      <div className="carousel carousel--empty">
        <p>Nenhuma imagem configurada no carrossel.</p>
      </div>
    );
  }

  return (
    <div className="carousel" aria-label="Carrossel de imagens">
      {/* Track */}
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={img.id} className="carousel__slide">
            <img
              src={img.url}
              alt={img.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="carousel__img"
            />
            <div className="carousel__overlay" />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="carousel__content">
        <p className="carousel__tagline">Excelência em Aviação</p>
        <h1 className="carousel__title">
          Precisão que <span>eleva</span><br />seus resultados
        </h1>
        <p className="carousel__subtitle">
          Soluções aeronáuticas de alta performance para o agronegócio e além
        </p>
      </div>

      {/* Arrows */}
      <button className="carousel__btn carousel__btn--prev" onClick={handlePrev} aria-label="Imagem anterior">
        ‹
      </button>
      <button className="carousel__btn carousel__btn--next" onClick={handleNext} aria-label="Próxima imagem">
        ›
      </button>

      {/* Dots */}
      <div className="carousel__dots" role="tablist">
        {images.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Ir para slide ${i + 1}`}
            className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`}
            onClick={() => { goTo(i); resetTimer(); }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="carousel__progress" key={current}>
        <div className="carousel__progress-bar" style={{ animationDuration: `${autoPlayMs}ms` }} />
      </div>
    </div>
  );
}
