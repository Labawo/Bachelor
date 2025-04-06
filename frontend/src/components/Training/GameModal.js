import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import Game from "./Game";
import { useNavigate } from "react-router-dom";
import "../Levels/levelmodals.css";

const GameModal = () => {

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  }

  return (
    <>
      <div style={{color: 'black'}}>
        <div className='close-button-div-form'>
            <button className="primary-button-form" onClick={onClose}>X</button>
        </div>
        <Game />
      </div>
    </>
    
  );
};

export default GameModal;