import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "./levelmodals.css";

const CreateLevel = ({ show, onClose }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minExperience, setMinExperience] = useState(0);
  const [isForWords, setIsForWords] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const checkNumberInput = (value) => {
    return value < 0 || isNaN(value) ? 0 : value;
  }

  const changeFlagValue = () => {
    return setIsForWords(!isForWords);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const levelData = {
        name: sanitizeInput(name),
        description: sanitizeInput(description),
        minExperience: checkNumberInput(minExperience),
        isForWords: isForWords,
      };

      console.log(levelData);

      const response = await axiosPrivate.post("/levels", levelData);

      setSuccessMessage("Lygis sukurtas sėkmingai!");
      clearForm();
    } catch (error) {
      console.error("Error creating level:", error);
      setErrorMessage(error.response.data);
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setIsForWords(false);
    setMinExperience(0);
  };

  return (
    <>
      <div className={`modal-form ${show ? "show" : ""}`}>
      <div className="modal-content-form"> 
        <div className='close-button-div-form'>
          <button className="primary-button-form" onClick={onClose}>X</button>
        </div>
        <div className="outer-form-div">
        <div className="form-container" style={{color: "black"}}>
          <h2 style={{fontSize: "40px"}}>Sukurti lygį</h2>
          <form onSubmit={handleSubmit} className = "input_form">
            <div className="form-group">
                <p style={{color: 'red', fontSize: '12px'}}>*Būtinas laukas</p>
                <input
                    style={{fontSize: '15px'}}
                    type="text"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Pavadinimas:'
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
              <p style={{color: 'red', fontSize: '12px'}}>*</p>
              <textarea
                style={{fontSize: '15px'}}
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Įveskite lygio apibūdinimą"
                required
                className="textarea-field"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            <div className="form-group">
                <p style={{color: 'red', fontSize: '12px'}}>*</p>
                <input
                    style={{fontSize: '15px'}}
                    type="number"
                    id="minExperience"
                    onChange={(e) => setMinExperience(e.target.value)}
                    placeholder='Minimalus XP skaičius:'
                    required
                    className="input-field"
                />
            </div>
            <div className="form-group">
              <label htmlFor="isForWords" style={{color:'grey', fontSize: '15px'}}>Skirtas žodžiams? </label>
              <span>
                <input
                    style={{fontSize: '15px'}}
                    type="checkbox"
                    id="isForWords"
                    value={isForWords}
                    checked={isForWords}
                    onClick={changeFlagValue}
                    onChange={() => {}}
                    className="input-field"
                />
              </span>
                
            </div>
            
            <div className="modal-buttons-form">
              <button type="submit" className="create-form-button">
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

export default CreateLevel;