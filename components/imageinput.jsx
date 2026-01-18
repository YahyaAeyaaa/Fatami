"use client"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Camera } from "lucide-react"

export function ImageInput({
  value,
  onChange,
  label = "Upload Gambar",
  accept = "image/*",
  maxSize = 5, // in MB
  placeholder = "Klik atau drag gambar ke sini",
}) {
  const [preview, setPreview] = useState(value || null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  const handleFile = (file) => {
    setError("")

    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar")
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSize}MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onChange?.(file)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setPreview(null)
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
          ${
            isDragging
              ? "border-[#2d8a8a] bg-[#2d8a8a]/5"
              : "border-gray-200 hover:border-[#2d8a8a]/50 hover:bg-gray-50"
          }
          ${preview ? "p-2" : "p-8"}
          ${error ? "border-red-300 bg-red-50/50" : ""}
        `}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

        {preview ? (
          <div className="relative group">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragging ? "bg-[#2d8a8a]/10 text-[#2d8a8a]" : "bg-gray-100 text-gray-400"}
            `}
            >
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, atau GIF (maks. {maxSize}MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

export function ImageInputMultiple({
  value = [],
  onChange,
  label = "Upload Gambar",
  accept = "image/*",
  maxSize = 5,
  maxFiles = 5,
  placeholder = "Klik atau drag gambar ke sini",
}) {
  const [previews, setPreviews] = useState(value || [])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    setError("")

    if (!files || files.length === 0) return

    const remainingSlots = maxFiles - previews.length
    if (remainingSlots <= 0) {
      setError(`Maksimal ${maxFiles} gambar`)
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    const newPreviews = []
    const newFiles = []

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Semua file harus berupa gambar")
        return
      }
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Ukuran file maksimal ${maxSize}MB`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        newFiles.push(file)

        if (newPreviews.length === filesToProcess.length) {
          const updatedPreviews = [...previews, ...newPreviews]
          setPreviews(updatedPreviews)
          onChange?.(newFiles)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleChange = (e) => {
    handleFiles(e.target.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemove = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    onChange?.(null, index)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          <span className="text-gray-400 font-normal ml-2">
            ({previews.length}/{maxFiles})
          </span>
        </label>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-100"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-6
            ${
              isDragging
                ? "border-[#2d8a8a] bg-[#2d8a8a]/5"
                : "border-gray-200 hover:border-[#2d8a8a]/50 hover:bg-gray-50"
            }
            ${error ? "border-red-300 bg-red-50/50" : ""}
          `}
        >
          <input ref={inputRef} type="file" accept={accept} onChange={handleChange} multiple className="hidden" />
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              className={`
              p-3 rounded-full transition-colors duration-200
              ${isDragging ? "bg-[#2d8a8a]/10 text-[#2d8a8a]" : "bg-gray-100 text-gray-400"}
            `}
            >
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, atau GIF (maks. {maxSize}MB per file)</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
