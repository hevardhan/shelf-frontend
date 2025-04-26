"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CSVUploaderProps {
  onUploadComplete?: (response: any) => void
}

export default function CSVUploader({ onUploadComplete }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [topN, setTopN] = useState<number>(5)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }
    setFileName(file.name)
    setCsvFile(file)
  }

  const clearFile = () => {
    setFileName(null)
    setCsvFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file before proceeding")
      return
    }

    if (topN <= 0) {
      alert("Please enter a valid number for top priority objects")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", csvFile)
    formData.append("top_n", topN.toString())

    try {
      const response = await fetch("http://localhost:8000/generate-images/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload the file and process the request")
      }

      const result = await response.json()
      alert("Images generated successfully!")
      if (onUploadComplete) {
        onUploadComplete(result)
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while processing the request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {!fileName ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop a CSV file, or click to browse</p>
          <p className="text-xs text-muted-foreground">Only .csv files are supported</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="relative border rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm font-medium">{fileName}</p>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              clearFile()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="top-n-input" className="block text-sm font-medium text-muted-foreground mb-2">
          How many top priority objects would you like to generate?
        </label>
        <input
          id="top-n-input"
          type="number"
          className="border rounded-lg p-2 w-full"
          placeholder="Enter a number"
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
        />
      </div>

      <div className="mt-4">
        <Button variant="outline" size="lg" onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Generate Images"}
        </Button>
      </div>
    </div>
  )
}