import { useState, useEffect } from 'react'
import lunr from 'lunr'
import type { SearchResult } from '../types'
import { DOCUMENTS } from '../documents'
import { ResultList } from '../ResultList'
import { Code } from '../Code'

export function SimilaritySlide() {
    const [query, setQuery] = useState('javascript')
    // controls document length normalization
    const [b, setB] = useState(0.75)
    // controls term frequency importance
    const [k1, setK1] = useState(1.2)
    const [results, setResults] = useState<SearchResult[]>([])

    function buildAndSearch(q: string, bVal: number, k1Val: number) {
        if (!q.trim()) { setResults([]); return }
        try {
            const idx = lunr(function () {
                this.ref('id')
                this.field('title')
                this.field('body')
                // Controls how much document length affects ranking.
                // b = 0: ignore length
                // b = 1: long documents penalized
                this.b(bVal)
                // low: term repetition doesn’t help much
                // high: repetition boosts ranking more
                this.k1(k1Val)
                DOCUMENTS.forEach(doc => this.add(doc))
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
                <ResultList results={results} docs={DOCUMENTS} />
            </div>
        </div>
    )
}