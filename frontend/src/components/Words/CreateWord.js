import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const CreateWord = ({ show, onClose, levelId }) => {

  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wordData = {
        question: sanitizeInput(question),
        correctAnswer: sanitizeInput(correctAnswer),
        isOpen:isOpen,
      };

      console.log(wordData);

      const response = await axiosPrivate.post(`/levels/${levelId}/words`, wordData);

      setSuccessMessage("Klausimas sukurtas sėkmingai!");
      clearForm();
    } catch (error) {
      console.error("Klaida sukuriant klausimą:", error);
      setErrorMessage("Klaida sukuriant klausimą.");
    }
  };

  const clearForm = () => {
    setQuestion('');
    setCorrectAnswer('');
  };

  return (
    <>
      <div className={`modal-form ${show ? "show" : ""}`}>
      <div className="modal-content-form"> 
        <div className='close-button-div-form'>
          <button className="primary-button-form" onClick={onClose}>X</button>
        </div>
        <div className="outer-form-div">
          <div className="form-container">
            <h2>Sukurti naują klausimą</h2>
            <form onSubmit={handleSubmit} className = "input_form">
              <div className="form-group">
                <label htmlFor="question">Klausimas:</label><br/>
                  <input
                      type="text"
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="input-field"
                      required
                  />
              </div>
              <div className="form-group">
                <label htmlFor="correctAnswer">Teisingas atsakymas:</label><br/>
                  <input
                      type="text"
                      id="correctAnswer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="input-field"
                      required
                  />
              </div>
              
              <div className="modal-buttons-form">
                <button type="submit" className="auth_button">
                  Sukurti
                </button>
              </div>
            </form>
          </div>
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

export default CreateWord;