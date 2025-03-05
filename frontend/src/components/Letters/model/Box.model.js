export default class Box {
    static letters = ['A', 'B', 'C', 'D', 'E'];
    static maxDimention = 50;

    #letter;
    #dimention;
    #backgroundColor;
    #letterColor;
    #x;
    #y;
    #key;
    #onTheGround;

    constructor(maxX, maxY) {
        this.#letter = this.#getRandomLetter();
        this.#dimention = this.#getRandomDimention();
        this.#backgroundColor = this.#getRandomColor();
        this.#letterColor = this.#getContrastOfColor(this.#backgroundColor);
        this.#x = this.#getRandomLocation(maxX);
        this.#y = this.#getRandomLocation(maxY);
        this.#key = this.#generateKey();
        this.#onTheGround = false;
    };

    getLetter(){
        return this.#letter;
    }

    getDimention(){
        return this.#dimention;
    }

    getBackgroundColor(){
        return this.#backgroundColor;
    }

    getLetterColor(){
        return this.#letterColor
    }

    getX(){
        return this.#x;
    }

    getY(){
        return this.#y;
    }

    getKey(){
        return this.#key;
    }

    moveDown(amount){
        this.#y += amount;
    }

    isOnTheGround(){
        return this.#onTheGround;
    }

    markAsOnTheGround(){
        this.#onTheGround = true;
    }

    #getRandomLetter() {
        const index = Math.floor(Math.random() * Box.letters.length);
        return Box.letters[index];
    }

    #getRandomDimention() {
        // To generate random number between maxDimention - 10 and maxDimention
        return (Math.floor(Math.random() * (Box.maxDimention - 9)) + 10);
    }

    #getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return { r: r, g: g, b: b, a: 1 };
    }

    #getContrastOfColor(rgba) {
        return { r: 255 - rgba.r, g: 255 - rgba.g, b: 255 - rgba.b, a: rgba.a };
    }

    #getRandomLocation(maxLocation) {
        return Math.floor(Math.random() * (maxLocation - this.#dimention));
    }

    #generateKey() {
        // Generating a random key value
        return 'box_' + this.#letter + (Math.random() + '').substring(2);
    }
}