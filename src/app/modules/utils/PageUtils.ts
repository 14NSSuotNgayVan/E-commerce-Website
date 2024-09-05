export interface PageInfo {
  page: number
  rowOfPage: number
}

export const handlePagesChange = (
  num: number,
  currentPage: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number
): void => {
  if (num === 1) {
    setPage(currentPage + 1)
  } else if (num === -1 && currentPage >= 2) {
    setPage(currentPage - 1)
  } else if (num === 2) {
    setPage(totalPages)
  } else if (num === -2) {
    setPage(1)
  }
}

export const handleMoveMonthClick = (
  bool: boolean,
  month: number,
  setMonth: React.Dispatch<React.SetStateAction<number>>,
  year: number,
  setYear: React.Dispatch<React.SetStateAction<number>>
) => {
  if (bool === true) {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  } else if (bool === false) {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }
}
export const handleRowsPerPageChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
) => {
  setRowsPerPage(parseInt(event.target.value))
}

export const rowsForPage = [1, 2, 3, 5, 10, 15, 20, 50, 100]
export const MAX_PAGE_SIZE = 1000;
export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 10;