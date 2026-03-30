import { useState, useMemo, useEffect } from 'react'
import lunr from 'lunr'
import './App.css'

// ── Sample Data ───────────────────────────────────────────────────────────────

const DOCS = [
  { id: 'lunr',       title: 'Lunr.js',    cat: 'search',   body: 'Full-text search for the browser with no external dependencies. Similar to Solr but much smaller and not as bright.' },
  { id: 'fuse',       title: 'Fuse.js',    cat: 'search',   body: 'Lightweight fuzzy-search library in JavaScript with no external dependencies. Searches arrays of strings or objects.' },
  { id: 'react',      title: 'React',      cat: 'ui',       body: 'A JavaScript library for building user interfaces. Declarative, component-based, and learn once write anywhere.' },
  { id: 'vue',        title: 'Vue.js',     cat: 'ui',       body: 'The progressive JavaScript framework for building user interfaces. An incrementally adoptable ecosystem.' },
  { id: 'vite',       title: 'Vite',       cat: 'tooling',  body: 'Next generation frontend tooling. Instant server start, lightning fast hot module replacement, and optimised builds.' },
  { id: 'webpack',    title: 'Webpack',    cat: 'tooling',  body: 'A static module bundler for modern JavaScript applications that builds a dependency graph and bundles modules.' },
  { id: 'typescript', title: 'TypeScript', cat: 'language', body: 'TypeScript is JavaScript with syntax for types. A strongly typed programming language that builds on JavaScript.' },
  { id: 'nodejs',     title: 'Node.js',    cat: 'runtime',  body: 'An open-source, cross-platform JavaScript runtime environment. Execute JavaScript server-side outside a browser.' },
  { id: 'graphql',    title: 'GraphQL',    cat: 'api',      body: 'A query language for APIs. Gives clients the power to ask for exactly what they need, nothing more, nothing less.' },
  { id: 'redux',      title: 'Redux',      cat: 'state',    body: 'A predictable state container for JavaScript apps. Write applications that behave consistently across environments.' },
]

// docs that include "grey" (for the pipeline demo)
const DOCS_GREY = [
  ...DOCS,
  { id: 'colour', title: 'Colour Theory', cat: 'design', body: 'Grey is a neutral colour between black and white. Frequently used in UI design for backgrounds and borders.' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const registered = new Set<string>()
function safeRegister(fn: lunr.PipelineFunction, name: string) {
  if (!registered.has(name)) {
    lunr.Pipeline.registerFunction(fn, name)
    registered.add(name)
  }
}

type SearchResult = { ref: string; score: number }
type DocLike = { id: string; title: string }

function Code({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code>{code.trim()}</code>
    </pre>
  )
}

function Tag({ children }: { children: string }) {
  return <span className="tag">{children}</span>
}

function ResultList({ results, docs }: { results: SearchResult[]; docs: DocLike[] }) {
  if (results.length === 0) return <p className="no-results">No results</p>
  return (
    <ul className="result-list">
      {results.map(r => {
        const doc = docs.find(d => d.id === r.ref)
        return (
          <li key={r.ref} className="result-item">
            <span className="result-title">{doc?.title ?? r.ref}</span>
            <span className="result-score">{r.score.toFixed(4)}</span>
          </li>
        )
      })}
    </ul>
  )
}

// ── Slides ────────────────────────────────────────────────────────────────────

function TitleSlide() {
  return (
    <div className="slide slide--center">
      <div className="title-badge">Full-Text Search</div>
      <h1 className="slide-h1">LunrJS</h1>
      <p className="slide-subtitle">Client-side search. No server. No dependencies.</p>
      <div className="pill-row">
        <span className="pill">Getting Started</span>
        <span className="pill">Customisation</span>
        <span className="pill">Pre-building Indexes</span>
      </div>
    </div>
  )
}

function WhatIsSlide() {
  return (
    <div className="slide slide--center">
      <h2 className="slide-h2">What is Lunr?</h2>
      <p className="slide-lead">A small, full-text search library for use in the browser and Node.js.</p>
      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <strong>No Server Required</strong>
          <p>Index and search entirely client-side in the browser or Node.js runtime.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <strong>No Dependencies</strong>
          <p>Ships as a single file. Zero runtime dependencies.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <strong>Relevance Scoring</strong>
          <p>BM25-based ranking with field boosting out of the box.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <strong>Extensible Pipeline</strong>
          <p>Custom stemmers, tokenisers, and pipeline functions via plugins.</p>
        </div>
      </div>
    </div>
  )
}

function GettingStartedSlide() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  const idx = useMemo(() => lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')
    DOCS.forEach(doc => this.add(doc))
  }), [])

  function search(q: string) {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    try { setResults(idx.search(q)) } catch { setResults([]) }
  }

  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Getting Started</h2>
        <p>Install via npm, define your index, add documents, search.</p>
        <Code code={`
npm install lunr

var idx = lunr(function () {
  this.ref('id')       // unique identifier field
  this.field('title')  // fields to index
  this.field('body')

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})

idx.search('javascript')
// → [{ ref: 'react', score: 0.966, matchData: ... }]
        `} />
      </div>
      <div className="split-right">
        <h3 className="demo-title">Live Demo</h3>
        <p className="hint">Search across 10 documents (id, title, body fields).</p>
        <input
          className="search-input"
          type="text"
          placeholder="Try: javascript, search, framework..."
          value={query}
          onChange={e => search(e.target.value)}
        />
        <ResultList results={results} docs={DOCS} />
      </div>
    </div>
  )
}

