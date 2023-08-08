import React, { useMemo, useState } from "react";
import { ItemLens } from "./ItemLens";
import { TrText } from "../components/Text/Text";
import { Path, PathAstNode } from "../utils/Parsing/Path";
import { TextInput } from "../components/TextInput/TextInput";
import { Flex } from "../components/Flex/Flex";
import { Bump } from "../components/Bump/Bump";

export const DebugItemLens: ItemLens = {

    Name: 'DebugItemLens',
    Test: i => /^#debug/.test(i.description || ''),

    Self: {
        AsSelected: {
            RenderNewItemInputForm: () => null,
            RenderChildList: (props) => <DebugChildList />
        },
    }

}

const DescribeNode = (n: PathAstNode) => {
    switch (n.type) {
        case 'identifier': return `Go to the child item labeled "${n.data}"`
        case 'choice': return `Select the following children: ${n.data.join(',')}`
        case 'wild1': return 'Select all children'
        case 'wild2': return 'Select all descendants'
    }
}

const DebugChildList = React.memo(() => {

    const [tql, setTql] = useState('/Work/**/(P1|P2)')
    const ast = useMemo((): PathAstNode[] => {
        try { return Path.Parse(tql) }
        catch (e) { return [{ data: [`ERROR: j${e}`], type: 'identifier' }] }
    }, [tql])

    return (
        <div>
            <Flex row>
                <TrText medium bold>TQL:</TrText>
                <Bump w={ 10 } />
                <TextInput value={ tql } onChange={ setTql } />
            </Flex>
            <TrText medium bold>AST</TrText>
            {
                ast.map(n => (
                    <TrText small>{ DescribeNode(n) }</TrText>
                ))
            }
        </div>
    )

})