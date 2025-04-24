import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">SmartShelf</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An intelligent retail shelf management system that uses computer vision to optimize product placement and
            inventory tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Object Counting</CardTitle>
              <CardDescription>Automatically count products on shelves</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=160&width=320"
                  alt="Object counting visualization"
                  width={320}
                  height={160}
                  className="rounded-md"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Our advanced algorithms can detect and count products on retail shelves with high accuracy.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/functions" className="w-full">
                <Button className="w-full">
                  Try it <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Image Preprocessing</CardTitle>
              <CardDescription>Enhance retail images for better analysis</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=160&width=320"
                  alt="Image preprocessing visualization"
                  width={320}
                  height={160}
                  className="rounded-md"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Transform raw images with our preprocessing tools including edge detection and thresholding.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/functions" className="w-full">
                <Button className="w-full">
                  Try it <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Property Detection</CardTitle>
              <CardDescription>Analyze product properties for optimal placement</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=160&width=320"
                  alt="Property detection visualization"
                  width={320}
                  height={160}
                  className="rounded-md"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Identify key product properties like roundness, fragility, and sharpness for optimal shelf placement.
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/functions" className="w-full">
                <Button className="w-full">
                  Try it <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More About SmartShelf
            </Button>
          </Link>
          <Link href="/functions">
            <Button size="lg">Try SmartShelf Functions</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
