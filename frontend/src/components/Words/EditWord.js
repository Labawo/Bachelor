import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const EditWord = ({ show, onClose, levelId, wordId }) => {

  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axiosPrivate.get(`/levels/${levelId}/words/${wordId}`);
        const { question, correctAnswer } = response.data.resource;
        setQuestion(question);
        setCorrectAnswer(correctAnswer);
      } catch (error) {
        console.error("Klaida gaunant klausimą:", error);
        if (error.response && error.response.status === 403) {
          onClose();
        }
      }
    };

    if (wordId !== 0 && levelId !== 0) {
      fetchLevelData();
    }
    
  }, [axiosPrivate, levelId, wordId]);

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wordData = {
        question: sanitizeInput(question),
        correctAnswer: sanitizeInput(correctAnswer),
      };

      console.log(wordData);

      const response = await axiosPrivate.put(`/levels/${levelId}/words/${wordId}`, wordData);

      setSuccessMessage("Klausimas atnaujinta sėkmingai!");
    } catch (error) {
      console.error("Klaida atnaujinant klausimą:", error);
      setErrorMessage("Klaida atnaujinant klausimą.");
    }
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
            <h2>Atnaujinti klausimą</h2>
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
                <label htmlFor="correctAnswer">Atsakymas:</label><br/>
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
                  Atnaujinti
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

export default EditWord;