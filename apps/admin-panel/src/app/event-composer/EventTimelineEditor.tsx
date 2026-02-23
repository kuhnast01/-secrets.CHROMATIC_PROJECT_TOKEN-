import { useEffect } from 'react';
function Spinner() {
  return <div className={styles.spinner} role="status" aria-label="Loading" />;
}

function SkeletonPhase() {
  return (
    <div className={styles.skeletonPhase} aria-hidden="true">
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonButtonRow} />
    </div>
  );
}
// eslint-disable-next-line no-inline-styles
// Inline styles for transform/transition are required for dnd-kit drag-and-drop animation.
// This is an accepted exception to the no-inline-style rule for accessibility and animation.
"use client";
import React, { useState } from 'react';
import styles from './EventTimelineEditor.module.css';
// For a real implementation, install and import dnd-kit or React DnD
// import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// NOTE: For a real implementation, install dnd-kit and react-hook-form + zod
// import { DndContext, useDraggable, useDroppable, closestCenter, arrayMove } from '@dnd-kit/core';
// import { useForm } from 'react-hook-form';

// dnd-kit imports (install with: pnpm add @dnd-kit/core @dnd-kit/sortable)
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

import React, { useState, useCallback, memo } from 'react';

const PhaseForm = memo(function PhaseForm({ phase, onChange }: { phase: EventPhase; onChange: (p: EventPhase) => void }) {
  // Placeholder: Replace with react-hook-form for real validation
  function update<K extends keyof EventPhase>(key: K, value: EventPhase[K]) {
    onChange({ ...phase, [key]: value });
  }
  // Modal state for shop bundles and banners
  const [showShopModal, setShowShopModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  // Example options (replace with real data)
  const shopOptions = ['Starter Pack', 'Mega Bundle', 'VIP Pass', 'Holiday Special'];
  const bannerOptions = ['Spring Banner', 'Summer Banner', 'Legendary Hunt', 'Raid Spotlight'];
  const difficultyOptions = ['Easy', 'Normal', 'Hard', 'Legendary'];
  return (
    <form className={styles.phaseForm} aria-label="Edit Phase" role="form">
      <div>
        <label htmlFor="phase-name">Name:</label>
        <input id="phase-name" value={phase.name} onChange={e => { update('name', e.target.value); }} aria-required="true" />
      </div>
      <div>
        <label htmlFor="phase-start">Start:</label>
        <input id="phase-start" value={phase.start} onChange={e => { update('start', e.target.value); }} aria-required="true" />
      </div>
      <div>
        <label htmlFor="phase-end">End:</label>
        <input id="phase-end" value={phase.end} onChange={e => { update('end', e.target.value); }} aria-required="true" />
      </div>
      <div>
        <label htmlFor="phase-rewards">Rewards:</label>
        <textarea id="phase-rewards" rows={2} value={phase.rewards.join('\n')} onChange={e => { update('rewards', e.target.value.split('\n')); }} placeholder="One reward per line" />
      </div>
      <div>
        <label htmlFor="phase-milestones">Milestones:</label>
        <textarea id="phase-milestones" rows={2} value={phase.milestones.join('\n')} onChange={e => { update('milestones', e.target.value.split('\n')); }} placeholder="One milestone per line" />
      </div>
      <div>
        <label htmlFor="phase-bossHP">Boss HP:</label>
        <input id="phase-bossHP" type="range" min={1000} max={1000000} step={1000} value={phase.bossHP || 10000} onChange={e => { update('bossHP', Number(e.target.value)); }} />
        <span className={styles.bossHpLabel}>{phase.bossHP || 10000}</span>
      </div>
      <div>
        <label htmlFor="phase-scaling">Scaling:</label>
        <input id="phase-scaling" value={phase.scaling || ''} onChange={e => { update('scaling', e.target.value); }} />
      </div>
      <div>
        <label>Shop Bundles:</label>
        <button type="button" onClick={() => { setShowShopModal(true); }} className={styles.editButton}>Select Bundles</button>
        <div className={styles.bundleDisplay}>{phase.shopBundles?.join(', ') || 'None selected'}</div>
        {showShopModal && (
          <div className={styles.shopModal}>
            <h3>Select Shop Bundles</h3>
            {shopOptions.map(opt => (
              <div key={opt}>
                <input type="checkbox" checked={phase.shopBundles?.includes(opt)} onChange={() => {
                  const next = phase.shopBundles?.includes(opt)
                    ? phase.shopBundles?.filter(b => b !== opt)
                    : [...(phase.shopBundles || []), opt];
                  update('shopBundles', next);
                }} id={`shop-${opt}`} />
                <label htmlFor={`shop-${opt}`}>{opt}</label>
              </div>
            ))}
            <button type="button" onClick={() => { setShowShopModal(false); }} className={styles.shopModalDone}>Done</button>
          </div>
        )}
      </div>
      <div>
        <label>Banners:</label>
        <button type="button" onClick={() => { setShowBannerModal(true); }} className={styles.editButton}>Select Banners</button>
        <div className={styles.bundleDisplay}>{phase.banners?.join(', ') || 'None selected'}</div>
        {showBannerModal && (
          <div className={styles.bannerModal}>
            <h3>Select Banners</h3>
            {bannerOptions.map(opt => (
              <div key={opt}>
                <input type="checkbox" checked={phase.banners?.includes(opt)} onChange={() => {
                  const next = phase.banners?.includes(opt)
                    ? phase.banners?.filter(b => b !== opt)
                    : [...(phase.banners || []), opt];
                  update('banners', next);
                }} id={`banner-${opt}`} />
                <label htmlFor={`banner-${opt}`}>{opt}</label>
              </div>
            ))}
            <button type="button" onClick={() => { setShowBannerModal(false); }} className={styles.bannerModalDone}>Done</button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="phase-difficulty">Difficulty:</label>
        <select id="phase-difficulty" value={phase.difficulty || ''} onChange={e => { update('difficulty', e.target.value); }}>
          <option value="">Select difficulty</option>
          {difficultyOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </form>
  );
});

interface DraggablePhaseProps {
  phase: EventPhase;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  id: string;
}

const DraggablePhase = memo(function DraggablePhase({ phase, onEdit, onRemove, id }: DraggablePhaseProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  // Only transform and transition are allowed as inline styles for DnD animation
  // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-new-object-as-prop
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  /*
   * Inline styles for transform/transition are required for dnd-kit drag-and-drop animation.
   * This is an accepted exception to the no-inline-style rule for accessibility and animation.
   * eslint-disable-next-line react/style-prop-object, no-inline-styles, @typescript-eslint/no-unsafe-assignment
   */
  // eslint-disable-next-line react/style-prop-object, no-inline-styles, @typescript-eslint/no-unsafe-assignment
  // eslint-disable-next-line react/style-prop-object, react/no-inline-styles
  return (
    <div
      ref={setNodeRef}
      style={style} // transform/transition required for dnd-kit animation
      className={styles.draggablePhase}
      {...attributes}
      {...listeners}
      tabIndex={0}
      aria-label={`Phase ${phase.name}`}
      onKeyDown={event => {
        if (event.key === 'Enter') onEdit(phase.id);
        if (event.key === 'Delete') onRemove(phase.id);
      }}
    >
      <strong>{phase.name}</strong> ({phase.start} → {phase.end})
      <button onClick={() => { onEdit(phase.id); }} className={styles.editButton} aria-label={`Edit ${phase.name}`}>Edit</button>
      <button onClick={() => { onRemove(phase.id); }} className={styles.removeButton} aria-label={`Remove ${phase.name}`}>Remove</button>
    </div>
  );
});

interface EventTimelineEditorProps {
  phases: EventPhase[];
  setPhases: React.Dispatch<React.SetStateAction<EventPhase[]>>;
}

export default function EventTimelineEditor({ phases, setPhases }: EventTimelineEditorProps) {
  const [newPhase, setNewPhase] = useState({ name: '', start: '', end: '', rewards: [], milestones: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  function addPhase() {
    setPhases([...phases, { ...newPhase, id: Date.now().toString() }]);
    setNewPhase({ name: '', start: '', end: '', rewards: [], milestones: [] });
  }

  function removePhase(id: string) {
    setPhases(phases.filter(p => p.id !== id));
  }

  function editPhase(id: string) {
    setEditingId(id);
  }

  function updatePhase(updated: EventPhase) {
    setPhases(phases.map(p => (p.id === updated.id ? updated : p)));
    setEditingId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = phases.findIndex(p => p.id === active.id);
      const newIndex = phases.findIndex(p => p.id === over.id);
      setPhases(arrayMove(phases, oldIndex, newIndex));
    }
  }

  return (
    <section aria-label="Event Timeline" className={styles.timelineSection}>
      <h2 tabIndex={0}>Event Timeline</h2>
      <div aria-live="polite" aria-atomic="true" className={styles.visuallyHidden}>
        {loading ? 'Loading event timeline…' : 'Event timeline loaded.'}
      </div>
      {loading ? (
        <>
          <Spinner />
          <div className={styles.skeletonList}>
            {[...Array(2)].map((_, i) => <SkeletonPhase key={i} />)}
          </div>
        </>
      ) : (
        <>
          <form className={styles.addPhaseForm} aria-label="Add Phase" onSubmit={event => { event.preventDefault(); addPhase(); }}>
            <label htmlFor="new-phase-name">Phase name:</label>
            <input
              id="new-phase-name"
              placeholder="Phase name"
              value={newPhase.name}
              onChange={e => { setNewPhase({ ...newPhase, name: e.target.value }); }}
              aria-required="true"
            />
            <label htmlFor="new-phase-start">Start:</label>
            <input
              id="new-phase-start"
              placeholder="Start"
              value={newPhase.start}
              onChange={e => { setNewPhase({ ...newPhase, start: e.target.value }); }}
              aria-required="true"
            />
            <label htmlFor="new-phase-end">End:</label>
            <input
              id="new-phase-end"
              placeholder="End"
              value={newPhase.end}
              onChange={e => { setNewPhase({ ...newPhase, end: e.target.value }); }}
              aria-required="true"
            />
            <button type="submit" disabled={!newPhase.name || !newPhase.start || !newPhase.end} aria-label="Add Phase">
              Add Phase
            </button>
          </form>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={phases.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div aria-label="Phases">
                {phases.length === 0 ? (
                  <div className={styles.emptyState}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <rect x="8" y="20" width="48" height="32" rx="6" fill="#e6f7ff" />
                      <rect x="16" y="28" width="32" height="8" rx="2" fill="#cce3fa" />
                      <rect x="16" y="40" width="20" height="4" rx="2" fill="#cce3fa" />
                    </svg>
                    <div>No phases yet. Add your first phase above!</div>
                  </div>
                ) : (
                  phases.map(phase => (
                    editingId === phase.id ? (
                      <PhaseForm key={phase.id} phase={phase} onChange={updatePhase} />
                    ) : (
                      <DraggablePhase
                        key={phase.id}
                        phase={phase}
                        id={phase.id}
                        onEdit={editPhase}
                        onRemove={removePhase}
                      />
                    )
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
          <h3>Event Config Preview</h3>
          <pre className={styles.previewPre}>{JSON.stringify(phases, null, 2)}</pre>
        </>
      )}
    </section>
  );
}
