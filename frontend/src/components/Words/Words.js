import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";
import CreateWord from "./CreateWord";
import EditWord from "./EditWord";
import ImportFile from "./ImportFile";

const Words = ({ levelId }) => {
    const [words, setWords] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editWordId, setEditWordId] = useState(0);
    const [isNextPage, setIsNextPage] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [deleteId, setDeleteId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  
    const [filter, setFilter] = useState('');
    const [filteredWords, setFilteredWords] = useState([]);

    const fetchWords = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get(`/levels/${levelId}/words`, {
                params: { pageNumber : pageNumber }, 
            });
            return response.data;
        } catch (err) {
            console.error(err);
            //navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadWords = async (page) => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchWords(page);
        console.log(data)
        setWords([...data]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadWords(page);
    }, [page]); 

    const createWord = () => {
        setShowCreate(true);
    };

    const updateWord = (wordId) => {
        setEditWordId(wordId);
    };

    const removeWord = async (wordId) => {
        try {
          await axiosPrivate.delete(`/levels/${levelId}/words/${wordId}`);
          setWords(prevWords =>
            prevWords.filter(word => word.id !== wordId)
          );
          setDeleteId("");
        } catch (error) {
          console.error(`Klaida trinant klaisimą ${wordId}:`, error);
          setErrorMessage("Klaida trinant klaisimą.")
          setDeleteId("");
        }
    };

    useEffect(() => {
        setFilteredWords(words.filter(word => word.question.toLowerCase().includes(filter.toLowerCase())));       
    }, [words, filter]);

    return (
        <article className="list-article">
            <div className="table-container">
            <div className='users-list-div' style={{background : 'black', color: '#fff', width : '100%', 
                    marginTop: '0', paddingLeft: '10px', 
                    paddingRight: '20px', paddingTop: '15px', paddingBottom: '10px'}}>
                    <span className='users-list-span times-two'>
                        <div className='users-list-header'>
                            <p>Klausimų sąrašas</p>
                        </div>
                    </span>
                    <span className='users-list-span'>
                        <div className="filter-container">
                            <div className="filter-container-inside">
                                <input
                                    type="text"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Filtruoti pagal klausimą"
                                    className="filter-container-input"
                                />
                            </div>  
                        </div>
                    </span>
                </div>
                <div className="create-btn-div">
                    <div style={{width: '25%', margin: 'auto'}}>
                        <button onClick={createWord} className="blue-button" style={{width : '100%', fontWeight: '600', fontSize: '16px'}}> Sukurti Klausimą </button>
                    </div>
                    <p style={{borderBottom: "2px solid black", borderTop: "2px solid black", fontWeight: "bold", fontSize:"20px", paddingTop: "10px", paddingBottom: "10px", textAlign: 'center'}}> ARBA </p>
                    <div className="outer-import-file-div">
                        <ImportFile levelId={levelId}/>
                    </div>                    
                </div>
                {filteredWords.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Klausimas</th>
                                <th>Atsakymas</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWords.map((word, i) => (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{word?.question}</td>
                                    <td>{word?.correctAnswer}</td>
                                    <td>
                                        <button 
                                            className="green-button"
                                            onClick={() => updateWord(word.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="red-button"
                                            onClick={() => setDeleteId(word.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>                                       
                                    </td>    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-list-items-p" style={{marginTop: "10px"}}>Klausimų nėra</p>
                )}
                {isLoading ? (
                    <p>Kraunasi...</p>
                ) : words.length >= 0 && filter === '' ? (
                    <div className="pagination-buttons">
                        <span className="pagination-buttons-span"><button className='pagination-btn' onClick={() => setPage(page === 1 ? page : page - 1)}>-</button></span>
                        <span className="pagination-buttons-span" style={{height: '50%', marginTop: 'auto', marginBottom:'auto'}}>{page}</span>
                        <span className="pagination-buttons-span"><button className='pagination-btn' onClick={() => setPage(words.length === 0 ? page : page + 1)}>+</button></span>
                    </div>                    
                ) : null}
            </div>
            <ErrorModal
                show={errorMessage !== ""}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />
            <ConfirmationModal 
                show={deleteId !== ""}
                onClose={() => setDeleteId("")}
                onConfirm={() => removeWord(deleteId)}
                message={"Ar tikrai norite pašalinti citatą?"}
            />
            <CreateWord
                show={showCreate === true}
                onClose={() => setShowCreate(false)}
                levelId={levelId}
            />
            <EditWord
                show={editWordId !== 0}
                onClose={() => setEditWordId(0)}
                levelId = {levelId} 
                wordId = {editWordId}
            />
        </article>
    );
};

export default Words;