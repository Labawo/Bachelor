import Notes from './Notes';
import React, { useState } from 'react';
import Footer from "../Main/Footer";
import NavBar from "../Main/NavBar";
import Title from "../Main/Title";
import { UseNote } from "./UseNote";
import { observer } from "mobx-react-lite";
import useAuth from "../../hooks/UseAuth";

const NotesPage = observer(() => {

    const { noteStore } = UseNote();
    const { auth } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        content: ""
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const form = () => {
        return (
        <div className="form-container-notes">
            <h2>Sukurti įrašą</h2>
            <form onSubmit={handleSubmit} className = "input_form">
              <div className="form-group">
                <label htmlFor="name">Pavadinimas:</label><br />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Įrašyti pavadinimą"
                  required
                  className="input-field"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="content">Aprašymas:</label><br />
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Įrašyti aprašymą"
                  required
                  className="textarea-field"
                />
                {errors.content && (
                  <span className="error-message">{errors.content}</span>
                )}
              </div>
              <button type="submit" className="auth_button">
                Sukurti
              </button>
            </form>
          </div>);
    };

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData({
            ...formData,
            [name]: sanitizedValue
        });
    };

    const sanitizeInput = (value) => {
        return value.replace(/(<([^>]+)>)/gi, "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const noteData = {
            name: formData.name,
            content: formData.content
          };
      
          //const response = await axiosPrivate.post("/notes", noteData);
          await noteStore.hubConnection?.invoke('SendNote', formData.content, formData.name, auth.id)
      
          setSuccessMessage("Note created successfully!");
          setFormData({ name: "", content: "" });
        } catch (error) {
          console.error("Error creating note:", error);
          setErrorMessage("Failed to create note. Please try again.");
        }
    };

    return (
        <>
            <Title />
            <NavBar />
            <section>  
                <div className='content-holder-div'>
                    {form()}
                    {noteStore.notes.map(note => (
                        <div>{note.content}</div>
                    ))}
                </div>
            </section>
            <Footer />
        </>        
    )
})

export default NotesPage