import { useState } from 'react'
import lunr from 'lunr'
import type { SearchResult } from '../types'
import { DOCUMENTS } from '../documents'
import { ResultList } from '../ResultList'
import { Code } from '../Code'

export function FieldBoostSlide() {
    const [query, setQuery] = useState('')
    const [boosted, setBoosted] = useState(false)
    const [results, setResults] = useState<SearchResult[]>([])

    function buildIndex(withBoost: boolean) {
        return lunr(function () {
            this.ref('id')
            // Set the weight of the title field to 10x more important than the body field.
            this.field('title', withBoost ? { boost: 10 } : undefined)
            this.field('body')
            DOCUMENTS.forEach(doc => this.add(doc))
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
                <ResultList results={results} docs={DOCUMENTS} />
            </div>
        </div>
    )
}