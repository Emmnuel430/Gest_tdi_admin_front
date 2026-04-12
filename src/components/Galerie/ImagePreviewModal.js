import { Modal } from "react-bootstrap";

const ImagePreviewModal = ({ show, onClose, image }) => {
  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{image?.titre}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center bg-body">
        {image?.media?.url && (
          <img
            src={image.media.url}
            alt={image.titre || "image"}
            className="w-100"
            style={{
              height: "400px",
              // objectFit: "cover",
              objectFit: "contain",
            }}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;
