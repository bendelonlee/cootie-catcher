import './App.css';
import { useState, useMemo, useCallback, useEffect } from "react"

function App() {
  const storedFortune = localStorage.getItem("fortuneNumber")
  const storedTomorrow = localStorage.getItem("storedTomorrow")

  const preventNewFortune = storedTomorrow && new Date().getTime() < Number.parseInt(storedTomorrow)

  const [gameState, setGameState] = useState((preventNewFortune) ? "readFortune" : "pickAColor") 
  const [color, setColor] = useState(null)
  const [catcherOpenness, setCatcherOpenness] = useState("closed")
  const [opennessDirection, setOpennessDirection] = useState("vertical")
  const [colorSpellingIndex, setColorSpellingIndex] = useState(0)
  const [countdownNumber, setCountdownNumber] = useState(null)
  const [fortuneNumber, setFortuneNumber] = useState(gameState === "readFortune" ? Number.parseInt(storedFortune) : null)

  const onInnerFlapClick = useCallback((e) => {
    if(gameState === "pickFirstNumber"){
      setCountdownNumber(Number.parseInt(e.target.innerText))
      setGameState("countdownToFortune")
    } else if(gameState === "pickYourFortune"){
      const n = Number.parseInt(e.target.innerText)
      setFortuneNumber(n)
      setGameState("readFortune")
      localStorage.setItem("fortuneNumber", n)

      localStorage.setItem("storedTomorrow", tomorrow().getTime())
      setCatcherOpenness("closed")
    }
   
  }, [gameState])

  const innerflapHighlightCss = useMemo(() => {
    if(gameState === "pickFirstNumber" || gameState === "pickYourFortune"){
      return "clickable"
    }
    return ""
  }, [gameState])

  const moveTheCatcher = () => {
    if(catcherOpenness === "closed"){
      setCatcherOpenness("open")
      if(gameState === "spellColor"){
        if(colorSpellingIndex >= color.length - 1){
          setGameState("pickFirstNumber")
          setCatcherOpenness("open")
        } else {
          setColorSpellingIndex(i => i + 1)
        }
      } else if(gameState === "countdownToFortune"){
        
        setCountdownNumber(n => n - 1)
        if(countdownNumber <= 1){
          setGameState("pickYourFortune")
          setCatcherOpenness("open")
        }
      }
    } else {
      setOpennessDirection(d => d === "vertical" ? "horizontal" : "vertical")
      setCatcherOpenness("closed")
    }
    

  }

  const colorSpellingText = useMemo(() => {
    if(!color) { return null }
    return <div>
      {color.toUpperCase().split("").map((char, i) => {
        return <span
              className={"spelling-char " + (i < colorSpellingIndex ? "complete" : "incomplete")}
              key={i}>
            {char}
          </span>
      })}
    </div>
  }, [colorSpellingIndex, color])

  const moveButtonText = useMemo(() => {
    if(color === null){
      return "Pick A Color"
    } else if (gameState === "spellColor" || (gameState === "pickAColor" && color)) {
      return colorSpellingText
    } else if (gameState === "countdownToFortune"){
      return countdownNumber
    } else if (gameState === "pickYourFortune"){
      return "Pick Your Fortune"
    } else if (gameState === "pickFirstNumber"){
      return "Pick A Number"
    }
    return color.toUpperCase()
  }, [color, gameState, countdownNumber, colorSpellingText])

  const onOuterFlapMouseEnter = (color) => () => {
    if(gameState === "pickAColor"){
      setColor(color)
    } 
  }

  const onOuterFlapClick = () => {
    if(gameState === "pickAColor"){
      setGameState("spellColor")
    } 
  }
  const onOuterFlapMousLeave = () => {
    if(gameState === "pickAColor"){
      setColor(null)
    } 
  }

  const cssColor = () => {
    if(color === "blue"){
      return "dodgerblue"
    } else if(color === "green"){
      return "limegreen"
    } else if(color === "pink"){
      return "violet"
    } else {
       return "darkorange"
    }
  }

  return (
    <div className="App">
       <div className={`cootie-catcher ${catcherOpenness} ${opennessDirection}`}>
        <div className="outer-flaps">
          <div
            onClick={onOuterFlapClick}
            onMouseEnter={onOuterFlapMouseEnter("orange")}
            onMouseLeave={onOuterFlapMousLeave}
            className={`outer-flap top-left ${gameState === "pickAColor" ? "clickable" : ""}`}
          />
          <div
            onClick={onOuterFlapClick}
            onMouseEnter={onOuterFlapMouseEnter("blue")}
            onMouseLeave={onOuterFlapMousLeave}
            className={`outer-flap top-right ${gameState === "pickAColor" ? "clickable" : ""}`}
          />
          <div
            onClick={onOuterFlapClick}
            onMouseEnter={onOuterFlapMouseEnter("green")}
            onMouseLeave={onOuterFlapMousLeave}
            className={`outer-flap bottom-left ${gameState === "pickAColor" ? "clickable" : ""}`}
          />
          <div
            onClick={onOuterFlapClick}
            onMouseEnter={onOuterFlapMouseEnter("pink")}
            onMouseLeave={onOuterFlapMousLeave}
            className={`outer-flap bottom-right ${gameState === "pickAColor" ? "clickable" : ""}`}
          />
        </div>
        <div className="inner-flaps">
          <div
              onClick={onInnerFlapClick}
              className={`inner-flap top-left ${innerflapHighlightCss}`}>
            <div className='inner-number'>
              {opennessDirection === "vertical" ? 4 : 5}
            </div>
          </div>
          <div
              onClick={onInnerFlapClick}
              className={`inner-flap top-right ${innerflapHighlightCss}`}>
            <div className='inner-number flip-text'>
              {opennessDirection === "vertical" ? 7 : 6}
            </div>
          </div>
          <div
              onClick={onInnerFlapClick}
              className={`inner-flap bottom-left ${innerflapHighlightCss}`}>
            <div className='inner-number flip-text'>
              {opennessDirection === "vertical" ? 3 : 2}
            </div>
          </div>
          <div
              onClick={onInnerFlapClick}
              className={`inner-flap bottom-right ${innerflapHighlightCss}`}>
            <div className='inner-number'>
              {opennessDirection === "vertical" ? 8 : 1}
            </div>
          </div>
        </div>
      </div>
      {gameState === "readFortune" ? <Fortune fortuneNumber={fortuneNumber} cssColor={cssColor()} /> :
      
      <button
        onClick={moveTheCatcher}
        style={{backgroundColor: color ? cssColor() : "gray"}}
        disabled={!(gameState === "countdownToFortune" || gameState === "spellColor")}
        id="move-button">
         {moveButtonText}
      </button>}

      
    </div>
  );
}

