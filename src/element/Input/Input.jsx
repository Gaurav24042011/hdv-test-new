import React from "react";
import "./Input.scss";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

export const Input = ({
  type,
  id,
  name,
  customClass,
  placeholderText,
  value,
  handleInputChange,
  lableText,
  isRequired = false,
  maxLength,
  isPasswordFiled = false,
  handleTogglePassword,
  showPassword,
  handleFocus,
  inputRef= null,
  handleBlur,

}) => {
  return (
    <>
      {lableText && (
        <label htmlFor="name" className="hdv-margin-bottom-4">
          {lableText} {isRequired && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        ref={inputRef}
        id={id}
        name={name}
        autoComplete="off"
        maxLength={maxLength}
        className={`common-input ${customClass}`}
        placeholder={placeholderText}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus && handleFocus}
        onBlur={handleBlur && handleBlur}
      />
      {isPasswordFiled && value && (
        <button
          type="button"
          className="toggle-password-visibility"
          onClick={handleTogglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeSlashFill /> : <EyeFill />}
        </button>
      )}
    </>
  );
};
