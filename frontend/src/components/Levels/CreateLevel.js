import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import useAuth from "../../hooks/UseAuth";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";

const CreateLevel = () => {

  const [name, setName] = useState('');
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
        minExperience: checkNumberInput(minExperience),
        isForWords: isForWords,
      };

      console.log(levelData);

      const response = await axiosPrivate.post("/levels", levelData);

      setSuccessMessage("Level created successfully!");
      clearForm();
    } catch (error) {
      console.error("Error creating level:", error);
      setErrorMessage("Failed to create level. Please try again.");
    }
  };

  const clearForm = () => {
    setName('');
    setIsForWords(false);
    setMinExperience(0);
  };

  return (
    <>
      <Title />
      <NavBar />
      <section>
        <div className="form-container">
          <h2>Create New Level</h2>
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
            <div className="form-group">
              <label htmlFor="isForWords">Skirtas žodžiams? :</label><br/>
                <input
                    type="checkbox"
                    id="isForWords"
                    value={isForWords}
                    checked={isForWords}
                    onClick={changeFlagValue}
                    className="input-field"
                />
            </div>
            <button type="submit" className="auth_button">
              Create
            </button>
          </form>
        </div>
        <SuccessModal
          show={successMessage !== ""}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
          buttonText="Go to Therapy List"
          destination="/therapies"
        />
        <ErrorModal
          show={errorMessage !== ""}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
      </section>
      <Footer />
    </>
    
  );
};

export default CreateLevel;