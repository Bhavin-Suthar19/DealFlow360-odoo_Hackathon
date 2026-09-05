import React from 'react';

export const Card = ({ children, className = '', title, action, subtitle }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 gap-2">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
