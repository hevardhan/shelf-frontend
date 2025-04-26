"use client"

import { useState, useRef, useEffect } from "react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw, Check, Package } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ObjectCounterProps {
  imageUrl: string
}

export default function ObjectCounter({ imageUrl }: ObjectCounterProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [objectCount, setObjectCount] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isClient, setIsClient] = useState(false) // State to check if it's client-side rendering

  // This hook runs only on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const processImage = async () => {
    if (!imageUrl) return

    setIsProcessing(true)

    try {
      // Convert the image URL to base64 before sending it
      const imageResponse = await fetch(imageUrl)
      const imageBlob = await imageResponse.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string
        
        // Send the base64 string to the backend for processing
        const res = await fetch("http://localhost:8000/count-objects/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_base64: base64Image,
          }),
        })

        if (!res.ok) throw new Error("Image processing failed")

        const data = await res.json()
        setProcessedImageUrl(data.processed_image)
        console.log(data.processed_image)
        setObjectCount(data.object_count) // Assuming the backend returns object count
      }

      reader.readAsDataURL(imageBlob)
    } catch (error) {
      console.error(error)
      alert("Image processing failed. Check the console for details.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Only render the UI elements that depend on window or client-side logic after the client has loaded
  if (!isClient) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Image</CardTitle>
            <CardDescription>Original shelf image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-md overflow-hidden border">
              <NextImage
                src={imageUrl || "/placeholder.svg"}
                alt="Original image"
                fill
                className="object-contain"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processed Result</CardTitle>
            <CardDescription>Detected objects with bounding boxes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-md overflow-hidden border bg-muted/50 flex items-center justify-center">
              {processedImageUrl ? (
                <NextImage
                  src={processedImageUrl || "/placeholder.svg"}
                  alt="Processed image"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-2" />
                  <p>Process the image to see results</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={processImage} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : processedImageUrl ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Process Again
                </>
              ) : (
                <>Count Objects</>
              )}
            </Button>

            {objectCount !== null && (
              <div className="text-sm font-medium">
                Objects detected: <span className="text-primary">{objectCount}</span>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      {objectCount !== null && (
        <Alert className="bg-primary/10 border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <AlertTitle>Analysis Complete</AlertTitle>
          <AlertDescription>
            We detected {objectCount} objects on the shelf. In a real-world scenario, this information would be used for
            inventory management and product placement optimization.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
