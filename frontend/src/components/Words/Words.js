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

    const fetchWords = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get(`/levels/${levelId}/words`, {
                params: { pageNumber : pageNumber }, 
            });
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
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

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Klausimų sąrašas</h2>
                <div className="create-btn-div">
                    <button onClick={createWord} className="create-btn"> Sukurti Klausimą </button>
                </div>
                {words.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Klausimas</th>
                                <th>Atsakymas</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {words.map((word, i) => (
                                <tr key={i}>
                                    <td>{word?.question}</td>
                                    <td>{word?.correctAnswer}</td>
                                    <td>
                                        <button 
                                            className="table-buttons-blue"
                                            onClick={() => updateWord(word.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="table-buttons-red"
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
                    <p className="no-list-items-p">Citatų nėra</p>
                )}
                {isLoading ? (
                    <p>Kraunasi...</p>
                ) : words.length >= 0 ? (
                    <div className="pagination-buttons">
                        <button onClick={() => setPage(page === 1 ? page : page - 1)} className="load-button-v1">Ankstesnis puslapis</button>
                        <button onClick={() => setPage(words.length === 0 ? page : page + 1)} className="load-button-v1">Kitas puslapis</button>
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