import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";


const SYMBOL_SETS = [
  ["Ω", "©", "Б", "Ψ"],
  ["★", "Ω", "Ψ", "Ж"],
  ["Ж", "©", "Ψ", "★"],
  ["Ψ", "Ω", "Ж", "Б"],
];

const COLORS = ["blue", "white", "yellow", "red"];
const BUTTON_COLORS = ["blue", "red", "yellow"];

export default function BombDefusal() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [strikes, setStrikes] = useState(0);
  const [wires, setWires] = useState(["red", "blue", "yellow", "green"]);
  const [symbols, setSymbols] = useState(
    SYMBOL_SETS[Math.floor(Math.random() * SYMBOL_SETS.length)]
  );
  const [correctOrder, setCorrectOrder] = useState([]);
  const [selected, setSelected] = useState([]);
  const [wiresDefused, setWiresDefused] = useState(false);
  const [keypadDefused, setKeypadDefused] = useState(false);
  const [buttonDefused, setButtonDefused] = useState(false);
  const [message, setMessage] = useState("");
  const [isHolding, setIsHolding] = useState(false);

  const [buttonColor] = useState(BUTTON_COLORS[Math.floor(Math.random() * BUTTON_COLORS.length)]);
  const [stripColor, setStripColor] = useState("green");

  useEffect(() => {
    if (timeLeft > 0 && !isBombDefused()) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - (strikes > 0 ? 2 : 1)), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, wiresDefused, keypadDefused, buttonDefused, strikes]);

  useEffect(() => {
    const sortedSymbols = [...symbols].sort(
      (a, b) => SYMBOL_SETS.flat().indexOf(a) - SYMBOL_SETS.flat().indexOf(b)
    );
    setCorrectOrder(sortedSymbols);
  }, [symbols]);

  function isBombDefused() {
    return wiresDefused && keypadDefused && buttonDefused;
  }

  function recordStrike() {
    setStrikes((prev) => {
      const newStrikes = prev + 1;
      if (newStrikes >= 3) {
        setTimeLeft(0);
      }
      return newStrikes;
    });
  }

  function cutWire(color) {
    if (wiresDefused) return;
    const newWires = wires.filter((wire) => wire !== color);
    setWires(newWires);
    if (newWires.length === 0) {
      setWiresDefused(true);
      setMessage("Wires module completed!");
    } else if (color !== "red") {
      recordStrike();
    }
  }

  function pressSymbol(symbol) {
    if (correctOrder[selected.length] === symbol) {
      const newSelected = [...selected, symbol];
      setSelected(newSelected);
      if (newSelected.length === correctOrder.length) {
        setKeypadDefused(true);
        setMessage("Keypad module completed!");
      }
    } else {
      recordStrike();
      setSelected([]);
    }
  }

  function pressButton() {
    if (isHolding) {
      setButtonDefused(true);
      setMessage("Button module completed!");
    } else {
      setIsHolding(true);
    }
  }

  return (
    
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-xl max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-2xl font-bold">Bomb Defusal</h1>
      <p className="text-lg">Time Left: {timeLeft}s</p>
      <p className="text-red-500">Strikes: {strikes}</p>

      {message && <p className="text-yellow-400 mt-2">{message}</p>}
      <div className="grid grid-cols-3 gap-4 mt-4 p-4 border border-gray-500 rounded-lg">
        <div className="p-2 bg-gray-700 rounded-lg flex flex-col items-center">
          <div className="flex flex-col gap-2 mt-2">
            {wires.map((wire, index) => (
              <svg key={index} className="w-32 h-4 cursor-pointer" onClick={() => cutWire(wire)}>
                <path d="M0,10 Q50,-10 100,10" stroke={wire} strokeWidth="4" fill="transparent" />
              </svg>
            ))}
          </div>
        </div>
        <div className="p-2 bg-gray-700 rounded-lg flex flex-col items-center">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {symbols.map((symbol, index) => (
              <Button key={index} className="bg-gray-700 text-white p-4 text-2xl" onClick={() => pressSymbol(symbol)}>
                {symbol}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-2 bg-gray-700 rounded-lg flex flex-row items-center gap-2">
          <Button className={`bg-${buttonColor}-500 text-white px-6 py-12 rounded-full hover:bg-${buttonColor}-500`} onMouseDown={pressButton}>
          </Button>
          <div className={`w-4 h-16 bg-${stripColor}-500`} />
        </div>
        <div className="p-2 bg-gray-800 rounded-lg"></div>
      </div>
      {isBombDefused() && <p className="text-green-400 mt-4">Bomb Defused! 🎉</p>}
    </div>
  );
}
