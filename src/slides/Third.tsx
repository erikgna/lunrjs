import { useState } from 'react'
import lunr from 'lunr'
import type { SearchResult } from '../types'
import { DOCUMENTS_GREY } from '../documents'
import { ResultList } from '../ResultList'
import { safeRegister } from '../utils'
import { Code } from '../Code'

// Pipeline function to replace 'gray' with 'grey'.
const normFn: lunr.PipelineFunction = (token) =>
    token.update(str => str.replace(/gray/gi, 'grey'))

export function PipelineSlide() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [pipelineOn, setPipelineOn] = useState(false)

    // Register the pipeline function.
    safeRegister(normFn, 'normaliseSpelling')

    function buildIndex(withPipeline: boolean) {
        // Build the index.
        return lunr(function () {
            this.ref('id')
            this.field('title')
            this.field('body')
            if (withPipeline) {
                // Add before the stemmer in the indexing pipeline
                this.pipeline.before(lunr.stemmer, normFn)
                // Same transformation applied during search queries 
                this.searchPipeline.before(lunr.stemmer, normFn)
            }
            DOCUMENTS_GREY.forEach(doc => this.add(doc))
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
                <ResultList results={results} docs={DOCUMENTS_GREY} />
            </div>
        </div>
    )
}