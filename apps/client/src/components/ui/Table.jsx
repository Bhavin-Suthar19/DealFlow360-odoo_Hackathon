import React from 'react';

export const Table = ({ headers = [], children, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm">
      <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300 border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {headers.map((h, index) => (
              <th key={index} className="px-4 py-3.5 tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {children || (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500 italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
