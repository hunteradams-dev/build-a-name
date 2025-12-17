import { useState } from "react";
import "./App.css";
import { SyllableGenerator } from "./generators/SyllableGenerator";
import type { NameType } from "./generators/SyllableGenerator";

function App() {
  const [nameType, setNameType] = useState<NameType>("place");
  const [numSyllables, setNumSyllables] = useState<number>(2);
  const [count, setCount] = useState<number>(10);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  const handleGenerate = () => {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(SyllableGenerator.generate(nameType, numSyllables));
    }
    setGeneratedNames(names);
  };

  return (
    <div className="container">
      <h1>Random Name Generator</h1>

      <div className="controls">
        <div className="control-group">
          <label>Type:</label>
          <select
            value={nameType}
            onChange={(e) => setNameType(e.target.value as NameType)}
          >
            <option value="place">Place</option>
            <option value="person">Person</option>
            <option value="creature">Creature</option>
          </select>
        </div>

        <div className="control-group">
          <label>Syllables: {numSyllables}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={numSyllables}
            onChange={(e) => setNumSyllables(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Count: {count}</label>
          <input
            type="range"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
        </div>

        <button onClick={handleGenerate} className="generate-btn">
          Generate Names
        </button>
      </div>

      <div className="results">
        {generatedNames.length > 0 ? (
          <ul>
            {generatedNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        ) : (
          <p className="placeholder">Click generate to see names</p>
        )}
      </div>
    </div>
  );
}

export default App;
