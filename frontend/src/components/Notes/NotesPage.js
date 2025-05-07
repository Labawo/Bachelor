import React, { useState } from 'react';
import Footer from "../Main/Footer";
import NavBarNew from "../Main/NavBarNew";
import { UseNote } from "./UseNote";
import { observer } from "mobx-react-lite";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import logo from "./keyboard-image.png";

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
            <img src={logo} alt="Logo" width='100%' height='200px'/>
            <h2>Sukurti įrašą</h2>
            <form onSubmit={handleSubmit} className = "create-note">
              <div className="form-group note-name-input">
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
              </div>
              <div className="form-group">
                <textarea
                  style={{margin: '0'}}
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
              <button type="submit">
                <FontAwesomeIcon icon={faPlus} />
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
            <section style={{paddingTop: '0'}}>  
                <div style={{marginTop: "0", color:"black", overflow:'auto', maxHeight:'85vh'}}>
                    {form()}
                    <div className='note-div'>
                    {noteStore.notes.map((note, i) => (
                        
                          <span key={i} className='note-span'>
                            <h2 style={{fontSize: '20px'}}>{note.name}</h2>
                            <p style={{fontSize: '12px'}}>{note.content}</p>
                            <div style={{width: '30%', marginTop: '40px'}}>
                              <button
                                  onClick={() => deleteNote(note.id)}
                                  className='delete-note-button'
                              >
                                  <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </span>
                    ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>        
    )
})

export default NotesPage