function tomorrow(){
  let t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(0,0,0,0);
  return t
}

function Fortune({fortuneNumber, cssColor}){
  

  const fortunes = [
    "A positive surprise is heading your way",
    "The stars are aligned tonight!",
    "Now is the time to plan",
    "It's never too late to be kind",
    "The best interpretor of your fortune is you",
    "Love is on its way",
    "It's okay to treat yourself",
    "Don't try to control, be in the flow"
  ]
  return <div
  style={{color: cssColor}}
    className='fortune-container'>
    {/* <h4
      style={{color: cssColor}}
    >
      {fortuneNumber}
    </h4> */}
    <div
      className='fortune-text'>
      {fortunes[fortuneNumber - 1]}
    </div>
    <div>
      Only one fortune a day, to keep it lucky
    </div>
    <div className='countdown-to-tomorrow'>
      Tomorrow begins in <Countdown time={tomorrow()}/>
    </div>

    <div className='credit'>
      A website by Triqueue
    </div>
  </div>
}

function Countdown({time}){
  const [diff, setDiff] = useState(time - new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(time - new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const hours = Math.floor(diff / (3600000))
  const minutes = Math.floor(diff % (3600000)  / 60000)
  const seconds = Math.floor(diff% (60000) / 1000)
  return `${hours} hours ${minutes} minutes & ${seconds} seconds`
}

export default App;
