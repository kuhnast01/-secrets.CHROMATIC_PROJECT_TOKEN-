export type ProjectType = 'game' | 'app' | 'platform';
export interface ProjectScaffoldRequest {
    type: ProjectType;
    name: string;
    features: string[];
}
export declare class ProjectAccelerator {
    generateScaffold(request: ProjectScaffoldRequest): {
        files: string[];
        summary: string;
    };
    generateBlueprint(feature: string): {
        diagram: string;
        description: string;
    };
    generateArchitectureTemplate(type: ProjectType): {
        template: string;
    };
    crossProjectKnowledgeTransfer(prevProject: string, newProject: string): {
        summary: string;
    };
}
