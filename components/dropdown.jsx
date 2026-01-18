"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

export function Dropdown({ options = [], value, onChange, placeholder = "Pilih opsi", label, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between px-4 py-2.5
            bg-white border border-gray-200 rounded-xl
            text-left text-sm
            transition-all duration-200 ease-out
            ${
              disabled
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:border-gray-300 hover:shadow-sm focus:outline-none focus:border-[#1a2e3b] focus:ring-2 focus:ring-[#1a2e3b]/10"
            }
            ${isOpen ? "border-[#1a2e3b] ring-2 ring-[#1a2e3b]/10 shadow-sm" : ""}
          `}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">Tidak ada opsi</div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                      transition-colors duration-150
                      ${
                        option.value === value
                          ? "bg-[#1a2e3b]/5 text-[#1a2e3b] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {option.value === value && <Check className="w-4 h-4 text-[#1a2e3b]" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Multi-select variant
export function DropdownMultiple({
  options = [],
  value = [],
  onChange,
  placeholder = "Pilih opsi",
  label,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedLabels = options.filter((opt) => value.includes(opt.value)).map((opt) => opt.label)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between px-4 py-2.5
            bg-white border border-gray-200 rounded-xl
            text-left text-sm
            transition-all duration-200 ease-out
            ${
              disabled
                ? "opacity-50 cursor-not-allowed bg-gray-50"
                : "hover:border-gray-300 hover:shadow-sm focus:outline-none focus:border-[#1a2e3b] focus:ring-2 focus:ring-[#1a2e3b]/10"
            }
            ${isOpen ? "border-[#1a2e3b] ring-2 ring-[#1a2e3b]/10 shadow-sm" : ""}
          `}
        >
          <span className={selectedLabels.length > 0 ? "text-gray-900" : "text-gray-400"}>
            {selectedLabels.length > 0
              ? selectedLabels.length <= 2
                ? selectedLabels.join(", ")
                : `${selectedLabels.length} dipilih`
              : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">Tidak ada opsi</div>
              ) : (
                options.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                        transition-colors duration-150
                        ${isSelected ? "bg-[#1a2e3b]/5 text-[#1a2e3b]" : "text-gray-700 hover:bg-gray-50"}
                      `}
                    >
                      <div
                        className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150
                        ${isSelected ? "bg-[#1a2e3b] border-[#1a2e3b]" : "border-gray-300"}
                      `}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={isSelected ? "font-medium" : ""}>{option.label}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
