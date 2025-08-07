import { Link, useLocation } from 'wouter'
import { Button } from './ui/button'
import { Camera, Home, Plus, Images } from 'lucide-react'

export default function Header() {
  const [location] = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/create', label: 'Create', icon: Plus },
    { path: '/gallery', label: 'Gallery', icon: Images },
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AI Interior Design</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                  data-testid={`button-nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}