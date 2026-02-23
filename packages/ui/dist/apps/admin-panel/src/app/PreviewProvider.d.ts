import React from 'react';
interface PreviewContextType {
    previewMode: boolean;
    setPreviewMode: (on: boolean) => void;
}
export declare function PreviewProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function usePreview(): PreviewContextType;
export {};
