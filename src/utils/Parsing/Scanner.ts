export type Scanner = {
    throwParseError: (message?: string) => void
    isPastEnd: () => boolean
    scanTo: (stop: string | Set<string>, includeMatch?: boolean) => string
    isOnChar: (expect: string | Set<string>) => boolean
    currentChar: () => string
    scanChar: (expected?: string | Set<string>) => string
    debugCurrent: (debugMessage?: string) => void
    skipWhitespace: () => void
    currentIdx: () => number
    resetIdx: (idx: number) => void
}

export const MakeScanner = (
    src: string,
    startIdx: number = 0
): Scanner => {

    let idx = startIdx

    const throwParseError = (message?: string) => {
        // TODO -- include nearby source in message
        const snippet = `${src.substring(Math.max(idx - 20, 0), idx)}█${src.substring(idx, Math.min(idx, src.length))}`
        throw new Error(`Parsing error near src[${idx}]:\nMessage: ${message}\nNearby code: ...${snippet}...`)
    }

    const isPastEnd = () => idx >= src.length

    const scanTo = (stop: string | Set<string>, includeMatch?: boolean) => {
        let token = ''
        const stopSet = typeof stop === 'string' ? new Set([stop]) : stop
        while (!isPastEnd()) {
            const matches = stopSet.has(src[idx])
            if (matches) {
                if (includeMatch) {
                    token += src[idx]
                    ++idx
                }
                break;
            }
            token += src[idx]
            ++idx
        }
        return token
    }

    const isOnChar = (expect: string | Set<string>) => {
        if (typeof expect === 'string') return src[idx] === expect
        else return expect.has(src[idx])
    }

    const currentChar = () => src[idx]
    const currentIdx = () => idx;
    const resetIdx = (newIdx: number) => idx = newIdx;
    const scanChar = (expect?: string | Set<string>) => {
        const scanned = src[idx++] || 'EndOfFile';
        if (!!expect) {
            if (typeof expect === 'string') {
                if (scanned !== expect) throwParseError(`Expected "${nameCharater(expect)}", but got "${nameCharater(scanned)}"`)
            } else if (!expect.has(scanned)) {
                throwParseError(`Expected one of [${Array.from(expect).map(nameCharater).join(',')}], but got "${nameCharater(scanned)}"`)
            }
        }
        return scanned
    }

    const debugCurrent = (msg?: string) => {
        console.log(`[PARSE] ${msg} . Current = ${ src[idx] }`)
    }

    const wsChars = new Set([' ', '\n', '\t', '\r'])
    const skipWhitespace = () => { while (isOnChar(wsChars)) scanChar(); }


    return {
        throwParseError, isPastEnd, scanTo, isOnChar,
        currentChar, scanChar, resetIdx, debugCurrent, skipWhitespace,
        currentIdx
    }

}

const nameCharater = (char: string) => {
    switch (char) { 
        case '\n': return '\\n';
        case '\t': return '\\t';
        case '\t': return '\\r';
        default: return char
    }
}