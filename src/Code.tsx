export function Code({ code }: { code: string }) {
    return (
        <pre className="code-block">
            <code>{code.trim()}</code>
        </pre>
    )
}