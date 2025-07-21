import { memo, useState } from 'react';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';

function MessageAlert({showModel, setShowModel, message} ) {
  
	const handleClose = ()=>
	{
		setShowModel(false);
	}
  return (
    <> 
      <Modal show={showModel} onHide={handleClose}>
        <Modal.Header closeButton className="  m-0 ">
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
				<Modal.Body className="  border-0">{message}</Modal.Body>
        <Modal.Footer className="  border-0">
          <Button variant="secondary" onClick={handleClose} title="Close alert message box" id="closeAlertMessageBox">
            Close
          </Button> 
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default memo(MessageAlert);