"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw, ImageIcon, Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ImagePreprocessorProps {
  imageUrl: string
}

export default function ImagePreprocessor({ imageUrl }: ImagePreprocessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [preprocessingType, setPreprocessingType] = useState<string>("grayscale")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      applyPreprocessing()
      setIsProcessing(false)
    }, 1000)
  }

  const applyPreprocessing = () => {
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

      // Apply selected preprocessing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      switch (preprocessingType) {
        case "grayscale":
          // Convert to grayscale
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            data[i] = avg // red
            data[i + 1] = avg // green
            data[i + 2] = avg // blue
          }
          break

        case "edges":
          // Simple edge detection (this is a simplified version)
          // First convert to grayscale
          const grayscale = new Uint8ClampedArray(data.length)
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            grayscale[i] = grayscale[i + 1] = grayscale[i + 2] = avg
            grayscale[i + 3] = data[i + 3]
          }

          // Apply a simple edge detection filter
          for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
              const idx = (y * canvas.width + x) * 4

              // Simple Sobel-like operation
              const gx =
                -1 * grayscale[((y - 1) * canvas.width + (x - 1)) * 4] +
                -2 * grayscale[(y * canvas.width + (x - 1)) * 4] +
                -1 * grayscale[((y + 1) * canvas.width + (x - 1)) * 4] +
                1 * grayscale[((y - 1) * canvas.width + (x + 1)) * 4] +
                2 * grayscale[(y * canvas.width + (x + 1)) * 4] +
                1 * grayscale[((y + 1) * canvas.width + (x + 1)) * 4]

              const gy =
                -1 * grayscale[((y - 1) * canvas.width + (x - 1)) * 4] +
                -2 * grayscale[((y - 1) * canvas.width + x) * 4] +
                -1 * grayscale[((y - 1) * canvas.width + (x + 1)) * 4] +
                1 * grayscale[((y + 1) * canvas.width + (x - 1)) * 4] +
                2 * grayscale[((y + 1) * canvas.width + x) * 4] +
                1 * grayscale[((y + 1) * canvas.width + (x + 1)) * 4]

              // Magnitude
              const mag = Math.sqrt(gx * gx + gy * gy)

              // Threshold
              const threshold = 50
              const value = mag > threshold ? 255 : 0

              data[idx] = data[idx + 1] = data[idx + 2] = value
            }
          }
          break

        case "threshold":
          // Apply thresholding
          const threshold = 128
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            const value = avg > threshold ? 255 : 0
            data[i] = data[i + 1] = data[i + 2] = value
          }
          break
      }

      ctx.putImageData(imageData, 0, 0)
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
            <CardDescription>Image after preprocessing</CardDescription>
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
                  <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                  <p>Process the image to see results</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-4">
              <Tabs defaultValue="grayscale" className="w-full" onValueChange={(value) => setPreprocessingType(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="grayscale">Grayscale</TabsTrigger>
                  <TabsTrigger value="edges">Edge Detection</TabsTrigger>
                  <TabsTrigger value="threshold">Thresholding</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button onClick={processImage} disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Apply{" "}
                    {preprocessingType === "grayscale"
                      ? "Grayscale"
                      : preprocessingType === "edges"
                        ? "Edge Detection"
                        : "Thresholding"}
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {processedImageUrl && (
        <Alert className="bg-primary/10 border-primary/20">
          <Check className="h-4 w-4 text-primary" />
          <AlertTitle>Preprocessing Complete</AlertTitle>
          <AlertDescription>
            {preprocessingType === "grayscale"
              ? "Grayscale conversion simplifies the image by removing color information, making it easier to process for certain algorithms."
              : preprocessingType === "edges"
                ? "Edge detection highlights the boundaries between different objects, which is useful for identifying product outlines and shelf divisions."
                : "Thresholding separates objects from the background by converting pixels to either black or white based on their intensity."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
