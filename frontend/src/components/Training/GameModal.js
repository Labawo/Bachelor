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
      <div style={{color: 'black', width: '100%', minHeight: '70vh', marginRight: '10px'}}>
        <Game />
      </div>
    </>
    
  );
};

export default GameModal;