
import React, { useState, useEffect, useRef } from 'react';
import './../styles/App.css';

const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig"];

const AutoComplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Debounce the search to prevent UI freezes
    const timer = setTimeout(() => {
      if (inputValue.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filteredFruits = fruits.filter(fruit =>
        fruit.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredFruits);
      setActiveSuggestion(0);
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
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search fruits..."
        className="autocomplete-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && inputValue && suggestions.length === 0 && (
        <div className="no-suggestions">
          <em>No suggestions found</em>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
