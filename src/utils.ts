import lunr from 'lunr'

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