function FieldBoostSlide() {
  const [query, setQuery] = useState('')
  const [boosted, setBoosted] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  function buildIndex(withBoost: boolean) {
    return lunr(function () {
      this.ref('id')
      this.field('title', withBoost ? { boost: 10 } : undefined)
      this.field('body')
      DOCS.forEach(doc => this.add(doc))
    })
  }

  function search(q: string, boost: boolean) {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    try { setResults(buildIndex(boost).search(q)) } catch { setResults([]) }
  }

  function toggle() {
    const next = !boosted
    setBoosted(next)
    if (query.trim()) search(query, next)
  }

  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Field Boosting</h2>
        <p>Weight certain fields higher during indexing. Matches in boosted fields produce higher scores.</p>
        <Code code={`
var idx = lunr(function () {
  this.ref('id')

  // title matches are 10× more important
  this.field('title', { boost: 10 })
  this.field('body')

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})
        `} />
        <p className="hint">
          Try <code>javascript</code> — with boost on, documents whose
          <em> title</em> matches will rank above body-only matches.
        </p>
      </div>
      <div className="split-right">
        <h3 className="demo-title">Live Demo — Field Boost</h3>
        <label className="toggle-label">
          <input type="checkbox" checked={boosted} onChange={toggle} />
          <span>Enable <code>title</code> boost (×10)</span>
        </label>
        <input
          className="search-input"
          type="text"
          placeholder="Try: javascript, search, ui..."
          value={query}
          onChange={e => search(e.target.value, boosted)}
        />
        <ResultList results={results} docs={DOCS} />
      </div>
    </div>
  )
}

function PluginsSlide() {
  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Plugins</h2>
        <p>A plugin is a function executed in the context of the index builder. Apply with <code>this.use(plugin)</code>.</p>
        <Code code={`
var articleFields = function (builder) {
  builder.field('title', { boost: 10 })
  builder.field('body')
}

var idx = lunr(function () {
  this.use(articleFields)
  this.ref('id')

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})
        `} />
      </div>
      <div className="split-right">
        <h2 className="slide-h2">Parameterised Plugins</h2>
        <p>Arguments passed to <code>this.use()</code> after the plugin name are forwarded to the plugin function.</p>
        <Code code={`
var paramPlugin = function (builder, fields) {
  fields.forEach(function (field) {
    builder.field(field)
  })
}

var idx = lunr(function () {
  this.use(
    paramPlugin,
    ['title', 'body', 'category']
  )
  this.ref('id')

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})
        `} />
        <p className="hint">
          The plugin receives <code>builder</code> as its first argument. Additional
          arguments come from the <code>this.use()</code> call.
        </p>
      </div>
    </div>
  )
}

const normFn: lunr.PipelineFunction = (token) =>
  token.update(str => str.replace(/gray/gi, 'grey'))

