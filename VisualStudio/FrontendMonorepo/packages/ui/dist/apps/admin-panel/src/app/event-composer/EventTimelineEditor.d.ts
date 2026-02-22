import React from 'react';
export type EventPhase = {
    id: string;
    name: string;
    start: string;
    end: string;
    rewards: string[];
    milestones: string[];
    bossHP?: number;
    scaling?: string;
    shopBundles?: string[];
    banners?: string[];
    difficulty?: string;
};
interface EventTimelineEditorProps {
    phases: EventPhase[];
    setPhases: React.Dispatch<React.SetStateAction<EventPhase[]>>;
}
export default function EventTimelineEditor({ phases, setPhases }: EventTimelineEditorProps): import("react/jsx-runtime").JSX.Element;
export {};
