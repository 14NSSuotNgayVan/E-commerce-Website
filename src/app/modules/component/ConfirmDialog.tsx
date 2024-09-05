import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/index.scss'
import useMultiLanguage from '~/app/hook/useMultiLanguage';
type ConfirmDialogProps = {
  view: boolean
  onYesClick: () => void;
  onCancelClick: () => void;
  Title?: string;
  Description?: string;
};
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  view,
  onYesClick,
  onCancelClick,
  Title = "Xác nhận",
  Description,
}) => {
  const { lang } = useMultiLanguage();
  return (
    <Modal show={view} onHide={onCancelClick}
      size="sm"
      centered
      dialogClassName="confirm-dialog">
      <Modal.Header className="white" closeButton>
        <Modal.Title className="text-dark">{Title}</Modal.Title>
      </Modal.Header>
      {Description &&
        <Modal.Body>
          <div className=''>{Description}</div>
        </Modal.Body>
      }
      <Modal.Footer>
        <Button variant="primary" className='btn-sm' onClick={onYesClick}>
          {lang('BTN.YES')}
        </Button>
        <Button variant="secondary" className='btn-sm' onClick={onCancelClick}>
          {lang('BTN.CANCEL')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmDialog;
