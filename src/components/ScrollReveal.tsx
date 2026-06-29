import React, { useState, useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  threshold = 0.05,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reveal = () => {
      setIsRevealed(true);
    };

    // Fallback if IntersectionObserver is not available in the preview runtime
    if (!('IntersectionObserver' in window)) {
      const timer = setTimeout(reveal, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(reveal, delay);
          observer.unobserve(element);
        }
      },
      {
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay, threshold]);

  // Combined styling for transition duration, ease, and initial/revealed states
  const transitionStyle = {
    transitionDuration: `${duration}ms`,
  };

  const animationClasses = isRevealed
    ? 'opacity-100 translate-y-0 filter-none'
    : 'opacity-0 translate-y-8 blur-[1px]';

  return (
    <div
      ref={elementRef}
      style={transitionStyle}
      className={`transition-all ease-out ${animationClasses} ${className}`}
    >
      {children}
    </div>
  );
};
