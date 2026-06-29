import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  targetValue: number;
  duration?: number; // in ms
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  duration = 1500,
  suffix = '',
  prefix = ''
}) => {
  const [count, setCount] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function: cubic ease-out for ultra smooth deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOutCubic * targetValue);
        
        setCount(currentValue);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(targetValue);
        }
      };

      window.requestAnimationFrame(step);
    };

    // Fallback if IntersectionObserver is not supported in preview sandbox
    if (!('IntersectionObserver' in window)) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [targetValue, duration]);

  return (
    <span ref={elementRef} className="tabular-nums transition-all duration-300">
      {prefix}
      {count}
      {suffix}
    </span>
  );
};
