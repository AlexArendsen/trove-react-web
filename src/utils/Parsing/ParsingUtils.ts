export const Err = (message: string, context?: Partial<{
    src: string,
    index: number
}>) => {
    throw new Error(`Parsing error: ${message}`)
}