//import logo from './logo.svg';
import './App.css';
import Banner from "./components/Banner";
import { useState, useEffect } from "react";

function App() {
  console.clear()
  //let world = "world";
  //const [getter, setter] = useState(); <-- initialisation
  const [world, setWorld] = useState("la planète");
  //const [number, setNumber] = useState(0);

  const changeMyMind = () => {
    if (world === "l'Univers") {
      setWorld("la planète")
    } else {
      setWorld("l'Univers")
    }
  }

  useEffect(() => {
    console.log("Hey coucou je suis Use, Effect Use [Inserer ici la musique de James Bond]")
  }, [world])

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <p>Hello</p>
      <Banner world={world} />
      <button onClick={() => changeMyMind()} className={world === "l'Univers" ? "btn-univers" : "btn-earth"}>
        Si {world === "la planète" ? "petit" : "grand"} ?
      </button>
      {/*<div>{number}</div>
      {number === 10 ? <span>Bravo, tu es arrivé à 10 !</span> : null}<br />
      <button onClick={() => { if (number != 0) setNumber(number - 1) }}>-</button>
      <button onClick={() => setNumber(number + 1)}>+</button>
    <button onClick={() => setNumber(0)}>Reset</button>*/}
    </div >
  );
}

export default App;
