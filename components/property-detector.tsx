"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCw, Box, Check, Circle, Triangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface PropertyDetectorProps {
  imageUrl: string
}

interface ProductProperty {
  id: number
  name: string
  shape: "circle" | "square" | "triangle"
  x: number
  y: number
  width: number
  height: number
  roundness: number
  fragility: number
  sharpness: number
}

export default function PropertyDetector({ imageUrl }: PropertyDetectorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [detectedProducts, setDetectedProducts] = useState<ProductProperty[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductProperty | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      detectProperties()
      setIsProcessing(false)
    }, 2000)
  }

  const detectProperties = () => {
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

      // Simulate product detection
      // In a real application, this would use actual computer vision algorithms
      const numProducts = Math.floor(Math.random() * 5) + 3 // Random number between 3-8
      const products: ProductProperty[] = []

      const shapes = ["circle", "square", "triangle"] as const

      for (let i = 0; i < numProducts; i++) {
        const x = Math.random() * (img.width - 150)
        const y = Math.random() * (img.height - 150)
        const width = Math.random() * 80 + 70
        const height = Math.random() * 80 + 70

        products.push({
          id: i + 1,
          name: `Product ${i + 1}`,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          x,
          y,
          width,
          height,
          roundness: Math.random(),
          fragility: Math.random(),
          sharpness: Math.random(),
        })
      }

      // Draw products on canvas
      products.forEach((product) => {
        // Set color based on product properties
        const r = Math.floor(product.roundness * 255)
        const g = Math.floor((1 - product.fragility) * 255)
        const b = Math.floor((1 - product.sharpness) * 255)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`
        ctx.lineWidth = 2

        if (product.shape === "circle") {
          const radius = Math.min(product.width, product.height) / 2
          ctx.beginPath()
          ctx.arc(product.x + radius, product.y + radius, radius, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        } else if (product.shape === "square") {
          ctx.fillRect(product.x, product.y, product.width, product.height)
          ctx.strokeRect(product.x, product.y, product.width, product.height)
        } else if (product.shape === "triangle") {
          ctx.beginPath()
          ctx.moveTo(product.x + product.width / 2, product.y)
          ctx.lineTo(product.x + product.width, product.y + product.height)
          ctx.lineTo(product.x, product.y + product.height)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }

        // Add product ID
        ctx.fillStyle = "white"
        ctx.font = "bold 16px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`#${product.id}`, product.x + product.width / 2, product.y + product.height / 2)
      })

      setDetectedProducts(products)
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
            <CardTitle>Detected Properties</CardTitle>
            <CardDescription>Products with detected properties</CardDescription>
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
                  <Box className="h-10 w-10 mx-auto mb-2" />
                  <p>Process the image to see results</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
          <CardFooter>
            <Button onClick={processImage} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : processedImageUrl ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Detect Again
                </>
              ) : (
                <>Detect Product Properties</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {detectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Properties</CardTitle>
            <CardDescription>Select a product to view its properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {detectedProducts.map((product) => (
                <Button
                  key={product.id}
                  variant={selectedProduct?.id === product.id ? "default" : "outline"}
                  className="h-auto py-2 px-3 flex flex-col items-center gap-2"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.shape === "circle" ? (
                    <Circle className="h-8 w-8" />
                  ) : product.shape === "square" ? (
                    <Box className="h-8 w-8" />
                  ) : (
                    <Triangle className="h-8 w-8" />
                  )}
                  <span>Product #{product.id}</span>
                </Button>
              ))}
            </div>

            {selectedProduct && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Product #{selectedProduct.id} Properties</h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Roundness</span>
                      <span>{Math.round(selectedProduct.roundness * 100)}%</span>
                    </div>
                    <Progress value={selectedProduct.roundness * 100} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Fragility</span>
                      <span>{Math.round(selectedProduct.fragility * 100)}%</span>
                    </div>
                    <Progress value={selectedProduct.fragility * 100} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Sharpness</span>
                      <span>{Math.round(selectedProduct.sharpness * 100)}%</span>
                    </div>
                    <Progress value={selectedProduct.sharpness * 100} className="h-2" />
                  </div>
                </div>

                <Alert className="bg-primary/10 border-primary/20">
                  <Check className="h-4 w-4 text-primary" />
                  <AlertTitle>Placement Recommendation</AlertTitle>
                  <AlertDescription>
                    {selectedProduct.fragility > 0.7
                      ? "This product is fragile and should be placed on middle shelves with adequate spacing."
                      : selectedProduct.sharpness > 0.7
                        ? "This product has sharp edges and should be placed on higher shelves away from customer reach."
                        : "This product is suitable for standard shelf placement with normal spacing."}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
