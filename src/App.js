import React, { useState, useEffect } from "react";

const SYMBOL_SETS = [
  "Ψ", "∑", "⨇", "∫", "ɸ", "ξ", "⨆", "¿", "∂"
]; // AND HERES SYMBOLS 

const leftLabels = ["A", "B", "C", "D"];
const rightLabels = ["1", "2", "3", "4"];
const correctMatches = { A: "2", B: "3", C: "1", D: "4" }; // Correct matches
//const WORDS = ["gì", "là gì", "dì", "there", "their", "ờ", "uhh", "uhhhh"]; 
const WORDS = ["THERE", "UHHHH"]; // THIS WHERE YOU CHANGE WORDS DUMMY
const Game = () => {

  const [time, setTime] = useState(900);
  const [strikes, setStrikes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [buttonColor, setButtonColor] = useState(["blue", "red", "yellow"][Math.floor(Math.random() * 3)]); // where u change button color
  const [cutWires, setCutWires] = useState({});
  const [holdingButton, setHoldingButton] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const [keypadSymbols, setKeypadSymbols] = useState(SYMBOL_SETS);
  const [enteredSymbols, setEnteredSymbols] = useState([]);
  const [correctOrder, setCorrectOrder] = useState(["∑", "ξ", "¿"]); // where you change keypad answer
  const [buttonChoices, setButtonChoices] = useState([]);
  const [displayWord, setDisplayWord] = useState(WORDS[0]);
  const [buttonAnswers, setButtonAnswers] = useState(["C", "A"]); // where you change "nút bấm answers"
  const [message, setMessage] = useState("");
  const [keypadDefused, setKeypadDefused] = useState(false);
  const [wireDefused, setWireDefused] = useState(false);
  const [MCQDefused, setMCQDefused] = useState(false);
  const [matchDefused, setMatchDefused] = useState(false);
  const [buttonDefused, setButtonDefused] = useState(false);
  const [selectedWire, setSelectedWire] = useState(null);
  const [connections, setConnections] = useState([]);
  
  useEffect(() => {
    if (time > 0 && !gameOver) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000/(strikes+1));
      return () => clearInterval(timer);
    } else {
      setGameOver(true);
      setTime(0);
    }
  }, [time, gameOver, strikes]);

  useEffect(() => {
    if (strikes >= 4) {
      setGameOver(true);
    }
  }, [strikes]);

  useEffect(() => {
    if (keypadDefused && wireDefused && MCQDefused && buttonDefused && matchDefused) {
      setGameOver(true);
      setMessage(`Chúc mừng! Bạn còn ${time} giây.`);
    } 
  }, [keypadDefused, wireDefused, buttonDefused, MCQDefused, matchDefused]);

  const handleWireCut = (color) => {
    setCutWires((prev) => ({ ...prev, [color]: "bg-gray-800" })); // Change to background color
  
    if (color === "red") {
      setWireDefused(true);
      setMessage("Module cắt dây, hoàn thành!");
    } else {
      setStrikes((prev) => prev + 1);
    }
  };
  
  

  const handleButtonPress = () => {
    setHoldingButton(true);
    setMessage("Holding...");
  };

  const handleButtonRelease = () => {
    setHoldingButton(false);
    setMessage("");
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
  
    // Check if "2" appears in the minute or second
    if (minutes.toString().includes("6") || seconds.toString().includes("6")) {
      setMessage("Module nút bấm, hoàn thành!");
      setButtonDefused(true);
    } else {
      setStrikes((prev) => prev + 1);
    }
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
    if (buttonAnswers[buttonChoices.length] == word) {
      const newBSelected = [...buttonChoices, word];
      setButtonChoices(newBSelected);
      //console.log(buttonChoices);
      if (newBSelected.length == buttonAnswers.length) {
        setMCQDefused(true);
        setMessage("Module 4 nút, hoàn thành!");
      }
      //console.log(displayWord);
      setDisplayWord(WORDS[newBSelected.length]);
      console.log(displayWord);
    } else {
      setStrikes((prev) => prev + 1);
    }
  };

  const handleWireClick = (side, index) => {
  if (side === "left") {
    setSelectedWire(index);
  } else if (side === "right" && selectedWire !== null) {
    const leftLabel = leftLabels[selectedWire];
    const rightLabel = rightLabels[index];

    // Check if the match is correct
    const isCorrect = correctMatches[leftLabel] === rightLabel;

    // Prevent duplicate connections
    if (!connections.some((pair) => pair.left === selectedWire || pair.right === index)) {
      const newConnections = [...connections, { left: selectedWire, right: index, correct: isCorrect }];

      // If incorrect, add a strike
      if (!isCorrect) {
        setStrikes((prevStrikes) => prevStrikes + 1);
      }

      setConnections(newConnections);

      // Check if all connections are correct
      if (newConnections.length === Object.keys(correctMatches).length &&
          newConnections.every(conn => conn.correct)) {
        setMessage("Module nối dây, hoàn thành!");
        setMatchDefused(true);
            }
    }

    setSelectedWire(null);
  }
  };


  const resetConnections = () => {
    setConnections([]);
    setSelectedWire(null);
  };

  return (
    
    <div className="grid grid-cols-3 grid-rows-[auto_auto_auto_2fr_2fr] gap-4 p-2 bg-gray-800 text-white min-h-screen">
      <div className="absolute top-2 right-4 text-white text-xl font-bold">Mã số: D2J97</div>

      
      <div className="bg-gray-700 p-4 flex flex-col items-center space-y-8">
  {['red', 'blue', 'purple', 'yellow', 'green'].map((color) => (
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
        <path 
          d="M 0 20 Q 75 -10, 150 20 T 300 20" 
          strokeWidth="4" 
          fill="transparent" 
          stroke={cutWires[color] || color} // Change color if cut
        />
      </svg>

      
      {/* Right Circle */}
      <div className={`w-6 h-6 rounded-full border-2 ${color === "red" ? "bg-red-500" :
            color === "blue" ? "bg-blue-500" :
            color === "yellow" ? "bg-yellow-500" :
            color === "green" ? "bg-green-500" :
            "bg-purple-600"}`}>
      </div>
    </div>
  ))}
      </div>
    
  {/* Middle Top Cell (holds Timer, Message, and Strikes) */}
  <div className="flex flex-col items-center justify-center bg-gray-700 p-4">
    <div className="text-3xl text-white">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</div>
    <div className="text-lg text-red-400">Strikes: {strikes}</div>
    <div className="col-span-3 text-center text-2xl">
        {message && <p className="text-yellow-400">{message}</p>}
      </div>
  </div>
    
      <div className="bg-gray-700 p-4 flex flex-col items-center justify-center"> 
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
        <div className="w-64 h-24 flex items-center justify-center bg-black-500 text-2xl mb-2">{displayWord}</div>
        <div className="grid grid-cols-2 gap-2">
          {['A', 'B', 'C', 'D'].map((word) => (
            <button
              key={word}
              className="w-40 h-20 bg-gray-500 text-lg"
              onClick={() => handleWordPress(word)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center bg-gray-700 p-4 text-white">
      <div className="relative flex w-full max-w-lg">
        {/* Left Side (A, B, C, D) */}
        <div className="flex flex-col space-y-8">
          {leftLabels.map((label, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                selectedWire === index ? "bg-yellow-400" : "bg-gray-700"
              }`}
              onClick={() => handleWireClick("left", index)}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Wire Connections */}
        <svg className="absolute left-14 w-full h-full pointer-events-none">
          {connections.map(({ left, right, correct }, idx) => (
            <line
              key={idx}
              x1="0%"
              y1={`${10 + left * 27}%`}
              x2="72%"
              y2={`${10 + right * 27}%`}
              stroke={correct ? "green" : "red"}
              strokeWidth="3"
            />
          ))}
        </svg>

        {/* Right Side (1, 2, 3, 4) */}
        <div className="flex flex-col space-y-8 ml-auto">
          {rightLabels.map((label, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer bg-gray-700"
              onClick={() => handleWireClick("right", index)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-700 rounded text-white"
        onClick={resetConnections}
      >
        Đặt lại
      </button>
    </div>

    <div className="bg-gray-700 p-4 flex justify-center items-center">
  <button
    className={`w-64 h-64 rounded-full flex items-center justify-center text-white text-xl font-bold ${
      buttonColor === "blue"
        ? "bg-blue-500"
        : buttonColor === "red"
        ? "bg-red-500"
        : "bg-yellow-500"
    }`}
    onMouseDown={handleButtonPress}
    onMouseUp={handleButtonRelease}
  >
    Lật đổ triều Tây Sơn
  </button>
</div>

    
    </div>
  );
};

export default Game;
