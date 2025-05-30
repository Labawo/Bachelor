import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const CreateBadge = ({ show, onClose }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [badgeType, setBadgeType] = useState('');
  const [trainingType, setTrainingType] = useState(''); 
  const [quizXp, setQuizXp] = useState(0);
  const [trainingXp, setTrainingXp] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [image, setImage] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      let imageData = null;

      if(image.length > 0) {
        imageData = await readFileAsBase64(image);
        console.log(imageData);
      }

      const badgeData = {
        name: sanitizeInput(name),
        description: sanitizeInput(description),
        type: sanitizeInput(badgeType),
        trainingXp: checkNumberInput(trainingXp),
        trainingType: sanitizeInput(trainingType),
        quizXp: checkNumberInput(quizXp),
        WPM : checkNumberInput(wpm),
        image: imageData,
      };

      console.log(badgeData);

      const response = await axiosPrivate.post("/badges", badgeData);

      setSuccessMessage("Ženkliukas sukurtas sėkmingai!");
      clearForm();
    } catch (error) {
      console.error("Įvyko klaida kuriant ženkliuką:", error);
      setErrorMessage("Įvyko klaida kuriant ženkliuką.");
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setBadgeType('');
    setTrainingType('');
    setTrainingXp(0);
    setQuizXp(0);
    setWpm(0);
    setImage([]);
    document.getElementById("image").value = "";
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageFile = (e) => {
    const { files } = e.target;

    setImage(files[0]);

    console.log(image);
  }

  return (
    <>
      <div className={`modal-form ${show ? "show" : ""}`}>
      <div className="modal-content-form"> 
        <div className='close-button-div-form'>
          <button className="primary-button-form" onClick={onClose}>X</button>
        </div>
      
      <div className="outer-form-div">
      <div className="form-container">
          <h2 style={{fontSize: "40px"}}>Sukurti ženklelį</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
                <p style={{color: 'red', fontSize: '12px'}}>*Būtinas laukas</p>
                <input
                    style={{fontSize: "15px"}}
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Įrašyti pavadinimą"
                    required
                />
            </div>
            <div className="form-group">
              <p style={{color: 'red', fontSize: '12px'}}>*</p>
              <textarea
                style={{fontSize: "15px"}}
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Įveskite ženkliuko apibūdinimą"
                required
                className="textarea-field"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            <div className="form-group">
                <p style={{color: 'red', fontSize: '12px'}}>*</p>
                <select
                  id="badgeType"
                  name="badgeType"
                  value={badgeType}
                  onChange={(e) => setBadgeType(e.target.value)}
                  className="select-field"
                  style = {{color: badgeType !== '' ?  'black' : 'grey', fontSize: "15px"}}
                  required
                >
                  <option value="" >Pasirinkti ženkliuko tipą</option>
                  {/*<option key="Training" value="Training">
                    Treniruotei
                  </option>*/}
                  <option key="Quiz" value="Quiz">
                    Testams
                  </option>
                  <option key="Quote" value="Quote">
                    Sakiniams
                  </option>
                </select>
            </div>

            <div className="form-group">
              <input
                style={{color: 'grey', fontSize: '15px'}}
                type="file"
                id="image"
                name="image"
                onChange={handleImageFile}
                accept="image/*"
                className="input-field"
              />
              {errors.image && <span className="error-message">{errors.image}</span>}
            </div>

            {badgeType === "Training" && (
              <>
                <div className="form-group">
                  <label htmlFor="trainingType">Treniruotes tipas:</label><br />
                  <select
                    id="trainingType"
                    name="trainingType"
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value)}
                    className="select-field"
                    required
                  >
                    <option value="">Pasirinkti treniruotės tipą:</option>
                    <option key="Letters" value="Letters">
                      Raidėms
                    </option>
                    <option key="Numbers" value="Numbers">
                      Skaičiams
                    </option>
                    <option key="Symbols" value="Symbols">
                      Simboliams
                    </option>
                    <option key="LTLetters" value="LTLetters">
                      Lietuviškoms raidėms
                    </option>
                  </select>
                </div>

                <div className="form-group">
                <label htmlFor="trainingXp">Minimalus XP skaičius:</label><br/>
                  <input
                      style={{fontSize: "15px"}}
                      type="number"
                      id="traingingXp"
                      value={trainingXp}
                      onChange={(e) => setTrainingXp(e.target.value)}
                      required
                      className="input-field"
                  />
                </div>
              </>             
            )}

            {badgeType === "Quiz" && (
              <div className="form-group">
                <p style={{color: 'red', fontSize: '12px'}}>*</p>
                <input
                    style={{fontSize: "15px"}}
                    type="number"
                    id="quizXp"
                    value={quizXp === 0 ? '' : quizXp}
                    onChange={(e) => setQuizXp(e.target.value)}
                    placeholder="Minimalus XP skaičius:"
                    required
                    className="input-field"
                />
              </div>
            )}

            {badgeType === "Quote" && (
              <div className="form-group">
              <label htmlFor="wpm"></label><br/>
              <p style={{color: 'red', fontSize: '12px'}}>*</p>
                <input
                    style={{fontSize: "15px"}}
                    type="number"
                    id="wpm"
                    value={wpm === 0 ? '' : wpm}
                    onChange={(e) => setWpm(e.target.value)}
                    placeholder="Minimalus žodžių per minutę skaičius:"
                    required
                    className="input-field"
                />
              </div>
            )}
            
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

export default CreateBadge;