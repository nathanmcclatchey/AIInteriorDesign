"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemStorage = void 0;
// In-memory storage implementation
class MemStorage {
    constructor() {
        this.projects = new Map();
    }
    async createProject(data) {
        const project = {
            id: Math.random().toString(36).substring(2, 15),
            ...data,
            status: "uploading",
            createdAt: new Date(),
        };
        this.projects.set(project.id, project);
        return project;
    }
    async getProject(id) {
        return this.projects.get(id) || null;
    }
    async getAllProjects() {
        return Array.from(this.projects.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async updateProject(data) {
        const existing = this.projects.get(data.id);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...data,
        };
        this.projects.set(data.id, updated);
        return updated;
    }
    async deleteProject(id) {
        return this.projects.delete(id);
    }
}
exports.MemStorage = MemStorage;
