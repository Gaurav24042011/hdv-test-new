import React, { useState, useRef, useEffect } from "react";
import "./AutoComplete.css";
import Image from "../Image/Image";
import heart from "../../assets/heart.svg";

const AutoComplete = ({
  suggestions,
  val,
  handleSearch,
  readOnly = false,
  customClassName = "",
  isBusinessRegister = false,
  isGlobalSearch = false,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionRefs = useRef([]);

  // Update refs when suggestions change
  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(
      0,
      filteredSuggestions.length
    );
  }, [filteredSuggestions]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    handleSearch(value);

    if (value) {
      const filtered = suggestions?.filter((item) =>
        item.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      if (isBusinessRegister) {
        setShowSuggestions(true);
        setFilteredSuggestions(suggestions);
      } else setShowSuggestions(false);
    }
    setActiveIndex(-1);
  };

  const handleClick = (e, suggestion) => {
    e.preventDefault();

    if (isBusinessRegister) {
      handleSearch(suggestion);
    } else handleSearch(suggestion.name);
    setShowSuggestions(false);
  };

  useEffect(()=>{
    if(val?.length===0)
    setShowSuggestions(false)
  },[val])

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        if (isBusinessRegister) handleSearch(filteredSuggestions[activeIndex]);
        else handleSearch(filteredSuggestions[activeIndex].name);
      } else handleSearch(e.target.value);
      setShowSuggestions(false);
    }
  };

  const scrollToItem = (index) => {
    const itemElement = suggestionRefs.current[index];
    if (itemElement) {
      itemElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll
        block: "nearest", // Scroll the closest edge of the element into view
      });
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    setFilteredSuggestions(suggestions);
  };

  const handleBlur = () => {
    // Hide suggestions when input field loses focus
    // setShowSuggestions(false);
  };

  // Scroll to the active item whenever activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0) {
      scrollToItem(activeIndex);
    }
  }, [activeIndex]);

  const highlightMatch = (suggestion) => {
    if (!val) return suggestion;

    const parts = suggestion?.split(new RegExp(`(${val})`, "gi"));
    return parts?.map((part, index) =>
      part.toLowerCase() === val.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        placeholder="Search category"
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        className={customClassName}
        onFocus={isBusinessRegister ? handleFocus : null}
        onBlur={isBusinessRegister ? handleBlur : null}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="autocomplete-items">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index} // Use a unique key
              ref={(el) => (suggestionRefs.current[index] = el)} // Assign ref
              className={`${
                index === activeIndex ? "autocomplete-active" : " autocomplete-list"
              }`}
              onClick={(e) => handleClick(e, suggestion)}
            >
              {isGlobalSearch && (
                <span>
                  <Image src={suggestion?.icon} defaultImageSrc={heart} />
                </span>
              )}
              <p className="global-search-list">
                <span className="global-search-name">
                  {highlightMatch(suggestion.name)}
                </span>
                {isGlobalSearch && (
                  <span className="search-type">
                    {suggestion?.searchType === "business"
                      ? `${suggestion?.area}, ${suggestion?.city}`
                      : suggestion?.searchType}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
