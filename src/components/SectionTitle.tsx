import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  align = 'center',
  badge 
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  return (
    <div className={`flex flex-col ${alignmentClasses[align]} mb-12`} id={`section-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {badge && (
        <span className="px-3 py-1 bg-primary-100 text-primary-700 font-bold rounded-full text-xs uppercase tracking-wider mb-3.5 shadow-sm">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight relative pb-4 leading-tight">
        {title}
        <span className={`absolute bottom-0 h-1.5 w-16 bg-accent-500 rounded-full ${
          align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'right' ? 'right-0' : 'left-0'
        }`} />
      </h2>
      {subtitle && (
        <p className="mt-4 text-md sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
