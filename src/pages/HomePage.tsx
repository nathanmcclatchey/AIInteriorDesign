import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Wand2, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Camera,
      title: 'Upload & Transform',
      description: 'Upload any room photo and watch our AI transform it into a beautifully designed space',
    },
    {
      icon: Wand2,
      title: '8 Design Styles',
      description: 'Choose from modern, scandinavian, industrial, bohemian, and more design styles',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get professional-quality styled rooms in seconds, not days',
    },
    {
      icon: Shield,
      title: 'High Quality',
      description: 'AI-powered design that rivals professional interior designers',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Transform Your Spaces with{' '}
          <span className="text-primary">AI-Powered Design</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Upload a photo of any room and instantly see it transformed with professional interior design. 
          Perfect for real estate staging, home decoration, or design inspiration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" className="text-lg px-8" data-testid="button-get-started">
              Get Started - It's Free
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="text-lg px-8" data-testid="button-view-examples">
              View Examples
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Design Platform?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-muted/50 rounded-2xl">
        <div className="px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-muted-foreground">
                Take or upload a photo of any room you want to redesign
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Style</h3>
              <p className="text-muted-foreground">
                Select from 8 professional design styles and room types
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Design</h3>
              <p className="text-muted-foreground">
                Download your professionally styled room in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Start creating stunning interior designs in seconds
        </p>
        <Link href="/create">
          <Button size="lg" className="text-lg px-8" data-testid="button-start-designing">
            Start Designing Now
          </Button>
        </Link>
      </section>
    </div>
  )
}