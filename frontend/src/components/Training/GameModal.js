import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import Game from "./Game";
import { useNavigate } from "react-router-dom";
import "../Levels/levelmodals.css";

const GameModal = () => {

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const onClose = () => {
    //navigate('/training');
    console.log(window.location.origin);
  }

  return (
    <>
      <div className="training-engine-holder-div" style={{color: 'black'}}>
        <div className='close-training-button-div'>
            <button className="" onClick={onClose}>Gryžti atgal</button>
        </div>
        <Game />
      </div>
    </>
    
  );
};

export default GameModal;