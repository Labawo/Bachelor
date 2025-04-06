import React, { useState } from 'react';
import Footer from "../Main/Footer";
import NavBarNew from "../Main/NavBarNew";
import { UseNote } from "./UseNote";
import { observer } from "mobx-react-lite";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
          await noteStore.hubConnection?.invoke('SendNote', formData.content, formData.name, auth.accessToken)
      
          setSuccessMessage("Note created successfully!");
          setFormData({ name: "", content: "" });
        } catch (error) {
          console.error("Error creating note:", error);
          setErrorMessage("Failed to create note. Please try again.");
        }
    };

    const deleteNote = async (noteId) => {
      try {    
        //const response = await axiosPrivate.post("/notes", noteData);
        await noteStore.hubConnection?.invoke('DeleteNote', noteId, auth.accessToken);
    
        setSuccessMessage("Note Deleted successfully!");
      } catch (error) {
        console.error("Error deleting note:", error);
        setErrorMessage("Failed to delete note");
      }
  };

    return (
        <>
            <NavBarNew />
            <section>  
                <div className='content-holder-div' style={{marginTop: "10px"}}>
                    {form()}
                    {noteStore.notes.map(note => (
                        <div>
                          {note.content}
                          <button
                              onClick={() => deleteNote(note.id)}
                          >
                              <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </>        
    )
})

export default NotesPage