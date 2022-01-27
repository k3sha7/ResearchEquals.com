import { ChevronLeft32, ChevronRight32 } from "@carbon/icons-react"

const FeedPagination = ({
  ITEMS_PER_PAGE,
  page,
  count,
  goToPreviousPage,
  goToPage,
  goToNextPage,
  hasMore,
}) => {
  return (
    <>
      <div className="flex my-1  max-w-screen">
        <div className="hidden flex-1 sm:flex items-center justify-between"></div>
        <nav
          className="relative z-0 inline-flex rounded-md border border-gray-300 dark:border-gray-600 -space-x-px divide-x divide-gray-300 dark:divide-gray-600 mx-auto mb-8"
          aria-label="Pagination"
        >
          <button
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={page === 0}
            onClick={goToPreviousPage}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft32 className="h-5 w-5" aria-hidden="true" />
          </button>
          {/* TODO: Drop middle buttons that don't fit screen */}
          {Array.from({ length: Math.ceil(count / ITEMS_PER_PAGE) }, (x, i) => i).map((pageNr) => (
            <button
              key={`page-nav-feed-${pageNr}`}
              className={
                page == pageNr
                  ? "relative inline-flex items-center px-2 py-2 text-sm font-medium text-indigo-600 dark:text-gray-200 bg-indigo-50 dark:bg-gray-700 ring-1 ring-indigo-600 z-10 dark:ring-0"
                  : "relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }
              disabled={page === pageNr}
              onClick={() => {
                goToPage(pageNr)
              }}
            >
              <span className="sr-only">Navigate to page {pageNr}</span>
              <span className="h-5 w-5 " aria-hidden="true">
                {pageNr + 1}
              </span>
            </button>
          ))}
          <button
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={!hasMore}
            onClick={goToNextPage}
          >
            <span className="sr-only">Previous</span>
            <ChevronRight32 className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </>
  )
}

export default FeedPagination