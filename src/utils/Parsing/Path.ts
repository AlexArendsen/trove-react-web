import { Err } from "./ParsingUtils"

export interface PathAstNode {
    type: 'identifier' | 'choice' | 'wild1' | 'wild2'
    data: string[]
}

const ParsePath = (src: string, options?: Partial<{
    startIdx: number,
    type: 'auto' | 'relative' | 'absolute'
}>): PathAstNode[] => {

    let idx: number = options?.startIdx || 0
    let steps: PathAstNode[] = []

    const pastEnd = () => idx >= src.length

    const scanTo = (stop: string | Set<string>, includeMatch?: boolean) => {
        let token = ''
        const stopSet = typeof stop === 'string' ? new Set([stop]) : stop
        while (!pastEnd()) {
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

    const nextIs = (expect: string | Set<string>) => {
        if (typeof expect === 'string') return src[idx] === expect
        else return expect.has(src[idx])
    }
    const nextOne = () => ++idx;

    const debugThis = (msg: string) => {
        console.log(`[PARSE] ${msg} . Current = ${ src[idx] }`)
    }

    const skipWs = () => { while (nextIs(' ')) nextOne(); }

    const Path = () => {
        if (nextIs('/')) return AbsolutePath()
        else return RelativePath()
    }

    const AbsolutePath = (): void => {
        if (!nextIs('/')) Err('Absolute path must begin with a \'/\' character')
        nextOne();
        return pastEnd() ? undefined : RelativePath()
    }

    const RelativePath = (): void => {
        let step: PathAstNode | null = null
        switch (src[idx]) {
            case '*': step = Wildcard(); break;
            case '(': step = Choice(); break;
            default: step = Identifier(); break;
        }
        steps.push(step)

        if (nextIs('/')) return AbsolutePath()  // Not done yet, possibly more to read
        return
    }

    const Identifier = (): PathAstNode => {
        const name = scanTo(new Set(['/', ' '])) // Leave cursor on the first character after the identifier
        return { data: [name], type: 'identifier' }
    }

    const Choice = (): PathAstNode => {
        if (!nextIs('(')) Err('Choice steps must begin with a parenthesis')
        nextOne()
        let names: string[] = []
        while (!nextIs(')') && !pastEnd()) {
            if (nextIs('|')) nextOne()
            skipWs()
            names.push(scanTo(new Set(['|', ')', ' '])))
            skipWs()
        }
        nextOne() // Set cursor to final paren
        nextOne() // one more to get it to the next character (slash / space / end)
        return { data: names, type: 'choice' }
    }

    const Wildcard = (): PathAstNode => {
        if (!nextIs('*')) Err('Wildcard steps must begin with an asterisk')
        nextOne();
        let type: 'wild1' | 'wild2' = 'wild1'
        if (nextIs('*')) {
            nextOne();
            type = 'wild2'
        }
        return { data: [], type }
    }

    const type = options?.type || 'auto'
    if (type === 'absolute') AbsolutePath()
    else if (type === 'relative') RelativePath()
    else Path()

    return steps

}

export const Path = {
    Parse: ParsePath
}