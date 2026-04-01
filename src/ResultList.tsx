import type { SearchResult, DocLike } from "./types";

export function ResultList({ results, docs }: { results: SearchResult[]; docs: DocLike[] }) {
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