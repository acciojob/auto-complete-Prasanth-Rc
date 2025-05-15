import React, { useState, useEffect, useRef } from "react";
import './../styles/App.css';

const App = () => {
  const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"];
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filteredFruits = fruits.filter(fruit =>
        fruit.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredFruits);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div>
        {/* Do not remove the main div */}
        <div className="autocomplete-container" data-testid="autocomplete">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Search fruits..."
            className="autocomplete-input"
            data-testid="autocomplete-input"
          />
          <ul 
            className="suggestions-list" 
            ref={suggestionsRef}
            data-testid="suggestions-list"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                data-testid={`suggestion-item-${index}`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default App;