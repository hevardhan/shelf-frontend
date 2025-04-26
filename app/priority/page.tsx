"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CSVUploader from "@/components/CSVUploader"

export default function FunctionsPage() {
  const [csvData, setCsvData] = useState<string | null>(null)
  const [tableData, setTableData] = useState<string[][]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [topItems, setTopItems] = useState<string[]>([])
  const rowsPerPage = 10

  useEffect(() => {
    setCurrentPage(1) // Reset to first page on new upload
  }, [tableData])

  const handleCSVUpload = async (csvString: string, topN: number) => {
    setCsvData(csvString)
    const rows = csvString.trim().split("\n")
    const parsedData = rows.map((row) => row.split(","))
    setTableData(parsedData)

    // Send CSV to backend for processing
    const formData = new FormData()
    formData.append("file", new Blob([csvString], { type: "text/csv" }))
    formData.append("top_n", topN.toString())

    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/generate-images/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process the CSV file!")
      }

      const result = await response.json()
      setGeneratedImages(result.generated_images || [])
      setTopItems(result.top_items || [])
    } catch (error) {
      console.error(error)
      alert("An error occurred while generating images")
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil((tableData.length - 1) / rowsPerPage)
  const paginatedRows = tableData.slice(
    (currentPage - 1) * rowsPerPage + 1,
    currentPage * rowsPerPage + 1
  )

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">SmartShelf Functions</h1>
          <p className="text-xl text-muted-foreground">
            Upload a CSV file to generate images for top-priority items.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload a CSV</CardTitle>
            <CardDescription>
              Select or drag and drop a CSV file to view its table and generate images.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <CSVUploader
  onUploadComplete={(response) => handleCSVUpload(response, 5)} // Replace 5 with the desired topN value
/>
          </CardContent>
        </Card>

        {csvData && (
          <Card>
            <CardHeader>
              <CardTitle>CSV Table</CardTitle>
              <CardDescription>Preview of uploaded data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                  <thead>
                    <tr className="bg-muted">
                      {tableData[0]?.map((header, idx) => (
                        <th key={idx} className="border px-4 py-2 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-muted/10">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <p className="text-center text-muted-foreground">Processing, please wait...</p>
        )}

        {generatedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Images</CardTitle>
              <CardDescription>Review the generated images for top-priority items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedImages.map((image, idx) => (
                  <div key={idx} className="space-y-2 text-center">
                    <Image
                      src={image}
                      alt={`Generated image for ${topItems[idx]}`}
                      width={150}
                      height={150}
                      className="rounded-lg shadow-md"
                    />
                    <p className="text-sm font-medium">{topItems[idx]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}