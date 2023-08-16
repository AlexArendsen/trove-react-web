import { MakeScanner, Scanner } from "./Scanner"
import { MakePrintingStack } from "./Stack"

export type TxmlAstNode = {
    name: string
    attributes: Record<string, string>
    children?: TxmlAstNode[]
}

type TxmlTypeAndNode = {
    type: 'open' | 'close' | 'self-closing',
    node: TxmlAstNode 
}


const ParseTxml = (txml: string, options?: Partial<{
    scanner: Scanner
}>): TxmlAstNode => {

    const s = options?.scanner || MakeScanner(txml, 0)
    const stack = MakePrintingStack(20, 100_000)

    // El: OpenTag + [{El}] + CloseTag | SelfClosingTag
    const El = (): TxmlAstNode => {
        stack.push('El')
        const open = Tag()
        if (open.type === 'close') s.throwParseError(`Exected open tag, but got close tag for ${open.node.name}`)
        else if (open.type ==='self-closing') {
            stack.pop(`identified sc tag ${open.node.name}`)
            return open.node
        }

        s.skipWhitespace()

        let children: TxmlAstNode[] = []
        let close: TxmlTypeAndNode | null = null

        do {

            // If the next tag is a closing tag, then we're done (kinda hacky, but it works)
            s.scanChar('<')
            if (s.scanChar() === '/') {
                s.resetIdx(s.currentIdx() - 1) // reposition cursor on slash, as CloseTagSuffix requests
                close = { type: 'close', node: CloseTagSuffix() }
                break;
            }

            // Otherwise, go back two spots and keep reading children
            s.resetIdx(s.currentIdx() - 2)
            children.push(El())
            s.skipWhitespace()

        } while (!s.isPastEnd());

        if (close === null)
            s.throwParseError(`Missing closing tag for ${open.node.name}`)
        else if (close.node.name !== open.node.name)
            s.throwParseError(`Expected matching closing tag for ${open.node.name} to match, but got closing tag for ${close.node.name}`)

        stack.pop(`identifier tag ${open.node.name}`)

        return {
            name: open.node.name,
            attributes: open.node.attributes,
            children
        }

    }

    const Tag = (): TxmlTypeAndNode => {
        stack.push('Tag')
        s.scanChar('<')
        s.skipWhitespace()
        if (s.isOnChar('/')) {
            const node = CloseTagSuffix()
            stack.pop()
            return { type: 'close', node }
        }
        const node = OpenOrSelfClosingTagSuffix()
        stack.pop()
        return node
    }

    // START on the character AFTER the < 
    const OpenOrSelfClosingTagSuffix = (): TxmlTypeAndNode => {
        stack.push('OpenOrSelfClosingTagSuffix')
        s.skipWhitespace()

        const name = Identifier();
        if (!name) s.throwParseError(`Expected tag name, got "${s.currentChar()}"`)

        s.skipWhitespace()
        const attrs: Record<string, string> = {}
        const terminals = new Set(['/', '>'])
        while (!s.isOnChar(terminals) && !s.isPastEnd()) {
            const { key, value } = Attribute()
            attrs[key] = value
            s.skipWhitespace()
        }

        if (s.isOnChar('/')) {
            s.scanChar('/') // scan '/', cursor on '>'
            s.skipWhitespace()
            s.scanChar('>') // scan '>', cursor on whatever comes after '>'
            stack.pop()
            return { type: 'self-closing', node: { name, attributes: attrs } }
        }

        s.scanChar('>')
        stack.pop()
        return { type: 'open', node: { name, attributes: attrs } }
        
    }

    // STARTS on the slash character
    const CloseTagSuffix = (): TxmlAstNode => {
        stack.push('CloseTagSuffix')
        s.scanChar('/')
        s.skipWhitespace()
        const name = Identifier()
        s.skipWhitespace()
        s.scanChar('>')
        stack.pop()
        return { name, attributes: {} }
    }

    const Attribute = (): { key: string, value: string } => {
        stack.push('Attribute')
        const key = Identifier()
        s.skipWhitespace()
        s.scanChar('=')
        s.skipWhitespace()
        s.scanChar('{')
        s.skipWhitespace()
        const value = Identifier()
        s.skipWhitespace()
        s.scanChar('}')
        stack.pop()
        return { key, value }
    }

    const Identifier = (): string => {
        stack.push('Identifier')
        let out = ''
        while (/[A-Za-z0-9]/.test(s.currentChar()) && !s.isPastEnd()) out += s.scanChar()
        stack.pop(`identifier: "${out}"`)
        return out;
    }

    s.skipWhitespace()
    return El()

}

export const Txml = {
    Parse: ParseTxml
}