import TypingTest from "./TypingTest";
import "../Quiz/enginemodals.css";

const QuoteEngine = ({ show, onClose }) => {

  return (
    <>
        <div className={`modal ${show ? "show" : ""}`}>
            <div className="modal-content">
                <div className='close-button-div'>
                    <button className="primary-button" onClick={onClose}>X</button>
                </div>
                
                <div className='engine-holder-div'>
                    <TypingTest />
                </div>                
            </div>
        </div>
    </>
    
  );
};

export default QuoteEngine;