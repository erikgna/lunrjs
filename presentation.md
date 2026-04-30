## Slide 1

First we need to understand the problem, in a common frontend, for a simple search we usually need to call a backend API, add Elasticsearch, maintain infra, deal with latency. And for small and medium datasets, this may be overkill.

## Slide 2

We have a few options, first is to use a simple array with a filter function.
It works for tiny data, but has no ranking or fuzzy search.

Second we could use Elasticsearch, it's powerful and scalable, but it's heavy, costs money, and requires maintenance.

Finally, we can use LunrJS, it runs on the browser, fast, simple, and zero infra.

## Slide 3

Lunr.js is a small JS lib, it has full-text search, relevance ranking, tokenization + stemming, works offline, and has no dependencies.

Something like a mini Elasticsearch running on our frontend.

## Slide 4

It works in a few simple steps.

First, we add documents to the index. The text is cleaned and broken into tokens, so similar words can still match.

Next, we build an inverted index, which maps words to the documents that contain them.

Then, we score results by relevance. Rare and important words in a document get higher weight, while common words get less.

When a user searches, the query goes through the same process. We look up the terms, combine the matches, and rank the results.

All of this runs in JS, in memory, so searches are extremely fast.


--------
e = i
a = e

b = order by content size (disable to stop it)
k1 = order by amount of times the searched token appears in the content (disable to stop it)
--------


## Slide 5

Trade-offs

PROS

- we can eliminate backend, infra and maitenance.
- Search happens instantly because there’s no network latency
- We can get it working in minutes

CONS
- Loads data into browser memory, the documents size will impact performance
- At scale (10k +), memory and performance become bottlenecks.
- Building the index takes time and CPU in the user’s browser

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
