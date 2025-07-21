import { memo, useState } from 'react';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';

const ConfirmDialog = ({ show, handleClose, handleConfirm, message, confirmLabel = "Yes" }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton  className="  m-0 ">
        <Modal.Title>Confirm </Modal.Title>
      </Modal.Header>
      <Modal.Body className="  border-0">{message}</Modal.Body>
      <Modal.Footer className="  border-0">
        <Button variant="light" 
				onClick={handleClose}
				title="No"
				id={`no${confirmLabel}`}
				 
				>
				No
				</Button>
        <Button variant="danger" 
				onClick={handleConfirm}
				title={confirmLabel} 
				id= {confirmLabel} 
				>
				{confirmLabel}
				</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ConfirmDialog);