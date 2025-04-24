"use client"

import { useState, useRef } from "react"
import Image from "next/image"
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      countObjects()
      setIsProcessing(false)
    }, 1500)
  }

  const countObjects = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0, img.width, img.height)

      // Simulate object detection by drawing rectangles
      // In a real application, this would use actual computer vision algorithms
      const numObjects = Math.floor(Math.random() * 10) + 5 // Random number between 5-15
      setObjectCount(numObjects)

      // Draw bounding boxes around "detected" objects
      ctx.strokeStyle = "rgba(0, 255, 0, 0.8)"
      ctx.lineWidth = 3

      for (let i = 0; i < numObjects; i++) {
        const x = Math.random() * (img.width - 100)
        const y = Math.random() * (img.height - 100)
        const width = Math.random() * 100 + 50
        const height = Math.random() * 100 + 50

        ctx.strokeRect(x, y, width, height)

        // Add object number
        ctx.fillStyle = "rgba(0, 255, 0, 0.8)"
        ctx.font = "16px Arial"
        ctx.fillText(`#${i + 1}`, x + 5, y + 20)
      }

      setProcessedImageUrl(canvas.toDataURL("image/png"))
    }

    img.src = imageUrl
  }

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
              <Image src={imageUrl || "/placeholder.svg"} alt="Original image" fill className="object-contain" />
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
                <Image
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
            <canvas ref={canvasRef} className="hidden" />
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
