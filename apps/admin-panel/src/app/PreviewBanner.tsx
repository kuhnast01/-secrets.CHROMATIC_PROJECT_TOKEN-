"use client";
import React from 'react';
import { usePreview } from './PreviewProvider';

export default function PreviewBanner() {
  const { previewMode } = usePreview();
  if (!previewMode) return null;
  return (
    <div style={{ background: '#ff0', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>
      PREVIEW MODE: Changes are not live. This is a sandbox simulation.
    </div>
  );
}
