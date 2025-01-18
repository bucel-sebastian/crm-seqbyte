import React, { useEffect, useRef, useState } from "react";

import { FaXmark } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa6";

function SelectInput({
  options = [],
  value,
  name,
  onChange,
  disabled = false,
  isMulti = false,
  isSearchable = false,
  placeholder = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOptionClick = (option) => {
    const event = { target: { name, value: "" } };

    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      const isSelected = currentValue.some((v) => v === option.value);

      if (isSelected) {
        event.target.value = currentValue.filter((v) => v !== option.value);
      } else {
        event.target.value = [...currentValue, option.value];
      }
    } else {
      event.target.value = option.value;
      setIsOpen(false);
    }

    setSearchValue("");
    onChange(event);
  };

  const removeOption = (optionToRemove, e) => {
    e.stopPropagation();

    if (Array.isArray(value)) {
      const updatedValue = value.filter((v) => v !== optionToRemove);

      const event = {
        target: {
          name,
          value: updatedValue,
        },
      };

      onChange(event);
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    if (Array.isArray(value)) {
      return value.length === 0 ? placeholder : null;
    }
    return options.find((option) => value === option.value)?.label;
  };

  return (
    <div
      className={`select-input-container ${isOpen ? "is-opened" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
      ref={selectRef}
    >
      <div
        className="select-input"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="select-input-value-container">
          {value === null ? (
            <>
              <span className="select-input-placeholder">{placeholder}</span>
            </>
          ) : (
            <>
              {Array.isArray(value) && value.length > 0 ? (
                value.map((v) => (
                  <span
                    key={v}
                    className="select-input-selected-value select-input-selected-value-multi-item"
                  >
                    {v}
                    <FaXmark
                      className="select-input-selected-value-remove"
                      onClick={(e) => removeOption(v, e)}
                    />
                  </span>
                ))
              ) : (
                <span className="select-input-selected-value">
                  {getDisplayValue()}
                </span>
              )}
            </>
          )}
        </div>
        <FaCaretDown className="select-input-caret-down" />
      </div>
      {isOpen && (
        <div className="select-input-options-container">
          {isSearchable && (
            <div className="select-input-search-container">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cauta..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="select-input-options-list">
            {filteredOptions.map((option, index) => {
              const isSelected = Array.isArray(value)
                ? value.some((v) => v === option.value)
                : value === option.value;

              return (
                <div
                  key={index}
                  className={`select-input-option-item ${
                    isSelected ? "select-input-option-item-selected" : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span>{option.label}</span>
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="select-input-no-options">Nu exista optiuni</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectInput;
