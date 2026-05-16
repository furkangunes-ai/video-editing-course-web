import React, { useEffect, useRef } from 'react';
import { useIsTouchDevice, useReducedMotion } from '../hooks/useMediaQuery';

export const MouseSpotlight = () => {
    const elRef = useRef(null);
    const isTouch = useIsTouchDevice();
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (isTouch || reducedMotion) return;
        const el = elRef.current;
        if (!el) return;

        let mouseX = 0;
        let mouseY = 0;
        let pending = false;

        const apply = () => {
            el.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 255, 157, 0.06), transparent 40%)`;
            el.style.opacity = '1';
            pending = false;
        };

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!pending) {
                pending = true;
                requestAnimationFrame(apply);
            }
        };

        const onLeave = () => {
            el.style.opacity = '0';
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.body.addEventListener('mouseleave', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.body.removeEventListener('mouseleave', onLeave);
        };
    }, [isTouch, reducedMotion]);

    if (isTouch || reducedMotion) return null;

    return <div ref={elRef} className="mouse-spotlight" aria-hidden="true" style={{ opacity: 0 }} />;
};
