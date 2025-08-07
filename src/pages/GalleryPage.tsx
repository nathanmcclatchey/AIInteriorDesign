import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Loader2, AlertCircle } from 'lucide-react'
import { roomTypeLabels, styleTypeLabels, type DesignProject } from '@shared/schema'

export default function GalleryPage() {
  const { data: projects, isLoading, error } = useQuery<DesignProject[]>({
    queryKey: ['/api/projects'],
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load projects</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: DesignProject['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Design Gallery</h1>
          <p className="text-muted-foreground">
            View all your AI-generated interior design projects
          </p>
        </div>
        
        <Link href="/create">
          <Button data-testid="button-create-new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first AI interior design project to get started
          </p>
          <Link href="/create">
            <Button data-testid="button-create-first">
              Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img
                  src={project.originalImageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  data-testid={`img-project-${project.id}`}
                />
                <div className="absolute top-2 right-2">
                  <Badge 
                    className={`${getStatusColor(project.status)} text-white`}
                    data-testid={`badge-status-${project.id}`}
                  >
                    {project.status === 'completed' && 'Done'}
                    {project.status === 'processing' && 'Processing'}
                    {project.status === 'failed' && 'Failed'}
                    {project.status === 'uploading' && 'Uploading'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight" data-testid={`text-title-${project.id}`}>
                  {project.title}
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {roomTypeLabels[project.roomType]}
                    </span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {styleTypeLabels[project.styleType].name}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground" data-testid={`text-date-${project.id}`}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/project/${project.id}`}>
                    <Button size="sm" variant="outline" data-testid={`button-view-${project.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}