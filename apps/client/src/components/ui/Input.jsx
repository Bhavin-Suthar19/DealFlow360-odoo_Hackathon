import React from 'react';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  error = null,
  icon: Icon = null
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] transition-colors disabled:opacity-50 ${
            Icon ? 'pl-9 pr-3 py-2' : 'px-3 py-2'
          } ${error ? 'border-rose-500 focus:ring-rose-500' : ''}`}
        />
      </div>
      {error && <span className="text-xs text-rose-500 mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
