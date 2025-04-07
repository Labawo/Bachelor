import './keyboard.css'

const Keyboard = () => {

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
                <div className="key" style={{background: 'red'}}>§</div>
                <div className="key" style={{background: 'red'}}>1</div>
                <div className="key" style={{background: 'yellow'}}>2</div>
                <div className="key" style={{background: '#40DE7A'}}>3</div>
                <div className="key" style={{background: '#3C99DC'}}>4</div>
                <div className="key" style={{background: '#3C99DC'}}>5</div>
                <div className="key" style={{background: '#3C99DC'}}>6</div>
                <div className="key" style={{background: '#3C99DC'}}>7</div>
                <div className="key" style={{background: '#40DE7A'}}>8</div>
                <div className="key" style={{background: 'yellow'}}>9</div>
                <div className="key" style={{background: 'red'}}>0</div>
                <div className="key" style={{background: 'red'}}>+</div>
                <div className="key" style={{background: 'red'}}>´</div>
                <div className="key key-size-2 key-small-type key-right" style={{background: 'red'}}>delete</div>
                <div className="key key-size-2 key-small-type" style={{background: 'red'}}>tab</div>
                <div className="key" style={{background: 'red'}}>Q</div>
                <div className="key" style={{background: 'yellow'}}>W</div>
                <div className="key" style={{background: '#40DE7A'}}>E</div>
                <div className="key" style={{background: '#3C99DC'}}>R</div>
                <div className="key" style={{background: '#3C99DC'}}>T</div>
                <div className="key" style={{background: '#3C99DC'}}>Y</div>
                <div className="key" style={{background: '#3C99DC'}}>U</div>
                <div className="key" style={{background: '#40DE7A'}}>I</div>
                <div className="key" style={{background: 'yellow'}}>O</div>
                <div className="key" style={{background: 'red'}}>P</div>
                <div className="key" style={{background: 'red'}}>[</div>
                <div className="key" style={{background: 'red'}}>]</div>
                <div className="key" style={{background: 'red'}}>\</div>
                <div className="key key-size-3 key-small-type key-caps-lock" style={{background: 'red'}}>caps lock</div>
                <div className="key" style={{background: 'red'}}>A</div>
                <div className="key" style={{background: 'yellow'}}>S</div>
                <div className="key" style={{background: '#40DE7A'}}>D</div>
                <div className="key" style={{background: '#3C99DC'}}>F</div>
                <div className="key" style={{background: '#3C99DC'}}>G</div>
                <div className="key" style={{background: '#3C99DC'}}>H</div>
                <div className="key" style={{background: '#3C99DC'}}>J</div>
                <div className="key" style={{background: '#40DE7A'}}>K</div>
                <div className="key" style={{background: 'yellow'}}>L</div>
                <div className="key" style={{background: 'red'}}>;</div>
                <div className="key" style={{background: 'red'}}>'</div>
                <div className="key key-size-3 key-small-type key-right" style={{background: 'red'}}>return</div>
                <div className="key key-size-4 key-small-type" style={{background: 'red'}}>shift</div>
                <div className="key" style={{background: 'red'}}>Z</div>
                <div className="key" style={{background: 'yellow'}}>X</div>
                <div className="key" style={{background: '#40DE7A'}}>C</div>
                <div className="key" style={{background: '#3C99DC'}}>V</div>
                <div className="key" style={{background: '#3C99DC'}}>B</div>
                <div className="key" style={{background: '#3C99DC'}}>N</div>
                <div className="key" style={{background: '#3C99DC'}}>M</div>
                <div className="key" style={{background: '#40DE7A'}}>,</div>
                <div className="key" style={{background: 'yellow'}}>.</div>
                <div className="key" style={{background: 'red'}}>/</div>
                <div className="key key-size-5 key-small-type key-right" style={{width: '14%', background: 'red'}}>shift</div>
                <div className="key key-size-6 key-small-type" style={{background: 'red'}}>ctrl</div>
                <div className="key key-size-6 key-small-type" style={{background: 'red'}}>option</div>
                <div className="key key-size-2 key-small-type" style={{background: 'orange'}}>command ⌘</div>
                <div className="key key-size-7" style={{background: 'orange'}}></div>
                <div className="key key-size-2 key-small-type key-right" style={{background: 'orange'}}>⌘ command</div>
                <div className="key key-size-6 key-small-type key-right" style={{background: 'red'}}>option</div>
                <div className="key key-size-6 key-small-type key-right" style={{background: 'red'}}>ctrl</div>
            </figure>
        </>
    )
}

export default Keyboard