function PipelineSlide() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [pipelineOn, setPipelineOn] = useState(false)

  safeRegister(normFn, 'normaliseSpelling')

  function buildIndex(withPipeline: boolean) {
    return lunr(function () {
      this.ref('id')
      this.field('title')
      this.field('body')
      if (withPipeline) {
        this.pipeline.before(lunr.stemmer, normFn)
        this.searchPipeline.before(lunr.stemmer, normFn)
      }
      DOCS_GREY.forEach(doc => this.add(doc))
    })
  }

  function search(q: string, on: boolean) {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    try { setResults(buildIndex(on).search(q)) } catch { setResults([]) }
  }

  function toggle() {
    const next = !pipelineOn
    setPipelineOn(next)
    if (query.trim()) search(query, next)
  }

  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Pipeline Functions</h2>
        <p>Hook into the indexing and search pipeline to transform tokens before they are stored or matched.</p>
        <Code code={`
var normaliseSpelling = function (builder) {
  var fn = function (token) {
    return token.update(function (str) {
      return str.replace(/gray/gi, 'grey')
    })
  }

  // Must register for index serialisation
  lunr.Pipeline.registerFunction(fn, 'normalise')

  // Add to both pipelines
  builder.pipeline.before(lunr.stemmer, fn)
  builder.searchPipeline.before(lunr.stemmer, fn)
}

var idx = lunr(function () {
  this.use(normaliseSpelling)
})
        `} />
        <p className="hint">
          Pipelines run at index time <em>and</em> at search time. Register
          functions by name so the index can be serialised and loaded correctly.
        </p>
      </div>
      <div className="split-right">
        <h3 className="demo-title">Live Demo — Spelling Normalisation</h3>
        <p className="hint">
          The corpus contains a document with the word <strong>grey</strong>.
          Search <code>gray</code> — it only matches when the pipeline is active.
        </p>
        <label className="toggle-label">
          <input type="checkbox" checked={pipelineOn} onChange={toggle} />
          <span>Enable gray → grey normalisation</span>
        </label>
        <input
          className="search-input"
          type="text"
          placeholder="Try: gray, grey..."
          value={query}
          onChange={e => search(e.target.value, pipelineOn)}
        />
        <ResultList results={results} docs={DOCS_GREY} />
      </div>
    </div>
  )
}

const tokenLengthFn: lunr.PipelineFunction = (token) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(token as any).metadata['tokenLength'] = token.toString().length
  return token
}

function TokenMetadataSlide() {
  const [query, setQuery] = useState('')
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null)

  safeRegister(tokenLengthFn, 'tokenLength')

  const idx = useMemo(() => lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')
    this.metadataWhitelist = ['tokenLength']
    this.pipeline.before(lunr.stemmer, tokenLengthFn)
    DOCS.forEach(doc => this.add(doc))
  }), [])

  function search(q: string) {
    setQuery(q)
    if (!q.trim()) { setMeta(null); return }
    try {
      const results = idx.search(q)
      setMeta(results.length > 0 ? results[0].matchData.metadata as Record<string, unknown> : null)
    } catch { setMeta(null) }
  }

  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Token Metadata</h2>
        <p>Pipeline functions can attach arbitrary metadata to tokens. Whitelisted keys are returned alongside search results.</p>
        <Code code={`
var tokenLengthMetadata = function (builder) {
  var fn = function (token) {
    token.metadata['tokenLength'] =
      token.toString().length
    return token
  }

  lunr.Pipeline.registerFunction(fn, 'tokenLength')
  builder.pipeline.before(lunr.stemmer, fn)

  // Whitelist so it appears in results
  builder.metadataWhitelist.push('tokenLength')
}

var idx = lunr(function () {
  this.use(tokenLengthMetadata)
  // ...
})

// results[0].matchData.metadata →
// { "javascript": { "body": { tokenLength: 10 } } }
        `} />
      </div>
      <div className="split-right">
        <h3 className="demo-title">Live Demo — Token Length Metadata</h3>
        <p className="hint">
          Each indexed token carries its character length. Inspect the
          <code>matchData</code> returned with the top result.
        </p>
        <input
          className="search-input"
          type="text"
          placeholder="Try: javascript, framework, runtime..."
          value={query}
          onChange={e => search(e.target.value)}
        />
        {meta && (
          <div className="metadata-box">
            <p className="hint">matchData.metadata (top result):</p>
            <pre className="meta-pre">{JSON.stringify(meta, null, 2)}</pre>
          </div>
        )}
        {!meta && query && <p className="no-results">No results</p>}
      </div>
    </div>
  )
}

