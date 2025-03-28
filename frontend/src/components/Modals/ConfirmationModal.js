import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import "./ModalStyles.css";

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="confirmation-header"><FiAlertCircle /> Sutikimas</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="secondary-button" onClick={onClose}>Atšaukti</button>
          <button className="primary-button" onClick={onConfirm}>Sutikti</button>         
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
