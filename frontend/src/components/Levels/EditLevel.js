import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "./levelmodals.css";

const EditLevel = ({ show, onClose, levelId }) => {

  const [name, setName] = useState('');
  const [minExperience, setMinExperience] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axiosPrivate.get(`/levels/${levelId}`);
        const { name, minExperience } = response.data.resource;
        setName(name);
        setMinExperience(minExperience);
      } catch (error) {
        console.error("Klaida gaunant lygį:", error);
        if (error.response && error.response.status === 403) {
          onClose();
        }
      }
    };

    if (levelId !== 0) {
      fetchLevelData();
    }
    
  }, [axiosPrivate, levelId]);

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const checkNumberInput = (value) => {
    return value < 0 || isNaN(value) ? 0 : value;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const levelData = {
        name: sanitizeInput(name),
        minExperience: checkNumberInput(minExperience),
      };

      console.log(levelData);

      const response = await axiosPrivate.put(`/levels/${levelId}`, levelData);

      setSuccessMessage("Level created successfully!");
    } catch (error) {
      console.error("Error creating level:", error);
      setErrorMessage("Failed to create level. Please try again.");
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
          <h2>Redaguoti lygį</h2>
          <form onSubmit={handleSubmit} className = "input_form">
            <div className="form-group">
              <label htmlFor="name">Pavadinimas:</label><br/>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div className="form-group">
              <label htmlFor="minExperience">Minimalus XP skaičius:</label><br/>
                <input
                    type="number"
                    id="minExperience"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    required
                    className="input-field"
                />
            </div>
            
            <div className="modal-buttons-form">
              <button type="submit" className="auth_button">
                Redaguoti
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

export default EditLevel;