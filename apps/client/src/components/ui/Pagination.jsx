import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = ''
}) => {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const isFirstPage = safeCurrentPage <= 1;
  const isLastPage = safeCurrentPage >= totalPages;

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const handleFirst = () => {
    if (!isFirstPage && onPageChange) onPageChange(1);
  };

  const handlePrev = () => {
    if (!isFirstPage && onPageChange) onPageChange(safeCurrentPage - 1);
  };

  const handleNext = () => {
    if (!isLastPage && onPageChange) onPageChange(safeCurrentPage + 1);
  };

  const handleLast = () => {
    if (!isLastPage && onPageChange) onPageChange(totalPages);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-1 border-t border-slate-200 px-4 select-none ${className}`}
    >
      {/* Result metrics & Page size selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {totalItems > 0 ? (
          <span>
            Showing <strong className="font-semibold text-slate-800">{startItem}</strong> to{' '}
            <strong className="font-semibold text-slate-800">{endItem}</strong> of{' '}
            <strong className="font-semibold text-slate-800">{totalItems}</strong> entries
          </span>
        ) : (
          <span>0 entries</span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#714B67] focus:border-[#714B67] outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Move to First */}
        <button
          type="button"
          onClick={handleFirst}
          disabled={isFirstPage}
          title="Move to First Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-2xs"
        >
          <ChevronsLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">First</span>
        </button>

        {/* Move to Previous */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirstPage}
          title="Move to Previous Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* On page out of total pages indicator */}
        <div className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg shadow-2xs">
          <span>
            Page <strong className="font-bold text-[#714B67]">{safeCurrentPage}</strong> of{' '}
            <strong className="font-bold text-slate-900">{totalPages || 1}</strong>
          </span>
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLastPage}
          title="Next Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-2xs"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={handleLast}
          disabled={isLastPage}
          title="Move to Last Page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-2xs"
        >
          <span className="hidden sm:inline">Last</span>
          <ChevronsRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
