import { useState, useRef, useEffect } from 'react';
import './ApresentacaoBanner.css';

const IS_APR = import.meta.env.VITE_MODE === 'apresentacao';

export default function ApresentacaoBanner() {
  const [pos, setPos]       = useState({ x: 0, y: 0 });
  const [ready, setReady]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_APR) return;
    const w = ref.current?.offsetWidth  ?? 340;
    const h = ref.current?.offsetHeight ?? 110;
    setPos({
      x: Math.round((window.innerWidth  - w) / 2),
      y: Math.round((window.innerHeight - h) / 2) - 60,
    });
    setReady(true);
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    setDragging(true);
    offset.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
      const el  = ref.current;
      const w   = el?.offsetWidth  ?? 340;
      const h   = el?.offsetHeight ?? 110;
      setPos({
        x: Math.max(0, Math.min(clientX - offset.current.x, window.innerWidth  - w)),
        y: Math.max(0, Math.min(clientY - offset.current.y, window.innerHeight - h)),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup',   up);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend',  up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup',   up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend',  up);
    };
  }, [dragging]);

  if (!IS_APR) return null;

  return (
    <div
      ref={ref}
      className={`apr-window ${dragging ? 'apr-window--drag' : ''}`}
      style={{ left: pos.x, top: pos.y, visibility: ready ? 'visible' : 'hidden' }}
    >
      {/* Barra de título — área de arrastar */}
      <div
        className="apr-window__titlebar"
        onMouseDown={e => startDrag(e.clientX, e.clientY)}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      >
        <div className="apr-window__dots">
          <span className="apr-window__dot apr-window__dot--red"   />
          <span className="apr-window__dot apr-window__dot--yellow"/>
          <span className="apr-window__dot apr-window__dot--green" />
        </div>
        <span className="apr-window__titlebar-label">demo.apresentacao</span>
        <div style={{ width: 48 }} />
      </div>

      {/* Corpo da janela */}
      <div className="apr-window__body">
        <div className="apr-window__icon">👁</div>
        <div className="apr-window__text">
          <p className="apr-window__title">Versão de Apresentação</p>
          <p className="apr-window__sub">Ambiente de demonstração — visualização exclusiva para o cliente</p>
        </div>
      </div>
    </div>
  );
}

export { IS_APR };