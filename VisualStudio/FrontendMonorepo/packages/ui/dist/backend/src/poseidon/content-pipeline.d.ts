export type ContentType = 'commander' | 'ship' | 'mission' | 'reward' | 'shop' | 'event';
export interface ContentFile {
    type: ContentType;
    data: any;
}
export declare class ContentPipeline {
    validateSchema(file: ContentFile): {
        valid: boolean;
        errors: string[];
    };
    diffContent(oldFile: ContentFile, newFile: ContentFile): string;
    previewSeasonalChange(file: ContentFile, season: string): string;
}
