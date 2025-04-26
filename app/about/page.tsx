import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Code, Database, LineChart } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About SmartShelf</h1>
          <p className="text-xl text-muted-foreground">
            SmartShelf is an innovative project that combines computer vision and machine learning to revolutionize
            retail shelf management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              SmartShelf aims to optimize retail spaces by automatically analyzing product placement, counting
              inventory, and suggesting improvements based on product properties and customer behavior.
            </p>
            <p className="text-muted-foreground">
              By leveraging advanced computer vision techniques, we help retailers maximize shelf space utilization,
              improve product visibility, and enhance the overall shopping experience.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/shelf.png?height=300&width=500"
              alt="SmartShelf concept"
              width={500}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>

        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Object Counting</CardTitle>
                  <CardDescription>Automatically count products on retail shelves</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Using advanced object detection algorithms, SmartShelf can accurately count products on shelves,
                    helping with inventory management and restocking decisions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Image Preprocessing</CardTitle>
                  <CardDescription>Enhance retail images for better analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our preprocessing pipeline includes resizing, grayscale conversion, edge detection, and other
                    techniques to prepare images for accurate analysis.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">Property Detection</CardTitle>
                  <CardDescription>Analyze product properties for optimal placement</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    SmartShelf can detect product properties like roundness, fragility, and sharpness to recommend
                    optimal shelf arrangements and spacing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="technical" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Code className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Computer Vision Algorithms</h3>
                    <p className="text-sm text-muted-foreground">
                      SmartShelf uses state-of-the-art computer vision algorithms including YOLO for object detection,
                      Canny edge detection, and custom contour analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Data Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Our system processes image data through multiple stages, extracting features and properties that
                      inform shelf optimization decisions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LineChart className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Machine Learning Models</h3>
                    <p className="text-sm text-muted-foreground">
                      Custom-trained models help classify products and their properties, improving over time with more
                      data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Validation & Testing</h3>
                    <p className="text-sm text-muted-foreground">
                      All algorithms are rigorously tested against diverse retail environments to ensure accuracy and
                      reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="benefits" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">For Retailers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Optimize shelf space utilization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reduce manual inventory counting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Improve product visibility and accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Data-driven merchandising decisions</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">For Customers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Enhanced shopping experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Better product organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reduced out-of-stock situations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Improved product discovery</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <section className="py-8">
          <h2 className="text-3xl font-bold mb-8">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                    <Image
                      src="/team/ananya.png?height=128&width=128"
                      alt="Ananya Sachan"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">Ananya Sachan</h3>
                  {/* <p className="text-sm text-primary mb-2">Project Lead</p>
                  <p className="text-sm text-muted-foreground">
                    Computer vision expert with 10+ years of experience in retail technology solutions.
                  </p> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                    <Image
                      src="/team/hevardhan.jpg?height=128&width=128"
                      alt="Hevardhan S"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">Hevardhan S</h3>
                  {/* <p className="text-sm text-primary mb-2">ML Engineer</p>
                  <p className="text-sm text-muted-foreground">
                    Specializes in machine learning algorithms for object detection and classification.
                  </p> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="Aisha Patel"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  {/* <h3 className="text-xl font-bold">Aisha Patel</h3>
                  <p className="text-sm text-primary mb-2">UX Researcher</p>
                  <p className="text-sm text-muted-foreground">
                    Focuses on user experience and retail environment optimization strategies.
                  </p> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="David Kim"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  {/* <h3 className="text-xl font-bold">David Kim</h3>
                  <p className="text-sm text-primary mb-2">Software Architect</p>
                  <p className="text-sm text-muted-foreground">
                    Leads the development of scalable infrastructure and integration with retail systems.
                  </p> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="text-center">
          <Link href="/functions">
            <Button size="lg">Try SmartShelf Functions</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
