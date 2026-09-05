import React from 'react';

export const Card = ({ children, className = '', title, action, subtitle }) => {
  return (
    <div className={`card-depth rounded-xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
