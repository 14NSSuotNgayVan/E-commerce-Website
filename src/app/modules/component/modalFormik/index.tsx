import { FC, ReactNode } from 'react'
import { Button, Modal, ModalProps } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { Form, FormikValues, useFormik, FormikConfig, FormikContext } from 'formik'
import '../../component/style.scss'

interface ModalFormikProps extends ModalProps{
    handleClose: () => void
    title: string
    textCancelBtn: string
    textSubmitBtn: string
    children: (formilk: any) => ReactNode | ReactNode
    disableBtnSave?: boolean
    disableBtnCancel?: boolean
    renderModalFooter?: ReactNode
    FormikConfig: FormikConfig<FormikValues>
}

const ModalFormikCustom: FC<ModalFormikProps> = ({ children, ...props }) => {
    const {
        title,
        textCancelBtn,
        textSubmitBtn,
        handleClose,
        renderModalFooter = null,
        disableBtnSave = false,
        disableBtnCancel = false,
        ...rest
    } = props;

    const intl = useIntl()
    const formikStateAndHelpers = useFormik(props?.FormikConfig);
    return (
        <Modal
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            {...rest}
        >
            <FormikContext.Provider value={formikStateAndHelpers}>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title className='text-pri '>
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {typeof children === 'function' ? children(formikStateAndHelpers) : children}
                    </Modal.Body>
                    <Modal.Footer className='pt-2 pb-2'>
                        {renderModalFooter ?
                            renderModalFooter :
                            <>
                                <Button
                                    variant='secondary'
                                    className='btn btn-outline-primary'
                                    disabled={disableBtnCancel}
                                    onClick={handleClose}
                                >
                                    {textCancelBtn ? textCancelBtn : intl.formatMessage({ id: 'BTN.CANCEL' })}
                                </Button>
                                <Button
                                    type='submit'
                                    className='btn bg-pri'
                                    disabled={disableBtnSave}
                                >
                                    {textSubmitBtn ? textSubmitBtn : intl.formatMessage({ id: 'BTN.SAVE' })}
                                </Button>
                            </>
                        }
                    </Modal.Footer>
                </Form>
            </FormikContext.Provider>
        </Modal>
    )
}
export { ModalFormikCustom }
