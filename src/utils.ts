import lunr from 'lunr'

import { DOCUMENTS } from './documents'

const registered = new Set<string>()

// Registers a pipeline function with Lunr.
export function safeRegister(fn: lunr.PipelineFunction, name: string) {
    // If the function is not already registered, register it.
    if (!registered.has(name)) {
        // Register the function with Lunr.
        lunr.Pipeline.registerFunction(fn, name)
        // Add the function to the registered set.
        registered.add(name)
    }
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomWords(count: number) {
    const words = DOCUMENTS.flatMap(d => d.body.split(' '))
    return Array.from({ length: count })
        .map(() => randomItem(words))
        .join(' ')
}

export function generateDocuments(size: number) {
    return Array.from({ length: size }).map((_, i) => {
        const base = randomItem(DOCUMENTS)

        return {
            id: `${base.id}-${i}-${Math.random().toString(36).slice(2, 8)}`,
            title: `${base.title} ${i}`,
            cat: base.cat,
            body: randomWords(20 + Math.floor(Math.random() * 80)) // variable size
        }
    })
}