import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'wouter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ArrowLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { roomTypeLabels, styleTypeLabels, type DesignProject } from '@shared/schema'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  
  const { data: project, isLoading, error, refetch } = useQuery<DesignProject>({
    queryKey: [`/api/projects/${id}`],
    refetchInterval: (data) => {
      // Refetch every 2 seconds while processing
      return data?.status === 'processing' ? 2000 : false
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Failed to load project</p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
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

  const getStatusText = (status: DesignProject['status']) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'processing': return 'Processing...'
      case 'failed': return 'Failed'
      default: return 'Uploading'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/gallery">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-project-title">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" data-testid="badge-room-type">
                {roomTypeLabels[project.roomType]}
              </Badge>
              <Badge variant="secondary" data-testid="badge-style-type">
                {styleTypeLabels[project.styleType].name}
              </Badge>
              <Badge className={getStatusColor(project.status)} data-testid="badge-status">
                {getStatusText(project.status)}
              </Badge>
            </div>
          </div>
          
          {project.status === 'completed' && project.styledImageUrl && (
            <Button asChild data-testid="button-download">
              <a href={project.styledImageUrl} download={`${project.title}-styled.jpg`}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card>
          <CardHeader>
            <CardTitle>Original Room</CardTitle>
            <CardDescription>The room you uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={project.originalImageUrl}
                alt="Original room"
                className="w-full h-full object-cover"
                data-testid="img-original"
              />
            </div>
          </CardContent>
        </Card>

        {/* Styled Image */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Styled Room</CardTitle>
            <CardDescription>
              {project.status === 'processing' && 'AI is creating your design...'}
              {project.status === 'completed' && 'Your professionally styled room'}
              {project.status === 'failed' && 'Design generation failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              {project.status === 'processing' && (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Generating your styled room...
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This usually takes 10-30 seconds
                  </p>
                </div>
              )}
              
              {project.status === 'completed' && project.styledImageUrl && (
                <img
                  src={project.styledImageUrl}
                  alt="AI-styled room"
                  className="w-full h-full object-cover"
                  data-testid="img-styled"
                />
              )}
              
              {project.status === 'failed' && (
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    Failed to generate styled room
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                    data-testid="button-retry-generation"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Room Type</dt>
              <dd className="text-sm" data-testid="text-room-type-detail">
                {roomTypeLabels[project.roomType]}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Design Style</dt>
              <dd className="text-sm" data-testid="text-style-type-detail">
                {styleTypeLabels[project.styleType].name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created</dt>
              <dd className="text-sm" data-testid="text-created-date">
                {new Date(project.createdAt).toLocaleDateString()}
              </dd>
            </div>
            {project.processingTimeMs && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Processing Time</dt>
                <dd className="text-sm" data-testid="text-processing-time">
                  {Math.round(project.processingTimeMs / 1000)} seconds
                </dd>
              </div>
            )}
          </dl>
          
          <div className="mt-4">
            <dt className="text-sm font-medium text-muted-foreground">Style Description</dt>
            <dd className="text-sm mt-1" data-testid="text-style-description">
              {styleTypeLabels[project.styleType].description}
            </dd>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}