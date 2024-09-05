import {FC} from 'react'
import {ButtonToolbar, OverlayTrigger, Pagination, Tooltip} from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import './style.scss'
import {useIntl} from 'react-intl'

interface footerTableProps {
  handlePagesChange: (
    num: number,
    currentPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
  ) => void
  handleRowsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  ) => void
  rowsPerPage: number
  rowsForPage: number[]
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  totalPages: number
}
const FooterTable: FC<footerTableProps> = (props) => {
  const {
    handlePagesChange,
    handleRowsPerPageChange,
    rowsPerPage,
    rowsForPage,
    page,
    setPage,
    setRowsPerPage,
    totalPages,
  } = props
  const intl = useIntl()
  return (
    <div className='d-flex justify-content-between gap-2 border p-4 align-items-center bg-white '>
      <div className='d-flex justify-content-centerr gap-2 align-items-center'>
        {intl.formatMessage({id: 'ROWSPERPAGE'})}
        <Form.Select
          size='sm'
          value={rowsPerPage}
          onChange={(e) => {
            setPage(1)
            handleRowsPerPageChange(e, setRowsPerPage)
          }}
          className='footer-select'
        >
          {rowsForPage.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Form.Select>
      </div>
      <Pagination className='pagination justify-content-center align-items-center'>
        <ButtonToolbar>
          <OverlayTrigger
            placement='top'
            delay={150}
            overlay={
              <Tooltip id='tooltip' className='in'>
                <b>{intl.formatMessage({id: 'TABLE.PAGINATION.FIRST'})}</b>
              </Tooltip>
            }
          >
            <Pagination.First
              disabled={page === 1}
              onClick={() => handlePagesChange(-2, page, setPage, totalPages)}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement='top'
            delay={150}
            overlay={
              <Tooltip id='tooltip' className='in'>
                <b>{intl.formatMessage({id: 'TABLE.PAGINATION.PREVIOUS'})}</b>
              </Tooltip>
            }
          >
            <Pagination.Prev
              disabled={page === 1}
              onClick={() => handlePagesChange(-1, page, setPage, totalPages)}
            />
          </OverlayTrigger>
          <div className='d-flex align-items-center ms-2 me-2 text-gray-600'>
            {page} / {totalPages}
          </div>
          <OverlayTrigger
            placement='top'
            delay={150}
            overlay={
              <Tooltip id='tooltip' className='in'>
                <b>{intl.formatMessage({id: 'TABLE.PAGINATION.NEXT'})}</b>
              </Tooltip>
            }
          >
            <Pagination.Next
              disabled={page === totalPages}
              onClick={() => handlePagesChange(1, page, setPage, totalPages)}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement='top'
            delay={150}
            overlay={
              <Tooltip id='tooltip' className='in'>
                <b>{intl.formatMessage({id: 'TABLE.PAGINATION.LAST'})}</b>
              </Tooltip>
            }
          >
            <Pagination.Last
              disabled={page === totalPages}
              onClick={() => handlePagesChange(2, page, setPage, totalPages)}
            />
          </OverlayTrigger>
        </ButtonToolbar>
      </Pagination>
    </div>
  )
}
export {FooterTable}
