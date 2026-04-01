import { useState } from 'react'
import lunr from 'lunr'
import type { SearchResult } from '../types'
import { DOCUMENTS } from '../documents'
import { ResultList } from '../ResultList'
import { Code } from '../Code'

export function PrebuildingSlide() {
    // serialized index as JSON
    const [serialized, setSerialized] = useState('')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    // build time
    const [buildMs, setBuildMs] = useState<number | null>(null)
    // load time
    const [loadMs, setLoadMs] = useState<number | null>(null)

    // build and serialise the index
    function buildAndSerialise() {
        const t0 = performance.now()
        const idx = lunr(function () {
            this.ref('id')
            this.field('title', { boost: 10 })
            this.field('body')
            DOCUMENTS.forEach(doc => this.add(doc))
        })
        setBuildMs(+(performance.now() - t0).toFixed(2))
        // serialized index, ready to be loaded in the browser, it helps to cache, send over network and store as file.
        setSerialized(JSON.stringify(idx))
        setResults([])
        setQuery('')
        setLoadMs(null)
    }

    function search(q: string) {
        setQuery(q)
        if (!serialized || !q.trim()) { setResults([]); return }
        try {
            const t0 = performance.now()
            // reconstruct the index from the serialized JSON
            const idx = lunr.Index.load(JSON.parse(serialized))
            setLoadMs(+(performance.now() - t0).toFixed(2))
            setResults(idx.search(q))
        } catch { setResults([]) }
    }

    return (
        <div className="slide slide--split">
            <div className="split-left">
                <h2 className="slide-h2">Pre-building Indexes</h2>
                <p>Build the index at deploy time, ship it as JSON. Clients load it instantly — no indexing cost in the browser.</p>
                <Code code={`
  // ── BUILD STEP (Node.js / CI) ──────────────────
  const lunr = require('lunr')
  const fs   = require('fs')
  
  const idx = lunr(function () {
    this.ref('id')
    this.field('title', { boost: 10 })
    this.field('body')
    docs.forEach(doc => this.add(doc), this)
  })
  
  fs.writeFileSync(
    'public/search-index.json',
    JSON.stringify(idx)
  )
  
  // ── BROWSER ────────────────────────────────────
  fetch('/search-index.json')
    .then(r => r.json())
    .then(data => {
      const idx = lunr.Index.load(data)
      const results = idx.search('query')
    })
          `} />
            </div>
            <div className="split-right">
                <h3 className="demo-title">Live Demo — Serialise & Load</h3>
                <button className="btn-primary" onClick={buildAndSerialise}>
                    Step 1 — Build &amp; Serialise Index
                </button>
                {buildMs !== null && (
                    <p className="hint">
                        Built in <strong>{buildMs}ms</strong> &nbsp;·&nbsp;
                        <strong>{(serialized.length / 1024).toFixed(1)} KB</strong> serialised
                    </p>
                )}
                {serialized && (
                    <>
                        <div className="serial-preview">
                            <p className="hint">Serialised JSON (first 200 chars):</p>
                            <pre className="meta-pre">{serialized.slice(0, 200)}…</pre>
                        </div>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Step 2 — Search the loaded index..."
                            value={query}
                            onChange={e => search(e.target.value)}
                        />
                        {loadMs !== null && (
                            <p className="hint">lunr.Index.load() took <strong>{loadMs}ms</strong></p>
                        )}
                        <ResultList results={results} docs={DOCUMENTS} />
                    </>
                )}
            </div>
        </div>
    )
}