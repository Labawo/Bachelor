import './Game.css';


export default function BoxLayout(props) {
    const { box } = props;

    function getRGBColorStyle(rgb) {
        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
    }

    return (
        <div className="box"
            style={{
                backgroundColor: getRGBColorStyle(box.getBackgroundColor()),
                width: box.getDimention(),
                height: box.getDimention(),
                top: !box.isOnTheGround() ? box.getY() + 'px' : '',
                bottom: box.isOnTheGround() ? '0px' : '',
                left: box.getX() + 'px',
                fontSize: box.getDimention() + 'px'
            }}>
            <div style={{
                color: getRGBColorStyle(box.getLetterColor())
            }}>
                {box.getLetter()}
            </div>
        </div>
    );
};