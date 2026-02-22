"use client";
import React, { createContext, useContext, useState } from 'react';

interface PreviewContextType {
  previewMode: boolean;
  setPreviewMode: (on: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);


export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewMode, setPreviewMode] = useState(false);
  return (
    <PreviewContext.Provider value={{ previewMode, setPreviewMode }}>
      {previewMode && (
        <div style={{
          background: '#3182ce',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          zIndex: 1000,
          position: 'sticky',
          top: 0,
          letterSpacing: 1,
        }}>
          SAFE PREVIEW MODE: Changes are not live. Destructive actions are disabled.
        </div>
      )}
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error('usePreview must be used within PreviewProvider');
  return ctx;
}
