import { Path, PathAstNode } from "./Path"
import { MakeScanner, Scanner } from "./Scanner"
import { MakePrintingStack } from "./Stack"
import { Txml, TxmlAstNode } from "./Txml"

type VariableSpec = { name: string, path: PathAstNode[] }

export type LayoutSpec = {
    variables: VariableSpec[],
    layout: TxmlAstNode
}

const ParseLayout = (src: string, options?: Partial<{
    scanner: Scanner
}>) => {

    const s = options?.scanner || MakeScanner(src)
    const stack = MakePrintingStack(20, 100)

    const Identifier = (): string => {
        stack.push('Identifier')
        let out = ''
        while (/[A-Za-z0-9]/.test(s.currentChar()) && !s.isPastEnd()) out += s.scanChar()
        stack.pop(`Identifier is ${out}`)
        return out;
    }

    // TodoItems: /Personal/Todo/*\n
    const VariableLine = (): { name: string, path: PathAstNode[] } => {
        stack.push('VariableLine')
        const name = Identifier()
        s.scanChar(':')
        s.skipWhitespace()
        const path = Path.Parse(src, { scanner: s })
        s.scanChar('\n')
        stack.pop()
        return { name, path }
    }

    const LayoutDoc = (): LayoutSpec => {
        let variables: VariableSpec[] = []
        let layout: TxmlAstNode | null = null
        while (!s.isPastEnd()) {
            s.skipWhitespace()
            if (s.isOnChar('<')) {
                layout = Txml.Parse(src, { scanner: s })
                break;
            } else variables.push(VariableLine())
        }

        if (!layout) s.throwParseError('Missing or invalid layout TXML definition')
        return { variables, layout: layout! }
    }

    return LayoutDoc()

}

export const Layout = {
    Parse: ParseLayout
}