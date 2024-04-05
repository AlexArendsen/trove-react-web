import React from "react";
import { LensConfiguration } from "../../components/ItemEditor/ItemEditorNewLensPage";
import { Flex } from "../../components/Flex/Flex";
import { TrText } from "../../components/Text/Text";
import { Bump } from "../../components/Bump/Bump";
import { TextInput } from "../../components/TextInput/TextInput";
import { useItemEditor } from "../../stores/useItemEditor";

export const LensConfigurationControls = React.memo((props: {
    config: LensConfiguration,
    onChange: (updated: LensConfiguration) => void
}) => {

    const ed = useItemEditor()
    const { config, onChange } = props

    return (
        <Flex column>
            <TrText small faded>Lens Title</TrText>
            <Bump h={5} />
            <Flex row>
                <TextInput
                    value={ config.title }
                    style={{ fontSize: 24, fontWeight: 700, marginTop: 1, flex: 1 }}
                    onKeyDown={ ed.handleKeyDown }
                    onChange={ title => onChange({ ...config, title }) }
                />
            </Flex>
        </Flex>
    )

})
