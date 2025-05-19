import { useState } from "react";
import './keyboard.css';

const Keyboard = () => {

    const [hoverRed, setHoverRed] = useState(false);
    const [hoverYellow, setHoverYellow] = useState(false);
    const [hoverGreen, setHoverGreen] = useState(false);
    const [hoverBlue, setHoverBlue] = useState(false);
    const [hoverOrange, setHoverOrange] = useState(false);


    const handleMouseEnterRed = () => setHoverRed(true);
    const handleMouseLeaveRed = () => setHoverRed(false);

    const handleMouseEnterYellow = () => setHoverYellow(true);
    const handleMouseLeaveYellow = () => setHoverYellow(false);

    const handleMouseEnterGreen = () => setHoverGreen(true);
    const handleMouseLeaveGreen = () => setHoverGreen(false);

    const handleMouseEnterBlue = () => setHoverBlue(true);
    const handleMouseLeaveBlue = () => setHoverBlue(false);

    const handleMouseEnterOrange = () => setHoverOrange(true);
    const handleMouseLeaveOrange = () => setHoverOrange(false);

    const redButtonStyle = {
        background: hoverRed ? "red" : "",    
        cursor: "pointer",    
    };

    const shiftButtonStyle = {
        background: hoverRed ? "red" : "",    
        cursor: "pointer",  
        width: '14%',  
    };

    const yellowButtonStyle = {
        background: hoverYellow ? "yellow" : "",    
        cursor: "pointer",    
    };

    const orangeButtonStyle = {
        background: hoverOrange ? "orange" : "",    
        cursor: "pointer",
    };

    const greenButtonStyle = {
        background: hoverGreen ? "#40DE7A" : "",    
        cursor: "pointer",    
    };

    const blueButtonStyle = {
        background: hoverBlue ? "#3C99DC" : "",    
        cursor: "pointer",  
    };

    return (
        <>
            <figure className="keyboard">
                <div className="key key-function key-small-type" style={{width: '7%'}}>esc</div>
                <div className="key key-function key-small-type key-right">F1</div>
                <div className="key key-function key-small-type key-right">F2</div>
                <div className="key key-function key-small-type key-right">F3</div>
                <div className="key key-function key-small-type key-right">F4</div>
                <div className="key key-function key-small-type key-right">F5</div>
                <div className="key key-function key-small-type key-right">F6</div>
                <div className="key key-function key-small-type key-right">F7</div>
                <div className="key key-function key-small-type key-right">F8</div>
                <div className="key key-function key-small-type key-right">F9</div>
                <div className="key key-function key-small-type key-right">F10</div>
                <div className="key key-function key-small-type key-right">F11</div>
                <div className="key key-function key-small-type key-right">F12</div>
                <div className="key key-function" style={{width: '7%'}}>⏏</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>§</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>1</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>2</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>3</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>4</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>5</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>6</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>7</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>8</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>9</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>0</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>+</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>´</div>
                <div className="key key-size-2 key-small-type key-right" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>delete</div>
                <div className="key key-size-2 key-small-type" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>tab</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>Q</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>W</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>E</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>R</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>T</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>Y</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>U</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>I</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>O</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>P</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>[</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>]</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>\</div>
                <div className="key key-size-3 key-small-type key-caps-lock" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>caps lock</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>A</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>S</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>D</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>F</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>G</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>H</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>J</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>K</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>L</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>;</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>'</div>
                <div className="key key-size-3 key-small-type key-right" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>return</div>
                <div className="key key-size-4 key-small-type" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>shift</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>Z</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>X</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>C</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>V</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>B</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>N</div>
                <div className="key" style={blueButtonStyle} onMouseEnter={handleMouseEnterBlue} onMouseLeave={handleMouseLeaveBlue}>M</div>
                <div className="key" style={greenButtonStyle} onMouseEnter={handleMouseEnterGreen} onMouseLeave={handleMouseLeaveGreen}>,</div>
                <div className="key" style={yellowButtonStyle} onMouseEnter={handleMouseEnterYellow} onMouseLeave={handleMouseLeaveYellow}>.</div>
                <div className="key" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>/</div>
                <div className="key key-size-5 key-small-type key-right" style={shiftButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>shift</div>
                <div className="key key-size-6 key-small-type" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>ctrl</div>
                <div className="key key-size-6 key-small-type" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>option</div>
                <div className="key key-size-2 key-small-type" style={orangeButtonStyle} onMouseEnter={handleMouseEnterOrange} onMouseLeave={handleMouseLeaveOrange}>command ⌘</div>
                <div className="key key-size-7" style={orangeButtonStyle} onMouseEnter={handleMouseEnterOrange} onMouseLeave={handleMouseLeaveOrange}></div>
                <div className="key key-size-2 key-small-type key-right" style={orangeButtonStyle} onMouseEnter={handleMouseEnterOrange} onMouseLeave={handleMouseLeaveOrange}>⌘ command</div>
                <div className="key key-size-6 key-small-type key-right" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>option</div>
                <div className="key key-size-6 key-small-type key-right" style={redButtonStyle} onMouseEnter={handleMouseEnterRed} onMouseLeave={handleMouseLeaveRed}>ctrl</div>
            </figure>
        </>
    )
}

export default Keyboard