"use client"

import { useState } from "react"

export function TextareaInput({
  label,
  placeholder = "Tulis sesuatu...",
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  error,
  helperText,
  showCount = false,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const charCount = value?.length || 0

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 rounded-xl resize-none
            bg-white border-2 transition-all duration-200
            placeholder:text-gray-400 text-gray-800
            focus:outline-none
            ${
              error
                ? "border-red-300 focus:border-red-500"
                : isFocused
                  ? "border-[#2d8a8a] shadow-sm shadow-[#2d8a8a]/10"
                  : "border-gray-200 hover:border-gray-300"
            }
            ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}
          `}
        />

        {(showCount || maxLength) && (
          <div
            className={`
            absolute bottom-3 right-3 text-xs
            ${charCount >= (maxLength || Number.POSITIVE_INFINITY) ? "text-red-500" : "text-gray-400"}
          `}
          >
            {charCount}
            {maxLength ? ` / ${maxLength}` : ""}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>{error || helperText}</p>
      )}
    </div>
  )
}

export function TextareaInputWithLabel({
  label,
  placeholder = "Tulis sesuatu...",
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  error,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const charCount = value?.length || 0
  const hasValue = value && value.length > 0

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={isFocused || hasValue ? placeholder : " "}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-4 pt-6 rounded-xl resize-none peer
            bg-white border-2 transition-all duration-200
            placeholder:text-gray-400 text-gray-800
            focus:outline-none
            ${
              error
                ? "border-red-300 focus:border-red-500"
                : isFocused
                  ? "border-[#2d8a8a] shadow-sm shadow-[#2d8a8a]/10"
                  : "border-gray-200 hover:border-gray-300"
            }
            ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}
          `}
        />

        <label
          className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isFocused || hasValue ? "top-2 text-xs font-medium text-[#2d8a8a]" : "top-4 text-sm text-gray-400"}
          ${error ? "text-red-500" : ""}
        `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {maxLength && (
          <div
            className={`
            absolute bottom-3 right-3 text-xs
            ${charCount >= maxLength ? "text-red-500" : "text-gray-400"}
          `}
          >
            {charCount} / {maxLength}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}
