import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import "./ModalStyles.css";

const SuccessSelectModal = ({ show, onClose, message }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        
        <h2 className="success-header"><FiCheckCircle /> Užklausa sėkminga!</h2>
        <p>{message}</p>
        <div className="modal-buttons single">
          <button className="primary-button" onClick={onClose}>Uždaryti</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessSelectModal;
