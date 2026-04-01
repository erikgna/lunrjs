## Slide 1

### First we need to understand the problem.

On a common frontend, for a simple search we usually need to call a backend API, add Elasticsearch, maintain infra, deal with latency.
A ‘simple search’ requires infra, cost, latency, and complexity.
For small and medium datasets, this may be overkill.

## Slide 2

We have a few options, the first one is to use a simple array with a filter function.
It works for tiny data, but has no ranking or fuzzy search.

Or we can use Elasticsearch, it's powerful and scalable, but it's heavy, costs money, and requires maintenance.

Finally, we can use LunrJS, it runs on the browser, fast, simple, and zero infra.

## Slide 3

Lunr.js is a small JS lib that brings search engine capabilities to the browser.

It has full-text search, relevance ranking, tokenization + stemming, works offline, and has no dependencies.

Something like a mini Elasticsearch running on our frontend.

## Slide 4

It works in a few steps, first we need to add documents to the index.
It will tokenize the text, normalize it, and stem it.
It allows us to match words even if they’re slightly different.

The second step is to build the index. We use a inverted index to store the words and the documents that contain them.
The third step is to score the results by relevance, rare words that are frequent in a document get a higher score, common words get a lower score.
The fourth step is to process the query, it will tokenize the query, look up the tokens in the inverted index, combine the matches, and rank the results by score.
Finally, the index is built in JavaScript, stored in memory, and queries are executed instantly.

## Slide 5

Trade-offs

PROS

- No backend needed - we can eliminate the API, infra and maitenance.
- Extremely fast (client-side) - Search happens instantly because there’s no network latency
- Easy to integrate - It’s just a small JS lib, we can get it working in minutes

CONS
- Loads data into browser memory - Since all searchable data lives in memory, the size directly impacts performance
- Not ideal for large datasets (10k+ docs) - At scale, memory and performance become bottlenecks.
- Indexing cost on client - Building the index takes time and CPU in the user’s browser

## Slide 6

In conclusion, LunrJS is not a replacement for Elasticsearch, it's a replacement for overengineering.

<!-- 
Tokenization → splits text into words
Normalization → lowercase, remove punctuation
Stemming → reduces words to root (e.g., running → run) -->

<!-- #### Step 2

Instead of storing documents → words, Lunr builds:

word → list of documents

This structure is called an inverted index — and it’s the same idea used by search engines like Google. -->

<!-- #### Step 3

Scoring (Relevance Ranking)

Not all matches are equal.

Lunr uses a scoring algorithm similar to TF-IDF (Term Frequency–Inverse Document Frequency):

Term Frequency → how often term appears in document
Inverse Document Frequency → how rare the term is

Meaning:

Rare + frequent in doc = high score
Common word = low score

That’s why searching ‘search library’ gives better results than just ‘the’ -->

<!-- #### Step 4

Query Processing

Tokenizes your query
Looks up tokens in the inverted index
Combines matches
Ranks results by score

Important:

Supports partial matching
Supports boosting fields (e.g., title > body)

#### Step 5

Everything Happens In Memory

There’s no server, no network, no database.

Index is built in JavaScript
Stored in memory (or prebuilt JSON)
Queries are executed instantly -->

<!-- 
Simpler architecture
Zero infra cost
Instant search UX
Great for static sites, docs, small apps

If your data fits in the browser, your search probably should too. -->
