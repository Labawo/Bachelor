import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";
import Title from "../Main/Title";
import useAuth from "../../hooks/UseAuth";
import SuccessModal from "../Modals/SuccessModal";
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

      setSuccessMessage("+enkliukas s4kmingai atnaujintas!");
      clearImage();
    } catch (error) {
      console.error("Error creating badge:", error);
      setErrorMessage("Failed to create badge. Please try again.");
    }
  };

  const clearImage = () => {
    setImage([]);
    document.getElementById("image").value = "";
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
      <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content"> 
      <div className="form-container">
          <h2>Sukurti naują ženkliuką</h2>
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
              <label htmlFor="image">Paveikslėlis:</label><br />
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageFile}
                accept="image/*"
                className="input-field"
              />
            </div>
            
            <div className="modal-buttons">
              
              <button type="submit" className="auth_button">
                Create
              </button>
            </div>
          </form>
          <button className="primary-button" onClick={onClose}>Atšaukti</button>
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
      </div>
      </div>
    </>
    
  );
};

export default EditBadge;