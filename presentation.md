## Slide 1
Imagine you have a frontend app — docs, blog, products, or even logs.
Users need search. What do we usually do?
Call backend API
Add Elasticsearch
Maintain infra
Deal with latency

Now your ‘simple search’ requires infrastructure, cost, latency, and complexity.
For small to medium datasets, this is overkill.

## Slide 2
#### Do nothing / basic filter
.filter() on arrays
Works only for tiny data
No ranking, no fuzzy search

Cheap… but useless at scale.

#### Backend Search (Elasticsearch / API)
Powerful
Scalable
BUT:
Infra overhead
Network latency
Cost

Strong, but heavy.

#### LunrJS
Runs entirely in browser
Full-text search
No backend required

Fast, simple, zero infrastructure.

## Slide 3
What is LunrJS?
Lunr.js is a small JavaScript library that brings search engine capabilities to the browser.

Key Features:
Full-text search
Relevance ranking
Tokenization + stemming
Works offline
No dependencies

Think of it as a mini Elasticsearch running in your frontend.

## Slide 4
How it works?

#### Step 1
When you add documents, Lunr does text processing (pipeline):

Tokenization → splits text into words
Normalization → lowercase, remove punctuation
Stemming → reduces words to root (e.g., running → run)

This is what allows Lunr to match words even if they’re slightly different.

#### Step 2
Instead of storing documents → words, Lunr builds:

word → list of documents

This structure is called an inverted index — and it’s the same idea used by search engines like Google.

#### Step 3
Scoring (Relevance Ranking)

Not all matches are equal.

Lunr uses a scoring algorithm similar to TF-IDF (Term Frequency–Inverse Document Frequency):

Term Frequency → how often term appears in document
Inverse Document Frequency → how rare the term is

Meaning:

Rare + frequent in doc = high score
Common word = low score

That’s why searching ‘search library’ gives better results than just ‘the’

#### Step 4 
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
Queries are executed instantly

## Slide 5
Trade-offs

PROS

No backend needed - You eliminate an entire service—no API, no infra, no maintenance.
Extremely fast (client-side) - Search happens instantly because there’s no network latency
Easy to integrate - It’s just a small JS library—you can get it working in minutes

CONS
Loads data into browser memory - All searchable data lives in memory, so size directly impacts performance
Not ideal for large datasets (10k+ docs) - At scale, memory and performance become bottlenecks.
Indexing cost on client - Building the index takes time and CPU in the user’s browser

LunrJS is not a replacement for Elasticsearch — it’s a replacement for overengineering.

## Slide 6
So what do we get?

Simpler architecture
Zero infra cost
Instant search UX
Great for static sites, docs, small apps

If your data fits in the browser, your search probably should too.