function SimilaritySlide() {
  const [query, setQuery] = useState('javascript')
  const [b, setB] = useState(0.75)
  const [k1, setK1] = useState(1.2)
  const [results, setResults] = useState<SearchResult[]>([])

  function buildAndSearch(q: string, bVal: number, k1Val: number) {
    if (!q.trim()) { setResults([]); return }
    try {
      const idx = lunr(function () {
        this.ref('id')
        this.field('title')
        this.field('body')
        this.b(bVal)
        this.k1(k1Val)
        DOCS.forEach(doc => this.add(doc))
      })
      setResults(idx.search(q))
    } catch { setResults([]) }
  }

  useEffect(() => { buildAndSearch('javascript', 0.75, 1.2) }, []) // eslint-disable-line

  return (
    <div className="slide slide--split">
      <div className="split-left">
        <h2 className="slide-h2">Similarity Tuning</h2>
        <p>Lunr scores results with BM25. Two parameters let you tune the scoring algorithm for your corpus.</p>
        <div className="param-table">
          <div className="param-row">
            <code>b</code>
            <span>Field-length normalisation. <strong>0</strong> = ignore length, <strong>1</strong> = full normalisation. Default: <strong>0.75</strong>.</span>
          </div>
          <div className="param-row">
            <code>k1</code>
            <span>Term frequency saturation rate. Higher values slow saturation. Default: <strong>1.2</strong>.</span>
          </div>
        </div>
        <Code code={`
var idx = lunr(function () {
  this.ref('id')
  this.field('title')
  this.field('body')

  // b: 0 – 1, field-length normalisation
  this.b(0.75)

  // k1: ≥ 0, term frequency saturation
  this.k1(1.2)

  documents.forEach(function (doc) {
    this.add(doc)
  }, this)
})
        `} />
      </div>
      <div className="split-right">
        <h3 className="demo-title">Live Demo — Tune BM25</h3>
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); buildAndSearch(e.target.value, b, k1) }}
          placeholder="Search..."
        />
        <label className="slider-label">
          <span>b = {b.toFixed(2)}</span>
          <input
            type="range" min="0" max="1" step="0.05" value={b}
            onChange={e => { const v = +e.target.value; setB(v); buildAndSearch(query, v, k1) }}
          />
        </label>
        <label className="slider-label">
          <span>k1 = {k1.toFixed(2)}</span>
          <input
            type="range" min="0" max="3" step="0.1" value={k1}
            onChange={e => { const v = +e.target.value; setK1(v); buildAndSearch(query, b, v) }}
          />
        </label>
        <ResultList results={results} docs={DOCS} />
      </div>
    </div>
  )
}

function PrebuildingSlide() {
  const [serialized, setSerialized] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [buildMs, setBuildMs] = useState<number | null>(null)
  const [loadMs, setLoadMs] = useState<number | null>(null)

  function buildAndSerialise() {
    const t0 = performance.now()
    const idx = lunr(function () {
      this.ref('id')
      this.field('title', { boost: 10 })
      this.field('body')
      DOCS.forEach(doc => this.add(doc))
    })
    setBuildMs(+(performance.now() - t0).toFixed(2))
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
            <ResultList results={results} docs={DOCS} />
          </>
        )}
      </div>
    </div>
  )
}

function SummarySlide() {
  const items = [
    { tag: 'Getting Started', text: 'npm install lunr · define ref + fields · add docs · idx.search()' },
    { tag: 'Field Boost',     text: 'this.field("title", { boost: 10 }) — weight fields by importance' },
    { tag: 'Plugins',         text: 'Function in builder context · this.use(plugin, ...args)' },
    { tag: 'Pipeline',        text: 'Transform tokens at index + search time · pipeline.before(lunr.stemmer, fn)' },
    { tag: 'Token Metadata',  text: 'token.metadata["key"] = value · metadataWhitelist → returned in results' },
    { tag: 'BM25 Tuning',     text: 'this.b(0.75) — length norm · this.k1(1.2) — TF saturation rate' },
    { tag: 'Pre-building',    text: 'JSON.stringify(idx) → serve as file · lunr.Index.load(data) on client' },
  ]

  return (
    <div className="slide slide--center">
      <h2 className="slide-h2">Summary</h2>
      <div className="summary-grid">
        {items.map(it => (
          <div key={it.tag} className="summary-card">
            <Tag>{it.tag}</Tag>
            <p>{it.text}</p>
          </div>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 24 }}>
        <a href="https://lunrjs.com" target="_blank" rel="noreferrer">lunrjs.com</a>
        &nbsp;·&nbsp;
        <a href="https://github.com/olivernn/lunr.js" target="_blank" rel="noreferrer">github.com/olivernn/lunr.js</a>
      </p>
    </div>
  )
}

// ── Slide Registry ────────────────────────────────────────────────────────────

const SLIDES = [
  { id: 'title',      label: 'Intro',            Component: TitleSlide },
  { id: 'what',       label: 'What is Lunr?',    Component: WhatIsSlide },
  { id: 'start',      label: 'Getting Started',  Component: GettingStartedSlide },
  { id: 'boost',      label: 'Field Boost',      Component: FieldBoostSlide },
  { id: 'plugins',    label: 'Plugins',          Component: PluginsSlide },
  { id: 'pipeline',   label: 'Pipeline',         Component: PipelineSlide },
  { id: 'metadata',   label: 'Token Metadata',   Component: TokenMetadataSlide },
  { id: 'similarity', label: 'BM25 Tuning',      Component: SimilaritySlide },
  { id: 'prebuild',   label: 'Pre-building',     Component: PrebuildingSlide },
  { id: 'summary',    label: 'Summary',          Component: SummarySlide },
]

// ── App ───────────────────────────────────────────────────────────────────────

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
