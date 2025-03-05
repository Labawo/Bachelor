import './Game.css';
import Box from '../model/Box.model';

export default function BoundryLineLayout() {
    return (
        <hr key='hrKey' className="boundryLine" style={{ bottom: Box.maxDimention + 'px' }} />
    );
};