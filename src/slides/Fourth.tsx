import { useState, useMemo } from 'react'
import lunr from 'lunr'
import { DOCUMENTS } from '../documents'
import { safeRegister } from '../utils'
import { Code } from '../Code'

// Pipeline function to add the token length to the metadata.
const tokenLengthFn: lunr.PipelineFunction = (token) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Add the token length to the metadata.
    ; (token as any).metadata['tokenLength'] = token.toString().length
    return token
}

export function TokenMetadataSlide() {
    const [query, setQuery] = useState('')
    const [meta, setMeta] = useState<Record<string, unknown> | null>(null)

    safeRegister(tokenLengthFn, 'tokenLength')

    const idx = useMemo(() => lunr(function () {
        this.ref('id')
        this.field('title')
        this.field('body')
        // Keep tokenLength in the search results metadata
        this.metadataWhitelist = ['tokenLength']
        // Inserts into the indexing pipeline
        this.pipeline.after(lunr.stemmer, tokenLengthFn)
        DOCUMENTS.forEach(doc => this.add(doc))
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