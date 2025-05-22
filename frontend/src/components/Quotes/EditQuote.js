import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const EditQuote = ({ show, onClose, levelId, quoteId }) => {

  const [source, setSource] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [timeToComplete, setTimeToComplete] = useState(30);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axiosPrivate.get(`/levels/${levelId}/quotes/${quoteId}`);
        const { source, author, content, timeToComplete } = response.data.resource;
        setSource(source);
        setAuthor(author);
        setContent(content);
        setTimeToComplete(timeToComplete);
      } catch (error) {
        console.error("Klaida gaunant citatą:", error);
        if (error.response && error.response.status === 403) {
          onClose();
        }
      }
    };

    if (quoteId !== 0 && levelId !== 0) {
      fetchLevelData();
    }
    
  }, [axiosPrivate, levelId, quoteId]);

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

      const response = await axiosPrivate.put(`/levels/${levelId}/quotes/${quoteId}`, quoteData);

      setSuccessMessage("Citata atnaujinta sėkmingai!");
    } catch (error) {
      console.error("Klaida atnaujinant citatą:", error);
      setErrorMessage("Klaida atnaujinant citatą.");
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
            <h2 style={{fontSize: '40px'}}>Atnaujinti citatą</h2>
            <form onSubmit={handleSubmit} className = "input_form">
              <div className="form-group">
                <label htmlFor="source" style={{fontWeight: '600'}}>Šaltinis:</label><br/>
                  <input
                      style={{fontSize: '15px'}}
                      type="text"
                      id="source"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="input-field"
                      required
                  />
              </div>
              <div className="form-group">
                <label htmlFor="author" style={{fontWeight: '600'}}>Autorius:</label><br/>
                  <input
                      style={{fontSize: '15px'}}
                      type="text"
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="input-field"
                      required
                  />
              </div>
              <div className="form-group">
                <label htmlFor="content" style={{fontWeight: '600'}}>Citata:</label><br/>
                <textarea
                  style={{fontSize: '15px'}}
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
                <label htmlFor="timeToComplete" style={{fontWeight: '600'}}>Laikas perrašymui sekundėmis:</label><br/>
                  <input
                      style={{fontSize: '15px'}}
                      type="number"
                      id="timeToComplete"
                      value={timeToComplete}
                      onChange={(e) => setTimeToComplete(e.target.value)}
                      required
                      className="input-field"
                  />
              </div>
              
              <div className="modal-buttons-form">
                <button type="submit" className="create-form-button">
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

export default EditQuote;