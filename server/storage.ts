import type { DesignProject, CreateProjectInput, UpdateProjectInput } from "../shared/schema.js";

// Storage interface for design projects
export interface IStorage {
  // Project management
  createProject(data: CreateProjectInput & { originalImageUrl: string }): Promise<DesignProject>;
  getProject(id: string): Promise<DesignProject | null>;
  getAllProjects(): Promise<DesignProject[]>;
  updateProject(data: UpdateProjectInput): Promise<DesignProject | null>;
  deleteProject(id: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private projects: Map<string, DesignProject> = new Map();

  async createProject(data: CreateProjectInput & { originalImageUrl: string }): Promise<DesignProject> {
    const project: DesignProject = {
      id: Math.random().toString(36).substring(2, 15),
      ...data,
      status: "uploading",
      createdAt: new Date(),
    };

    this.projects.set(project.id, project);
    return project;
  }

  async getProject(id: string): Promise<DesignProject | null> {
    return this.projects.get(id) || null;
  }

  async getAllProjects(): Promise<DesignProject[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateProject(data: UpdateProjectInput): Promise<DesignProject | null> {
    const existing = this.projects.get(data.id);
    if (!existing) return null;

    const updated: DesignProject = {
      ...existing,
      ...data,
    };

    this.projects.set(data.id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}