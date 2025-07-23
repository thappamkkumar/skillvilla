import { Modal, Button, Spinner } from "react-bootstrap";
import handleImageError from "../../../CustomHook/handleImageError";

const OutgoingCallModal = ({ show, onHide, receiver }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-truncate w-100">
          Calling {receiver?.name}...
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center d-flex flex-column align-items-center">
        <div className="mb-3">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Dialing...</p>
        </div>

        <div className="text-center">
          <img
            src={receiver?.image || "/images/profile_icon.png"}
            alt="User Avatar"
            className="rounded-circle img-fluid outgoing-call-avatar mb-3"
            onError={(event) => {
              handleImageError(event, "/images/profile_icon.png");
            }}
          />
          <h5 className="fw-semibold">{receiver?.name}</h5>
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button variant="danger" onClick={onHide}>
          End Call
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OutgoingCallModal;
