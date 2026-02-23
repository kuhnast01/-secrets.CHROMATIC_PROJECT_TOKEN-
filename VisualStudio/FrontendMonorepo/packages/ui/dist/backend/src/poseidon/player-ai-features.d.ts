export declare class Generative3DAssetFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        prompt: string;
        type: string;
    }, userId: string, context?: any): Promise<{
        asset: any;
        error?: undefined;
        details?: undefined;
    } | {
        error: string;
        details: string;
        asset?: undefined;
    }>;
}
export declare class MultiAgentOrchestrationFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        agents: string[];
        task: string;
    }, userId: string, context?: any): Promise<{
        orchestration: string;
    }>;
}
export declare class CustomAnalyticsFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        query: string;
    }, userId: string, context?: any): Promise<{
        analytics: string;
    }>;
}
export declare class AIFeedbackFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        featureId: string;
        feedback: string;
    }, userId: string, context?: any): Promise<{
        received: boolean;
        featureId: string;
        feedback: string;
    }>;
}
export declare class AIExplainabilityFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        featureId: string;
        question: string;
    }, userId: string, context?: any): Promise<{
        explanation: string;
    }>;
}
export declare class AIPluginFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        pluginName: string;
        args: any;
    }, userId: string, context?: any): Promise<{
        plugin: string;
        result: string;
    }>;
}
export declare class AIEthicsFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        action: string;
    }, userId: string, context?: any): Promise<{
        action: string;
        status: string;
    }>;
}
export declare class AIResourceAwarenessFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        task: string;
    }, userId: string, context?: any): Promise<{
        task: string;
        resources: string;
    }>;
}
export declare class AICollaborationFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        agents: string[];
    }, userId: string, context?: any): Promise<{
        agents: string[];
        status: string;
    }>;
}
export interface PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: any, userId: string, context?: any): Promise<any>;
}
export declare class PlayerAIFeatureRegistry {
    private features;
    register(feature: PlayerAIFeature): void;
    getFeature(id: string): PlayerAIFeature | undefined;
    listFeatures(): PlayerAIFeature[];
}
export declare class NPCDialogueFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        prompt: string;
    }, userId: string, context?: any): Promise<{
        reply: any;
    }>;
}
export declare class PersonalizedTutorialFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        progress: string;
    }, userId: string, context?: any): Promise<{
        tutorial: string;
    }>;
}
export declare class QuestLoreFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        theme: string;
    }, userId: string, context?: any): Promise<{
        quest: string;
    }>;
}
export declare class AccessibilityFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        text: string;
    }, userId: string, context?: any): Promise<{
        tts: string;
        stt: string;
    }>;
}
export declare class DynamicDifficultyFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        stats: any;
    }, userId: string, context?: any): Promise<{
        recommendation: string;
    }>;
}
export declare class ModerationFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        message: string;
    }, userId: string, context?: any): Promise<{
        moderation: any;
    }>;
}
export declare class VoiceSynthesisFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        text: string;
    }, userId: string, context?: any): Promise<{
        audio: any;
    }>;
}
export declare class InGameAssistantFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        question: string;
    }, userId: string, context?: any): Promise<{
        answer: string;
    }>;
}
export declare class ProceduralContentFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        type: string;
    }, userId: string, context?: any): Promise<{
        content: string;
    }>;
}
export declare class RealTimeTranslationFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        text: string;
        targetLang: string;
    }, userId: string, context?: any): Promise<{
        translation: any;
    }>;
}
export declare class DeepPlayerModelingFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        history: any;
    }, userId: string, context?: any): Promise<{
        model: string;
    }>;
}
export declare class AICoopRivalFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        action: string;
    }, userId: string, context?: any): Promise<{
        aiPartner: string;
    }>;
}
export declare class EmotionalAIFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        mood: string;
    }, userId: string, context?: any): Promise<{
        response: string;
    }>;
}
export declare class ExplainableAIFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        question: string;
    }, userId: string, context?: any): Promise<{
        explanation: string;
    }>;
}
export declare class CommunityDrivenAIFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        feedback: string;
    }, userId: string, context?: any): Promise<{
        result: string;
    }>;
}
export declare class LiveOpsAIFeature implements PlayerAIFeature {
    id: string;
    description: string;
    isEnabledForUser(userId: string, context?: any): boolean;
    run(input: {
        event: string;
    }, userId: string, context?: any): Promise<{
        liveops: string;
    }>;
}
export declare const playerAIFeatureRegistry: PlayerAIFeatureRegistry;
