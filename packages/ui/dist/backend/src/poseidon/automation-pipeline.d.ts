export type AutomationTaskType = 'lint-fix' | 'dependency-bump' | 'schema-update' | 'content-validation' | 'liveops-publish' | 'error-triage' | 'regression-detect';
export interface AutomationTask {
    type: AutomationTaskType;
    payload: any;
    triggeredBy: 'cron' | 'event' | 'commit';
    safeMode: boolean;
}
export declare class AutomationPipeline {
    runTask(task: AutomationTask): Promise<{
        prPrepared?: boolean;
        summary: string;
    }>;
    static shouldTrigger(taskType: AutomationTaskType, event: string): boolean;
}
