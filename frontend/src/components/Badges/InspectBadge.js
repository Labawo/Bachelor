import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import "../Levels/levelmodals.css";

const InspectBadge = ({ show, onClose, badgeId }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const response = await axiosPrivate.get(`/badgesnumber/myBadges/${badgeId}`);
        const { name, description, badgeImage } = response.data;
        setName(name);
        setDescription(description);
        setImage(badgeImage);
      } catch (error) {
        console.error("Klaida gaunant apibūdinimą:", error);
        if (error.response && error.response.status === 403) {
          onClose();
        }
      }
    };

    if (badgeId !== 0) {
        fetchBadgeData();
    }
    
  }, [axiosPrivate, badgeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <div className={`modal-form ${show ? "show" : ""}`}>
      <div className="modal-content-form"> 
        <div className="outer-form-div">
        <div className="form-container">
          <h2 style={{ background: 'black', color: '#fff', marginLeft: '0', padding: '10px 0 10px 5%'}}>Ženklelio peržiūra</h2>
          <form onSubmit={handleSubmit} className = "input_form">
            <div className="form-group">
              <label htmlFor="name">Pavadinimas:</label><br/>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    disabled="disabled"
                />
            </div>
            <div className="form-group">
              <label htmlFor="description">Apibūdinimas:</label><br/>
              <textarea
                id="description"
                name="description"
                value={description}
                disabled="disabled"
                className="textarea-field"
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            
            <div className="modal-buttons-form">
              <button type="submit" style={{background: 'black', color: '#fff'}} onClick={handleSubmit}>
                Uždaryti
              </button>
            </div>
          </form>
          
      </div>
        </div>
      </div>
      </div>
    </>
    
  );
};

export default InspectBadge;