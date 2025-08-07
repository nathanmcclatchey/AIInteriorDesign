import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import { Router, Route, Switch } from 'wouter'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CreateProjectPage from './pages/CreateProjectPage'
import ProjectPage from './pages/ProjectPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/create" component={CreateProjectPage} />
              <Route path="/project/:id" component={ProjectPage} />
              <Route path="/gallery" component={GalleryPage} />
              <Route component={() => <div className="flex items-center justify-center min-h-[50vh]"><p className="text-muted-foreground">Page not found</p></div>} />
            </Switch>
          </Router>
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App