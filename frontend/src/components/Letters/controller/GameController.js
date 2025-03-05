import Box from '../model/Box.model';
import BoxLayout from '../layout/Box.layout';
import BoundryLineLayout from '../layout/BoundryLine.layout';

// Controller of the game logic
export default class GameController {
    static maxBoxOnTheGround = 20;
    static initialDropPixelsPerFrame = 5;
    static levelDurationInSeconds = 30;
    static frameRate = 16; // 16 frame second

    #boxDropperInteval;
    #boxGeneratorInteval;
    #canvasRenderInteval;
    #levelHandlerInteval;
    #boxes = [];
    #boxesOnTheGround = 0;
    #paused = false;
    #score = 0;
    #level = 1;
    #timer = 0;
    #isGameOver = false;

    constructor(canvasRoot, canvasElement, setScoreBoard, setLevel, setGameOver) {
        this.canvasRoot = canvasRoot;
        this.canvasElement = canvasElement;
        this.setScoreBoard = setScoreBoard;
        this.setLevel = setLevel;
        this.setGameOver = setGameOver;
    }

    #generateBox() {
        return new Box(this.canvasElement.clientWidth, this.canvasElement.clientHeight / 2);
    }

    // Handling movement of a Box instance in each frame 
    #dropBox(box) {
        if (box.getY() + box.getDimention() < this.canvasElement.clientHeight - Box.maxDimention) {
            box.moveDown(GameController.initialDropPixelsPerFrame + (this.#level - 1));
        }
        else if (!box.isOnTheGround()) {
            box.markAsOnTheGround();
            this.#boxesOnTheGround++;
        }
    }

    #animateBoxes() {
        this.#boxDropperInteval = window.setInterval(() => {
            if (!this.#paused) {
                if (GameController.maxBoxOnTheGround > this.#boxesOnTheGround) {
                    this.#boxes.forEach(box => {
                        this.#dropBox(box);
                    });
                }
                else {
                    this.#gameOver();
                }
            }
        }, 62);
    }

    #handleGameLevels() {
        this.#levelHandlerInteval = window.setInterval(() => {
            if (!this.#paused) {
                this.#timer++;
                if (this.#timer % GameController.levelDurationInSeconds === 0) {
                    this.#level++;
                    this.setLevel(this.#level);
                }
            }
        }, 1000);
    }

    #gameOver() {
        this.#isGameOver = true;
        this.#paused = true;
        this.setGameOver(true);
    }

    #handleKeyboard(event) {
        const pressedKey = event.key.toLowerCase();
        if (!this.#isGameOver) {
            if (!this.#paused && Box.letters.some((letter) => letter.toLowerCase() === pressedKey)) {
                const oldBoxes = [...this.#boxes];
                this.#boxes = this.#boxes.filter(box => box.isOnTheGround() || box.getLetter().toLowerCase() !== pressedKey);
                this.#score += oldBoxes.reduce((sum, oldBox) => sum + (this.#boxes.some(box => box.getKey() === oldBox.getKey()) ? 0 : 1), 0);
                this.setScoreBoard(this.#score);
            }
            else if (pressedKey === ' ') {
                this.#paused = !this.#paused;
            }
        }
    }

    #startBoxGeneration() {
        this.#boxGeneratorInteval = window.setInterval(() => {
            if (!this.#paused) {
                this.#boxes.push(this.#generateBox());
            }
        }, 1000);
    }

    #renderBoxes() {
        this.#canvasRenderInteval = window.setInterval(() => {
            if (!this.#paused) {
                this.canvasRoot.render(
                    <>
                        <BoundryLineLayout />
                        {this.#boxes.map(box => <BoxLayout key={box.getKey()} box={box} />)}
                    </>);
            }
        }, 1000 / GameController.frameRate);
    }

    startGame() {
        this.#startBoxGeneration()
        this.#animateBoxes();
        this.#renderBoxes();
        this.#handleGameLevels();
        document.addEventListener("keydown", this.#handleKeyboard.bind(this));
    }

    stopGame() {
        this.#boxes = [];
        this.#boxesOnTheGround = 0;
        this.#paused = false;
        this.#score = 0;
        this.#level = 1;
        this.#isGameOver = false;

        clearInterval(this.#boxDropperInteval);
        clearInterval(this.#boxGeneratorInteval);
        clearInterval(this.#canvasRenderInteval);
        clearInterval(this.#levelHandlerInteval);
        document.removeEventListener("keydown", this.#handleKeyboard);

        this.setGameOver(this.#isGameOver);
        this.setLevel(this.#level);
        this.setScoreBoard(this.#score);
    }
}