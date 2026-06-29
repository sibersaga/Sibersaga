import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white rounded-full shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center border border-orange-400/20 group"
          aria-label="Kembali ke Atas"
          title="Kembali ke Atas"
          id="back-to-top-button"
        >
          <ArrowUp size={18} className="stroke-[2.5] group-hover:animate-bounce" />
        </button>
      )}
    </>
  );
};
