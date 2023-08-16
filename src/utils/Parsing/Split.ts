import { Path, PathAstNode } from "./Path"
import { MakeScanner } from "./Scanner"

type SplitOrientation = 'horizontal' | 'vertical'

export type SplitSideAstNode = {
    type: 'path' | 'subtree',
    path?: PathAstNode[]
    subtree?: SplitAstNode
}

export type SplitAstNode = {
    item1: SplitSideAstNode
    item2: SplitSideAstNode
    orientation: SplitOrientation
}

const ParseSplit = (tql: string) => {

    const s = MakeScanner(tql)

    const SplitSpec = (): SplitAstNode => {
        if (!s.isOnChar('[')) s.throwParseError('Split specification must begin with [ character')
        s.scanChar() // Step past opening bracket
        s.skipWhitespace()
        const item1 = SplitSide()
        s.skipWhitespace()
        const orientation = Divider()
        s.skipWhitespace()
        const item2 = SplitSide()
        s.skipWhitespace()
        if (!s.isOnChar(']')) s.throwParseError('Split specification must end with ] chatacter')
        s.scanChar() // Step past the ending ]; end pointing to next character after the split

        return { item1, item2, orientation }
    }

    const SplitSide = (): SplitSideAstNode => {
        if (s.isOnChar('[')) return { type: 'subtree', subtree: SplitSpec() }
        else return { type: 'path', path: Path.Parse(tql, { scanner: s }) }
    }

    const Divider = (): SplitOrientation => {
        const token = [s.scanChar(), s.scanChar()].join('')
        switch (token) { 
            case '--': return 'vertical'
            case '\\\\': return 'horizontal'
        }
        s.throwParseError(`${token}: unexpected divider token, should either be -- or \\\\`)
        return 'horizontal'
    }

    return SplitSpec()

}

export const ItemSplit = {
    Parse: ParseSplit
}