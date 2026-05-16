import { useEffect, useRef, useState } from 'react';

export const useCountUp = (target, { duration = 1800, startWhenVisible = true } = {}) => {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.floor(eased * target));
        if (t < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    };

    if (!startWhenVisible) {
      run();
      return;
    }

    const node = elementRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration, startWhenVisible]);

  return { value, ref: elementRef };
};

export const formatNumber = (n) => n.toLocaleString('tr-TR');
