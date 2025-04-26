"use client"

import { useState, useRef } from "react"
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

  const processImage = async () => {
    if (!imageUrl) return;
  
    setIsProcessing(true);
  
    try {
      const res = await fetch("http://localhost:8000/process-image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_base64: imageUrl,
          type: preprocessingType,
          
        }),
        
      });
      if (!res.ok) throw new Error("Image processing failed");
      
      const data = await res.json();
      setProcessedImageUrl(data.processed_image);
      console.log(data.processed_image);
    } catch (error) {
      console.error(error);
      alert("Image processing failed. Check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const resetImage = () => {
    setProcessedImageUrl(null)
    setPreprocessingType("grayscale")
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
              <img src={imageUrl || "/placeholder.svg"} alt="Original image" className="object-contain w-full h-full" />
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
                <img
                  src={processedImageUrl || "/placeholder.svg"}
                  alt="Processed image"
                  className="object-contain w-full h-full"
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

              {processedImageUrl && (
                <a href={processedImageUrl} download="processed-image.png">
                  <Button variant="outline" className="w-full mt-4">Download Image</Button>
                </a>
              )}

              <Button variant="secondary" onClick={resetImage} className="w-full">Reset</Button>
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
