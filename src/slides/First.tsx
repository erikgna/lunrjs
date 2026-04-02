import { useState, useMemo } from "react";
import lunr from "lunr";
import type { SearchResult } from "../types";
import { ResultList } from "../ResultList";
import { generateDocuments } from "../utils";

const DOCUMENTS = generateDocuments(1000);

export function GettingStartedSlide() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Creates the Lunr search index.
  // Wrapped in useMemo so it runs only once (not on every render).
  const idx = useMemo(() => {
    const t0 = performance.now();
    const index = lunr(function () {
      // Set the document id field.
      this.ref("id");
      // Fields for lunr to search.
      this.field("title");
      // Fields for lunr to search.
      this.field("body");
      // Add the documents to the index.
      DOCUMENTS.forEach((doc) => this.add(doc));
    });

    const t1 = performance.now();
    console.log(
      `Index built in ${(t1 - t0).toFixed(2)}ms for ${DOCUMENTS.length} docs`,
    );

    return index;
  }, []);

  function search(q: string) {
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      return;
    }

    try {
      const t0 = performance.now();
      const res = idx.search(q);

      const t1 = performance.now();
      const duration = t1 - t0;

      console.log(
        `Search took ${duration.toFixed(2)}ms for ${DOCUMENTS.length} docs`,
      );
      setResults(res);
    } catch {
      setResults([]);
    }
  }

  return (
    <div className="slide slide--split">
      <div className="split-right">
        <p className="hint">
          Search across 10 documents (id, title, body fields).
        </p>
        <input
          className="search-input"
          type="text"
          placeholder="Try: javascript, search, framework..."
          value={query}
          onChange={(e) => search(e.target.value)}
        />
        <ResultList results={results} docs={DOCUMENTS} />
      </div>
    </div>
  );
}
