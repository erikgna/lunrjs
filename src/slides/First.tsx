import { useState, useMemo } from 'react'
import lunr from 'lunr'
import type { SearchResult } from '../types'
import { DOCUMENTS } from '../documents'
import { ResultList } from '../ResultList'

export function GettingStartedSlide() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    
    // Creates the Lunr search index.
    // Wrapped in useMemo so it runs only once (not on every render).
    const idx = useMemo(() => lunr(function () {
        // Set the document id field.
        this.ref('id')
        // Fields for lunr to search.
        this.field('title')
        // Fields for lunr to search.
        this.field('body')
        // Add the documents to the index.
        DOCUMENTS.forEach(doc => this.add(doc))
    }), [])

    function search(q: string) {
        setQuery(q)
        if (!q.trim()) { setResults([]); return }
        try {
            // Run the search query.
            setResults(idx.search(q))
        } catch {
            setResults([])
        }
    }

    return (
        <div className="slide slide--split">
            <div className="split-right">
                <p className="hint">Search across 10 documents (id, title, body fields).</p>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Try: javascript, search, framework..."
                    value={query}
                    onChange={e => search(e.target.value)}
                />
                <ResultList results={results} docs={DOCUMENTS} />
            </div>
        </div>
    )
}