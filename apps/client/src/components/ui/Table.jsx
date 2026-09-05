import React from 'react';

export const Table = ({ headers = [], children, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-800 border-collapse">
        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
          <tr>
            {headers.map((h, index) => (
              <th key={index} className="px-4 py-3.5 tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
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
