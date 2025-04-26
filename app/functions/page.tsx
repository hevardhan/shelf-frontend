"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ImageUploader from "@/components/image-uploader"
import ObjectCounter from "@/components/object-counter"
import ImagePreprocessor from "@/components/image-preprocessor"
import PropertyDetector from "@/components/property-detector"

export default function FunctionsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleImageUpload = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl)
  }

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">SmartShelf Functions</h1>
          <p className="text-xl text-muted-foreground">
            Upload an image to try out the different SmartShelf functionalities
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload an Image</CardTitle>
            <CardDescription>
              Select or drag and drop a retail shelf image to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader onImageUpload={handleImageUpload} />
          </CardContent>
        </Card>

        {isMounted && selectedImage && (
          <Tabs defaultValue="object-counting" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="object-counting">Object Patching</TabsTrigger>
              <TabsTrigger value="preprocessing">Image Preprocessing</TabsTrigger>
              <TabsTrigger value="property-detection">Property Detection</TabsTrigger>
            </TabsList>

            <TabsContent value="object-counting" className="mt-6">
              <ObjectCounter imageUrl={selectedImage} />
            </TabsContent>

            <TabsContent value="preprocessing" className="mt-6">
              <ImagePreprocessor imageUrl={selectedImage} />
            </TabsContent>

            <TabsContent value="property-detection" className="mt-6">
              <PropertyDetector imageUrl={selectedImage} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
