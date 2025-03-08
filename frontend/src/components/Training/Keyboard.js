import './keyboard.css'

const Keyboard = () => {

    return (
        <>
            <figure class="keyboard">
                <div class="key key-function key-small-type" style={{width: '7%'}}>esc</div>
                <div class="key key-function key-small-type key-right">F1</div>
                <div class="key key-function key-small-type key-right">F2</div>
                <div class="key key-function key-small-type key-right">F3</div>
                <div class="key key-function key-small-type key-right">F4</div>
                <div class="key key-function key-small-type key-right">F5</div>
                <div class="key key-function key-small-type key-right">F6</div>
                <div class="key key-function key-small-type key-right">F7</div>
                <div class="key key-function key-small-type key-right">F8</div>
                <div class="key key-function key-small-type key-right">F9</div>
                <div class="key key-function key-small-type key-right">F10</div>
                <div class="key key-function key-small-type key-right">F11</div>
                <div class="key key-function key-small-type key-right">F12</div>
                <div class="key key-function" style={{width: '7%'}}>⏏</div>
                <div class="key" style={{background: 'red'}}>§</div>
                <div class="key" style={{background: 'red'}}>1</div>
                <div class="key" style={{background: 'yellow'}}>2</div>
                <div class="key" style={{background: '#40DE7A'}}>3</div>
                <div class="key" style={{background: '#3C99DC'}}>4</div>
                <div class="key" style={{background: '#3C99DC'}}>5</div>
                <div class="key" style={{background: '#3C99DC'}}>6</div>
                <div class="key" style={{background: '#3C99DC'}}>7</div>
                <div class="key" style={{background: '#40DE7A'}}>8</div>
                <div class="key" style={{background: 'yellow'}}>9</div>
                <div class="key" style={{background: 'red'}}>0</div>
                <div class="key" style={{background: 'red'}}>+</div>
                <div class="key" style={{background: 'red'}}>´</div>
                <div class="key key-size-2 key-small-type key-right" style={{background: 'red'}}>delete</div>
                <div class="key key-size-2 key-small-type" style={{background: 'red'}}>tab</div>
                <div class="key" style={{background: 'red'}}>Q</div>
                <div class="key" style={{background: 'yellow'}}>W</div>
                <div class="key" style={{background: '#40DE7A'}}>E</div>
                <div class="key" style={{background: '#3C99DC'}}>R</div>
                <div class="key" style={{background: '#3C99DC'}}>T</div>
                <div class="key" style={{background: '#3C99DC'}}>Y</div>
                <div class="key" style={{background: '#3C99DC'}}>U</div>
                <div class="key" style={{background: '#40DE7A'}}>I</div>
                <div class="key" style={{background: 'yellow'}}>O</div>
                <div class="key" style={{background: 'red'}}>P</div>
                <div class="key" style={{background: 'red'}}>[</div>
                <div class="key" style={{background: 'red'}}>]</div>
                <div class="key" style={{background: 'red'}}>\</div>
                <div class="key key-size-3 key-small-type key-caps-lock" style={{background: 'red'}}>caps lock</div>
                <div class="key" style={{background: 'red'}}>A</div>
                <div class="key" style={{background: 'yellow'}}>S</div>
                <div class="key" style={{background: '#40DE7A'}}>D</div>
                <div class="key" style={{background: '#3C99DC'}}>F</div>
                <div class="key" style={{background: '#3C99DC'}}>G</div>
                <div class="key" style={{background: '#3C99DC'}}>H</div>
                <div class="key" style={{background: '#3C99DC'}}>J</div>
                <div class="key" style={{background: '#40DE7A'}}>K</div>
                <div class="key" style={{background: 'yellow'}}>L</div>
                <div class="key" style={{background: 'red'}}>;</div>
                <div class="key" style={{background: 'red'}}>'</div>
                <div class="key key-size-3 key-small-type key-right" style={{background: 'red'}}>return</div>
                <div class="key key-size-4 key-small-type" style={{background: 'red'}}>shift</div>
                <div class="key" style={{background: 'red'}}>Z</div>
                <div class="key" style={{background: 'yellow'}}>X</div>
                <div class="key" style={{background: '#40DE7A'}}>C</div>
                <div class="key" style={{background: '#3C99DC'}}>V</div>
                <div class="key" style={{background: '#3C99DC'}}>B</div>
                <div class="key" style={{background: '#3C99DC'}}>N</div>
                <div class="key" style={{background: '#3C99DC'}}>M</div>
                <div class="key" style={{background: '#40DE7A'}}>,</div>
                <div class="key" style={{background: 'yellow'}}>.</div>
                <div class="key" style={{background: 'red'}}>/</div>
                <div class="key key-size-5 key-small-type key-right" style={{width: '14%', background: 'red'}}>shift</div>
                <div class="key key-size-6 key-small-type" style={{background: 'red'}}>ctrl</div>
                <div class="key key-size-6 key-small-type" style={{background: 'red'}}>option</div>
                <div class="key key-size-2 key-small-type" style={{background: 'orange'}}>command ⌘</div>
                <div class="key key-size-7" style={{background: 'orange'}}></div>
                <div class="key key-size-2 key-small-type key-right" style={{background: 'orange'}}>⌘ command</div>
                <div class="key key-size-6 key-small-type key-right" style={{background: 'red'}}>option</div>
                <div class="key key-size-6 key-small-type key-right" style={{background: 'red'}}>ctrl</div>
            </figure>
        </>
    )
}

export default Keyboard