import { MakeScanner, Scanner } from "./Scanner"

export interface PathAstNode {
    type: 'literal' | 'pattern',
    regex?: RegExp,
    literal?: string 
}

/**
 * Parses TQL Path Query. e.g., /Work/<STAR>/(P1|P2)
 */

const quoteChars = new Set(["'", '"'])
const patternTerminators = new Set(['/', ' ', '\n', '\r'])
const ParsePath = (src: string, options?: Partial<{ scanner: Scanner }>): PathAstNode[] => {

    let steps: PathAstNode[] = []
    const s = options?.scanner || MakeScanner(src)

    const AbsolutePath = (): void => {
        s.scanChar('/')
        RelativePath()
    }

    const RelativePath = (): void => {
        steps.push(Pattern())
        if (s.isOnChar('/')) AbsolutePath()
    }

    const Pattern = (): PathAstNode => {

        let pat = ''
        let quote = ''
        if (s.isOnChar(quoteChars)) { // Quoted path segment, to allow for spaces
            quote = s.scanChar()
            pat = s.scanTo(quote)
            s.scanChar(quote)
        } else {
            pat = s.scanTo(patternTerminators).replace(/\*/g, '.*')
        }

        if (quote === "'") return { type: 'literal', literal: pat }
        return { type: 'pattern', regex: new RegExp(pat), literal: pat }
    }

    if (s.isOnChar('/')) AbsolutePath()
    else RelativePath()

    return steps

}

export const Path = {
    Parse: ParsePath
}