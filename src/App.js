import React, { useState, useEffect } from "react";

const SYMBOL_SETS = [
  "Ψ", "∑", "⨇", "∫", "ɸ", "ξ", "⨆", "¿", "∂"
]; // AND HERES SYMBOLS 
const serialNumber = "NPQB43";
const WORDS = ["gì", "là gì", "dì", "there", "their", "ờ", "uhh", "uhhhh"]; // THIS WHERE YOU CHANGE WORDS DUMMY

const Game = () => {
  
  const [time, setTime] = useState(300);
  const [strikes, setStrikes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [buttonColor, setButtonColor] = useState(["blue", "red", "yellow"][Math.floor(Math.random() * 3)]); // where u change button color
  const [lightStrip, setLightStrip] = useState("green");
  const [holdingButton, setHoldingButton] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [keypadSymbols, setKeypadSymbols] = useState(SYMBOL_SETS);
  const [enteredSymbols, setEnteredSymbols] = useState([]);
  const [correctOrder, setCorrectOrder] = useState(["∫", "∑"]); // where you change keypad answer
  const [displayWord, setDisplayWord] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [buttonWords, setButtonWords] = useState(
    WORDS.sort(() => 0.5 - Math.random()).slice(0, 4)
  );
  const [message, setMessage] = useState("");
  const [keypadDefused, setKeypadDefused] = useState(false);
  const [wireDefused, setWireDefused] = useState(false);
  
  useEffect(() => {
    if (time > 0 && !gameOver) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000/(2**strikes));
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
    }
  }, [time, gameOver, strikes]);

  useEffect(() => {
    if (strikes >= 3) {
      setGameOver(true);
    }
  }, [strikes]);

  useEffect(() => {
    if (holdingButton) {
      const holdInterval = setInterval(() => {
        setHoldTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(holdInterval);
    } else {
      if (holdTime > 5) setLightStrip("red");
      setHoldTime(0);
    }
  }, [holdingButton]);

  const handleWireCut = (color) => {
    if (color === "red") {
      setWireDefused(true);
      setMessage("Module cắt dây, hoàn thành!");
    } else {
      setStrikes((prev) => prev + 1);
    }
  };

  const handleButtonPress = () => {
    setHoldingButton(true);
  };

  const handleButtonRelease = () => {
    setHoldingButton(false);
  };

  const handleKeypadPress = (symbol) => {
    if (correctOrder[enteredSymbols.length] === symbol) {
      const newSelected = [...enteredSymbols, symbol];
      setEnteredSymbols(newSelected);
      if (newSelected.length === correctOrder.length) {
        setKeypadDefused(true);
        setMessage("Module bàn phím, hoàn thành!");
      }
    } else {
      setStrikes((prev) => prev + 1);
      setEnteredSymbols([]);
    }
  };

  const handleWordPress = (word) => {
    if (word === displayWord) {
      setDisplayWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
      setButtonWords(WORDS.sort(() => 0.5 - Math.random()).slice(0, 4));
    } else {
      setStrikes((prev) => prev + 1);
    }
  };

  return (
    <div className="grid grid-cols-3 grid-rows-[auto_1fr_1fr_2fr_2fr] gap-4 p-2 bg-gray-800 text-white min-h-screen">
      <div className="col-span-3 text-center text-3xl h-12 border border-white">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</div>
      <div className="col-span-3 text-center text-1xl p-2 h-10 border border-white">Strikes: {strikes}</div>
      <div className="col-span-3 text-center text-2xl border border-white">
        {message && <p className="text-yellow-400">{message}</p>}
      </div>
      <div className="bg-gray-700 p-4 flex flex-col items-center border border-white space-y-8">
  {['red', 'blue', 'yellow', 'green', 'purple'].map((color) => (
    <div key={color} className="relative flex items-center">
      {/* Left Circle */}
      <div className={`w-6 h-6 rounded-full  border-2 border-grey ${color === "red" ? "bg-red-500" :
            color === "blue" ? "bg-blue-500" :
            color === "yellow" ? "bg-yellow-500" :
            color === "green" ? "bg-green-500" :
            "bg-purple-600"}`}>
      </div>
      
      {/* Wire */}
      <svg width="300" height="40" viewBox="0 0 300 40" onClick={() => handleWireCut(color)}>
       <path d="M 0 20 Q 75 -10, 150 20 T 300 20" 
         strokeWidth="4" fill="transparent" stroke={color}/>
      </svg>
      
      {/* Right Circle */}
      <div className={`w-6 h-6 rounded-full border-2 border-white ${color === "red" ? "bg-red-500" :
            color === "blue" ? "bg-blue-500" :
            color === "yellow" ? "bg-yellow-500" :
            color === "green" ? "bg-green-500" :
            "bg-purple-600"}`}>
      </div>
    </div>
  ))}
    </div>
      
      <div className="bg-gray-700 p-4 flex flex-row items-center border border-white space-x-16 pl-32">
        <button
          className={`w-32 h-32 rounded-full border border-white ${buttonColor === "blue" ? "bg-blue-500" :buttonColor === "red" ? "bg-red-500" :"bg-yellow-500"}`}
          onMouseDown={handleButtonPress}
          onMouseUp={handleButtonRelease}
        ></button>

        <div className={`w-4 h-32 mt-2 border border-white rounded-full bg-${lightStrip}-500`}></div>
      </div>
       
      <div className="bg-gray-700 p-4 flex flex-col items-center"> 
        <div className="grid grid-cols-3 gap-2">
          {keypadSymbols.map((symbol) => (
            <button
            key={symbol}
            className="w-20 h-20 bg-gray-500 text-4xl text-black flex items-center justify-center"
            onClick={() => handleKeypadPress(symbol)}
          >
            {symbol}
          </button>
          
          ))}
        </div>
      </div>
      
      <div className="bg-gray-700 p-4 flex flex-col items-center">
        <div className="w-32 h-12 flex items-center justify-center bg-black-500 text-2xl mb-2">{displayWord}</div>
        <div className="grid grid-cols-2 gap-2">
          {['A', 'B', 'C', 'D'].map((word) => (
            <button
              key={word}
              className="w-20 h-10 bg-gray-500 text-lg"
              onClick={() => handleWordPress(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Game;
