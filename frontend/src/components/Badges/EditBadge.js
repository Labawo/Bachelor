import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import SuccessSelectModal from "../Modals/SuccessSelectModal";
import ErrorModal from "../Modals/ErrorModal";
import "../Levels/levelmodals.css";

const EditBadge = ({ show, onClose, badgeId }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState([]);
  const [imageDataState, setImageDataState] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const response = await axiosPrivate.get(`/badges/${badgeId}`);
        const { name, description, image } = response.data;
        setName(name);
        setDescription(description);
        setImageDataState(image);
        console.log(response.data);
        console.log(imageDataState);
      } catch (error) {
        console.error("Klaida gaunant ženkliuką", error);
        if (error.response && error.response.status === 403) {
          onClose();
        }
      }
    };

    if (badgeId !== 0) {
        fetchBadgeData();
    }
    
  }, [axiosPrivate, badgeId]);

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageData = null;

      if(image.length > 0) {
        imageData = await readFileAsBase64(image);
        setImageDataState(imageData);
      }

      console.log(imageDataState);

      const badgeData = {
        name: sanitizeInput(name),
        description: sanitizeInput(description),
        badgeImage: imageDataState,
      };

      console.log(badgeData);

      const response = await axiosPrivate.put(`/badges/${badgeId}`, badgeData);

      setSuccessMessage("Ženkliukas sėkmingai atnaujintas!");
      clearImage();
    } catch (error) {
      console.error("Klaida atnaujinant ženkliuką:", error);
      setErrorMessage("Klaida atnaujinant ženkliuką.");
    }
  };

  const clearImage = () => {
    setImage([]);
    document.getElementById("image2").value = "";
  }

  const handleImageFile = (e) => {
    const { files } = e.target;

    setImage(files[0]);

    console.log(image);
  }

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
              <h2>Atnaujinti ženkliuką</h2>
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
                  <label htmlFor="description">Apibūdinimas:</label><br/>
                  <textarea
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
                  <label htmlFor="image2">Paveikslėlis:</label><br />
                  <input
                    type="file"
                    id="image2"
                    name="image"
                    onChange={handleImageFile}
                    accept="image/*"
                    className="input-field"
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

export default EditBadge;