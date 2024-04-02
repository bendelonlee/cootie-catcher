import logo from './logo.svg';
import './App.css';
import { useState } from "react"

function App() {
  const [gameState, setGameState] = useState("pickAColor") 
  return (
    <div className="App">
       <div class="cootie-catcher closed vertical">
        <div class="inner-flaps">
          <div class="inner-flap top-left"></div>
          <div class="inner-flap top-right"></div>
          <div class="inner-flap bottom-left"></div>
          <div class="inner-flap bottom-right"></div>
        </div>
        <div class="outer-flaps">
          <div
            class="outer-flap top-left clickable"
          />
          <div
            class="outer-flap top-right clickable"
          />
          <div
            class="outer-flap bottom-left clickable"
          />
          <div
            class="outer-flap bottom-right clickable"
          />
        </div>
      </div>
      <button 
        disabled={gameState === "pickAColor"}
        id="move-button">
          Pick a Color
      </button>

      
    </div>
  );
}

export default App;
