import { useState, useEffect } from 'react'
import { GettingStartedSlide } from './slides/first'
import { SimilaritySlide } from './slides/Fifith'
import { TokenMetadataSlide } from './slides/Fourth'
import { FieldBoostSlide } from './slides/Second'
import { PrebuildingSlide } from './slides/Sixty'
import { PipelineSlide } from './slides/Third'

import './App.css'

const SLIDES = [
  { id: 'start', label: 'Getting Started', Component: GettingStartedSlide },
  { id: 'boost', label: 'Field Boost', Component: FieldBoostSlide },
  { id: 'pipeline', label: 'Pipeline', Component: PipelineSlide },
  { id: 'metadata', label: 'Token Metadata', Component: TokenMetadataSlide },
  { id: 'similarity', label: 'BM25 Tuning', Component: SimilaritySlide },
  { id: 'prebuild', label: 'Pre-building', Component: PrebuildingSlide },
]

export default function App() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrent(c => Math.min(c + 1, SLIDES.length - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrent(c => Math.max(c - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const { Component } = SLIDES[current]

  return (
    <div className="presentation">
      <header className="pres-header">
        <span className="pres-brand">LunrJS</span>
        <div className="pres-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              className={`dot${i === current ? ' dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              title={s.label}
            />
          ))}
        </div>
        <span className="pres-counter">{current + 1} / {SLIDES.length}</span>
      </header>

      <main className="pres-main">
        <Component />
      </main>

      <footer className="pres-footer">
        <button
          className="nav-btn"
          onClick={() => setCurrent(c => Math.max(c - 1, 0))}
          disabled={current === 0}
        >
          ← Prev
        </button>
        <span className="slide-label">{SLIDES[current].label}</span>
        <button
          className="nav-btn"
          onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))}
          disabled={current === SLIDES.length - 1}
        >
          Next →
        </button>
      </footer>
    </div>
  )
}
