import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import "./ModalStyles.css";

const ErrorModal = ({ show, onClose, message }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        
        <h2 className="error-header"><FiAlertTriangle /> Klaida</h2>
        <p>{message}</p>
        <div className="modal-buttons single">
          <button className="primary-button" onClick={onClose}>Uždaryti</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
