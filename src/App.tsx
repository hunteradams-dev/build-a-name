import { useState, useEffect } from "react";
import "./App.css";
import { SyllableGenerator } from "./generators/SyllableGenerator";
import type { NameType } from "./generators/SyllableGenerator";

function App() {
  const [nameType, setNameType] = useState<NameType>("place");
  const [numSyllables, setNumSyllables] = useState<number>(2);
  const [count, setCount] = useState<number>(10);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [savedNames, setSavedNames] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedNames");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedNames", JSON.stringify(savedNames));
  }, [savedNames]);

  const handleGenerate = () => {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(SyllableGenerator.generate(nameType, numSyllables));
    }
    setGeneratedNames(names);
  };

  const toggleSave = (name: string) => {
    if (savedNames.includes(name)) {
      setSavedNames(savedNames.filter((n) => n !== name));
    } else {
      setSavedNames([...savedNames, name]);
    }
  };

  const clearSaved = () => {
    setSavedNames([]);
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
        <h3>Generated Names</h3>
        {generatedNames.length > 0 ? (
          <ul>
            {generatedNames.map((name, index) => (
              <li key={index} className="name-item">
                <span>{name}</span>
                <button
                  onClick={() => toggleSave(name)}
                  className={`save-btn ${
                    savedNames.includes(name) ? "saved" : ""
                  }`}
                  title={
                    savedNames.includes(name)
                      ? "Remove from saved"
                      : "Save name"
                  }
                >
                  {savedNames.includes(name) ? "❤️" : "🤍"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder">Click generate to see names</p>
        )}
      </div>

      {savedNames.length > 0 && (
        <div className="results saved-section">
          <div className="saved-header">
            <h3>Saved Names ({savedNames.length})</h3>
            <button onClick={clearSaved} className="clear-btn">
              Clear All
            </button>
          </div>
          <ul>
            {savedNames.map((name, index) => (
              <li key={index} className="name-item">
                <span>{name}</span>
                <button
                  onClick={() => toggleSave(name)}
                  className="save-btn saved"
                  title="Remove from saved"
                >
                  ❤️
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
