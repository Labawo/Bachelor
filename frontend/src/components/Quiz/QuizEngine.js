import { jsQuizz } from "./constants";
import Quiz from "./Quiz";
import "./enginemodals.css";

const QuizEngine = ({ show, onClose }) => {

  return (
    <>
        <div className={`modal ${show ? "show" : ""}`}>
            <div className="modal-content">
                <div className='close-button-div'>
                    <button className="primary-button" onClick={onClose}>X</button>
                </div>
                <div className='engine-holder-div'>
                    <Quiz questions={jsQuizz.questions} />
                </div>                
            </div>
        </div>
    </>
    
  );
};

export default QuizEngine;