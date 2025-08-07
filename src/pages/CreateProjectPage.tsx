import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'wouter'
import { createProjectSchema, type CreateProjectInput, roomTypeLabels, styleTypeLabels } from '@shared/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Upload, Loader2 } from 'lucide-react'
import { apiRequest } from '@/lib/queryClient'

export default function CreateProjectPage() {
  const [, setLocation] = useLocation()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const queryClient = useQueryClient()

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      roomType: 'living-room',
      styleType: 'modern',
    },
  })

  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectInput & { image: File }) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('roomType', data.roomType)
      formData.append('styleType', data.styleType)
      formData.append('image', data.image)

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create project')
      }

      return response.json()
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] })
      setLocation(`/project/${project.id}`)
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: CreateProjectInput) => {
    if (!selectedImage) return
    
    createProjectMutation.mutate({
      ...data,
      image: selectedImage,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Design Project</h1>
        <p className="text-muted-foreground">
          Upload a room photo and let our AI transform it with professional interior design
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Room Photo</CardTitle>
            <CardDescription>
              Choose a clear photo of the room you want to redesign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors ${
                  imagePreview ? 'border-primary' : ''
                }`}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Room preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg"
                      data-testid="img-preview"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview('')
                      }}
                      data-testid="button-remove-image"
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop or click to select
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                data-testid="input-file"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Configure your design preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField name="title">
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Living Room Redesign"
                    {...form.register('title')}
                    data-testid="input-title"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.title?.message}
                </FormMessage>
              </FormField>

              <FormField name="roomType">
                <FormLabel>Room Type</FormLabel>
                <FormControl>
                  <Select {...form.register('roomType')} data-testid="select-room-type">
                    {Object.entries(roomTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.roomType?.message}
                </FormMessage>
              </FormField>

              <FormField name="styleType">
                <FormLabel>Design Style</FormLabel>
                <FormControl>
                  <Select {...form.register('styleType')} data-testid="select-style-type">
                    {Object.entries(styleTypeLabels).map(([value, style]) => (
                      <SelectItem key={value} value={value}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.styleType?.message}
                </FormMessage>
              </FormField>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedImage || createProjectMutation.isPending}
                data-testid="button-create-project"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>

              {createProjectMutation.error && (
                <div className="text-sm text-destructive mt-2" data-testid="text-error">
                  {createProjectMutation.error.message}
                </div>
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}