import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../Modals/ConfirmationModal";
import ErrorModal from "../Modals/ErrorModal";
import CreateQuote from "./CreateQuote";
import EditQuote from "./EditQuote";

const Quotes = ({ levelId }) => {
    const [quotes, setQuotes] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editQuoteId, setEditQuoteId] = useState(0);
    const [isNextPage, setIsNextPage] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [deleteId, setDeleteId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");  

    const fetchQuotes = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get(`/levels/${levelId}/quotes`, {
                params: { pageNumber : pageNumber }, 
            });
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadQuotes = async (page) => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchQuotes(page);
        console.log(data)
        setQuotes([...data]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadQuotes(page);
    }, [page]); 

    const createQuote = () => {
        setShowCreate(true);
    };

    const updateQuote = (quoteId) => {
        setEditQuoteId(quoteId);
    };

    const removeQuote = async (quoteId) => {
        try {
          await axiosPrivate.delete(`/levels/${levelId}/quotes/${quoteId}`);
          setQuotes(prevQuotes =>
            prevQuotes.filter(quote => quote.id !== quoteId)
          );
          setDeleteId("");
        } catch (error) {
          console.error(`Klaida trinant eilutę ${quoteId}:`, error);
          setErrorMessage("Klaida trinant eilutę.")
          setDeleteId("");
        }
    };

    return (
        <article className="list-article">
            <div className="table-container">
                <h2 className="list-headers">Posakių sąrašas</h2>
                <div className="create-btn-div">
                    <button onClick={createQuote} className="create-btn"> Sukurti Posakį </button>
                </div>
                {quotes.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Autorius</th>
                                <th>Šaltinis</th>
                                <th>Citata</th>
                                <th>Laikas sekundėmis</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((quote, i) => (
                                <tr key={i}>
                                    <td>{quote?.author}</td>
                                    <td>{quote?.source}</td>
                                    <td>{quote?.content}</td>
                                    <td>{quote?.timeToComplete}</td>
                                    <td>
                                        <button 
                                            className="table-buttons-blue"
                                            onClick={() => updateQuote(quote.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="table-buttons-red"
                                            onClick={() => setDeleteId(quote.id)}
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
                ) : quotes.length >= 0 ? (
                    <div className="pagination-buttons">
                        <button onClick={() => setPage(page === 1 ? page : page - 1)} className="load-button-v1">Ankstesnis puslapis</button>
                        <button onClick={() => setPage(quotes.length === 0 ? page : page + 1)} className="load-button-v1">Kitas puslapis</button>
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
                onConfirm={() => removeQuote(deleteId)}
                message={"Ar tikrai norite pašalinti citatą?"}
            />
            <CreateQuote 
                show={showCreate === true}
                onClose={() => setShowCreate(false)}
                levelId={levelId}
            />
            <EditQuote
                show={editQuoteId !== 0}
                onClose={() => setEditQuoteId(0)}
                levelId = {levelId} 
                quoteId = {editQuoteId}
            />
        </article>
    );
};

export default Quotes;