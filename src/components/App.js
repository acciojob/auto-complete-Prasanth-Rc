import React, { useState, useEffect, useRef } from "react";
import './../styles/App.css';

const App = () => {
  const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"];
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const filteredFruits = fruits.filter(fruit =>
        fruit.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredFruits);
      setActiveSuggestion(0);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        setInputValue(suggestions[activeSuggestion]);
        setShowSuggestions(false);
      }
    }
    else if (e.key === 'ArrowUp') {
      if (activeSuggestion > 0) {
        setActiveSuggestion(activeSuggestion - 1);
        scrollSuggestionIntoView(activeSuggestion - 1);
      }
    }
    else if (e.key === 'ArrowDown') {
      if (activeSuggestion < suggestions.length - 1) {
        setActiveSuggestion(activeSuggestion + 1);
        scrollSuggestionIntoView(activeSuggestion + 1);
      }
    }
  };

  const scrollSuggestionIntoView = (index) => {
    if (suggestionsRef.current && suggestionsRef.current.children[index]) {
      suggestionsRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const handleInputFocus = () => {
    if (inputValue) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div>
        {/* Do not remove the main div */}
        <div className="autocomplete-container" data-testid="autocomplete">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Search fruits..."
            className="autocomplete-input"
            data-testid="autocomplete-input"
          />
          {showSuggestions && (
            <ul 
              className="suggestions-list" 
              ref={suggestionsRef}
              data-testid="suggestions-list"
            >
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion}
                    className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    data-testid={`suggestion-item-${index}`}
                  >
                    {suggestion}
                  </li>
                ))
              ) : (
                <li className="no-suggestions" data-testid="no-suggestions">
                  <em>No suggestions found</em>
                </li>
              )}
            </ul>
          )}
        </div>
    </div>
  )
}

export default App;