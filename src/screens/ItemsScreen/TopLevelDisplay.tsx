import React from "react";
import { Flex } from "../../components/Flex/Flex";
import { ItemInputForm } from "../../components/ItemInputForm/ItemInputForm";
import { ItemList } from "../../components/ItemList/ItemList";
import { useStore } from "../../hooks/UseStore";

export const TopLevelDisplay = React.memo(() => {

	const topLevels = useStore(s => s.items.topLevel)

	return (
		<Flex column align='center' style={{ marginTop: 40 }}>

			<Flex column style={{ width: 875 }}>
				<ItemInputForm style={{ marginBottom: 35 }} />
				<ItemList items={ topLevels } navOnClick />
			</Flex>

		</Flex>
	)

})