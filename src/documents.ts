export const DOCUMENTS = [
    { id: 'lunr', title: 'Lunr.js', cat: 'search', body: 'Full-text search for the browser with no external dependencies. Similar to Solr but much smaller and not as bright.' },
    { id: 'fuse', title: 'Fuse.js', cat: 'search', body: 'Lightweight fuzzy-search library in JavaScript with no external dependencies. Searches arrays of strings or objects.' },
    { id: 'react', title: 'React', cat: 'ui', body: 'A JavaScript library for building user interfaces. Declarative, component-based, and learn once write anywhere.' },
    { id: 'vue', title: 'Vue.js', cat: 'ui', body: 'The progressive JavaScript framework for building user interfaces. An incrementally adoptable ecosystem.' },
    { id: 'vite', title: 'Vite', cat: 'tooling', body: 'Next generation frontend tooling. Instant server start, lightning fast hot module replacement, and optimised builds.' },
    { id: 'webpack', title: 'Webpack', cat: 'tooling', body: 'A static module bundler for modern JavaScript applications that builds a dependency graph and bundles modules.' },
    { id: 'typescript', title: 'TypeScript', cat: 'language', body: 'TypeScript is JavaScript with syntax for types. A strongly typed programming language that builds on JavaScript.' },
    { id: 'nodejs', title: 'Node.js', cat: 'runtime', body: 'An open-source, cross-platform JavaScript runtime environment. Execute JavaScript server-side outside a browser.' },
    { id: 'graphql', title: 'GraphQL', cat: 'api', body: 'A query language for APIs. Gives clients the power to ask for exactly what they need, nothing more, nothing less.' },
    { id: 'redux', title: 'Redux', cat: 'state', body: 'A predictable state container for JavaScript apps. Write applications that behave consistently across environments.' },
]

export const DOCUMENTS_GREY = [
    ...DOCUMENTS,
    { id: 'colour', title: 'Colour Theory', cat: 'design', body: 'Grey is a neutral colour between black and white. Frequently used in UI design for backgrounds and borders.' },
]