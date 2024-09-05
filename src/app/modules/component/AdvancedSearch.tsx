import { useFormik } from 'formik';
import { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import * as Yup from "yup";
import Autocomplete from '~/app/modules/component/input-field/Autocomplete';
import TextValidator from '~/app/modules/component/input-field/TextValidator';
import "../../profile.scss";
import { TYPE } from '../utils/Constant';
import { IItemSearch } from '../models/models';
import { INIT_INPUT_SEARCH } from '../constant';

type Props = {
  open: boolean
  handleSearch: (listInputSearch: IItemSearch[]) => void;
  handleClose: () => void;
  listInputSearch: IItemSearch[],
  listOption: any[],
}

const AdvancedSearch = (props: Props) => {
  const { open, handleSearch, handleClose, listOption } = props;
  const [listInputSearch, setListInputSearch] = useState<IItemSearch[]>(() => {
    const data = props?.listInputSearch?.filter((item: IItemSearch) => item?.value)
    if (data?.length > 0) {
      return [...data]
    } else {
      return [INIT_INPUT_SEARCH]
    }
  })

  const intl = useIntl();

  const validationSchema = Yup.object().shape({})

  const handleSubmit = () => {
    listOption.map((item: any) => {
      const itemData =  listInputSearch.find((itemSearch: IItemSearch) => itemSearch?.field === item?.field)
      item.value = itemData?.value || null
    })
    handleSearch(listOption)
  }

  const formik = useFormik({
    initialValues: {},
    validationSchema,
    onSubmit: handleSubmit
  })

  const listTobe = [
    { type: TYPE.SELECT, name: "Bằng" },
    { type: TYPE.DATE, name: "Bằng" },
    { type: TYPE.STATUS, name: "Là" },
    { type: TYPE.TEXT, name: "Chứa" },
  ]

  const handleAddField = () => {
    const checkAdd = listInputSearch.every((inputSearch: any) => inputSearch?.value)

    if (checkAdd) {
      const newlist: IItemSearch[] = [...listInputSearch]
      newlist.push(INIT_INPUT_SEARCH)
      setListInputSearch(newlist)
    }
  }

  const handleSelectField = (value: any, index: number) => {
    const newlist: IItemSearch[] = [...listInputSearch]
    newlist[index] = value
    setListInputSearch(newlist)
  }

  const handleSelect = (value: any, index: number) => {
    const newlist: IItemSearch[] = [...listInputSearch]
    newlist[index].value = value
    setListInputSearch(newlist)
  }

  const handleChange = (e: any, index: number) => {
    const newlist: IItemSearch[] = [...listInputSearch]
    newlist[index].value = e.target.value
    setListInputSearch(newlist)
  }

  const handleDelete = (index: number) => {
    if (listInputSearch?.length === 1) {
      return;
    }
    const newlist: IItemSearch[] = [...listInputSearch]
    newlist.splice(index, 1)
    setListInputSearch(newlist)
  }

  const checkISTobe = (type: string) => {
    const tobe = listTobe.find((itemTobe: any) => itemTobe.type === type)
    return tobe?.name ? tobe?.name : listTobe[3].name
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Modal
        show={open}
        size="lg"
        centered
        aria-labelledby="example-custom-modal-styling-title"
        onHide={handleClose}
      >
        <Modal.Header closeButton className="spaces px-16 py-10">
          <Modal.Title
            id="example-custom-modal-styling-title"
            className='spaces fs-16 fw-700'
          >
            <b>Tìm kiếm nâng cao</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='spaces p-16'>
          <div className='advancedSearch'>
            {
              listInputSearch.map((inputSearch: any, index: number) => {
                return (
                  <Row className='spaces mb-16'>
                    <Col className='spaces flex flex-middle'>
                      <div className='flex-1'>
                        <Autocomplete
                          className='w-100'
                          options={listOption}
                          value={inputSearch?.field ? inputSearch : null}
                          onChange={((value) => handleSelectField(value, index))}
                        />
                      </div>
                      <div className='verb'>{checkISTobe(inputSearch?.type)}</div>

                      {
                        (inputSearch?.type === TYPE.SELECT ||
                          inputSearch?.type === TYPE.STATUS) &&
                        <div className='flex-1'>
                          <Autocomplete
                            className='w-100'
                            value={inputSearch?.value || ""}
                            options={inputSearch?.listOption ? inputSearch?.listOption : []}
                            searchFunction={inputSearch?.searchFunction ? inputSearch?.searchFunction : undefined}
                            onChange={((value: any) => handleSelect(value, index))}
                            searchObject={inputSearch?.searchFunction && inputSearch?.searchObject ? inputSearch?.searchObject : {}}
                            dependencies={[inputSearch]}
                            isReadOnly={!inputSearch?.field}
                            getOptionLabel={(option: any) => inputSearch?.optionLabel ? option?.[inputSearch?.optionLabel] : option?.name}
                          />
                        </div>
                      }

                      {
                        (inputSearch?.type === TYPE.TEXT ||
                          inputSearch?.type === TYPE.DATE ||
                          !inputSearch?.type
                        ) &&
                        <TextValidator
                          className='flex-1'
                          name={inputSearch?.field || ""}
                          value={inputSearch?.value || ""}
                          type={inputSearch?.type || TYPE.TEXT}
                          placeholder="Nhập giá trị tìm kiếm"
                          onChange={(e: any) => handleChange(e, index)}
                          readOnly={!inputSearch?.field}
                        />
                      }
                      <div onClick={() => handleDelete(index)}>
                        <i className="bi bi-trash fs-4 px-4"></i>
                      </div>
                    </Col>
                  </Row>
                )
              })
            }

            <div className='flex addField'>
              <p
                className='spaces pr-24'
                onClick={() => setListInputSearch([INIT_INPUT_SEARCH])}
              >
                Làm mới
              </p>
              <p onClick={handleAddField}>Thêm trường</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex-center spaces px-16 py-10">
          <Button variant="primary" className="button-primary btn-sm" onClick={handleSubmit}>
            {intl.formatMessage({ id: "BTN.SEARCH" })}
          </Button>
        </Modal.Footer>
      </Modal>
    </Form>
  )
}

export default AdvancedSearch;