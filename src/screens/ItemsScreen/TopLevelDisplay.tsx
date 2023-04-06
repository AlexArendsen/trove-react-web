import React from "react";
import { Bump } from "../../components/Bump/Bump";
import { Flex } from "../../components/Flex/Flex";
import { ItemInputForm } from "../../components/ItemInputForm/ItemInputForm";
import { ItemList } from "../../components/ItemList/ItemList";
import { Text } from "../../components/Text/Text";
import { useLens } from "../../hooks/UseLens";
import { useStore } from "../../hooks/UseStore";

export const TopLevelDisplay = React.memo(() => {

	const lens = useLens()
	const topLevels = useStore(s => lens.current.getHomeScreenItems(s.items))

	return (
		<Flex column align='center' style={{ marginTop: 40 }}>

			<Flex column style={{ maxWidth: 875 }}>
				<div style={{ margin: '0 20px' }}>
					<Text large bold>{ lens.current.homeScreenLabel }</Text>
					<Bump h={ 20 } />
					<ItemInputForm onSubmitOverride={ lens.current.onAddTopLevelItem } />
				</div>
				<Bump h={35} />
				<ItemList items={ topLevels } navOnClick />
			</Flex>

		</Flex>
	)

})