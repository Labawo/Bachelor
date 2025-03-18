import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const CreateQuote = ({ show, onClose, levelId }) => {

  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [timeToComplete, setTimeToComplete] = useState(30);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const checkNumberInput = (value) => {
    return value < 30 || isNaN(value) ? 30 : value;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const quoteData = {
        source: sanitizeInput(source),
        author: sanitizeInput(author),
        content: sanitizeInput(content),
        timeToComplete: checkNumberInput(timeToComplete),
      };

      console.log(quoteData);

      const response = await axiosPrivate.post(`/levels/${levelId}/quotes`, quoteData);

      setSuccessMessage("Citata sukurta sėkmingai!");
      clearForm();
    } catch (error) {
      console.error("Klaida sukuriant citatą:", error);
      setErrorMessage("Klaida sukuriant citatą.");
    }
  };

  const clearForm = () => {
    setSource('');
    setContent('');
    setAuthor('');
    setTimeToComplete(30);
  };

  return (
    <>
      <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content"> 
      <div className="form-container">
          <h2>Sukurti naują citatą</h2>
          <form onSubmit={handleSubmit} className = "input_form">
            <div className="form-group">
              <label htmlFor="source">Šaltinis:</label><br/>
                <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
              <label htmlFor="author">Autorius:</label><br/>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
              <label htmlFor="content">Citata:</label><br/>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Įveskite citatą"
                required
                className="textarea-field"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="minExperience">Laikas perrašymui sekundėmis:</label><br/>
                <input
                    type="number"
                    id="minExperience"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    required
                    className="input-field"
                />
            </div>
            
            <div className="modal-buttons">
              <button type="submit" className="auth_button">
                Sukurti
              </button>
            </div>
          </form>
          <button className="primary-button" onClick={onClose}>Atšaukti</button>
        </div>
        <SuccessSelectModal
          show={successMessage !== ""}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
        <ErrorModal
          show={errorMessage !== ""}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
      </div>
      </div>
    </>
    
  );
};

export default CreateQuote;