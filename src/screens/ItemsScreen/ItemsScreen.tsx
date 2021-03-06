import React from "react";
import { useSelector } from 'react-redux';
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { Flex } from "../../components/Flex/Flex";
import { Text } from "../../components/Text/Text";
import { useSelectedItem } from "../../hooks/UseSelectedItem";
import { useStore } from "../../hooks/UseStore";
import { ItemBlade } from "./ItemBlade/ItemBlade";
import { SelectedItemDisplay } from "./SelectedItemDisplay/SelectedItemDisplay";
import { TopLevelDisplay } from "./TopLevelDisplay";

export const ItemsScreen = React.memo(() => {

	const { item, parent, grandparent } = useSelectedItem();

	if (!item) return <TopLevelDisplay />

	return (
		<Flex column>
			<Breadcrumbs />
			<Flex row style={{ height: 'calc(100vh - 112px)', maxHeight: 'calc(100vh - 115px)', overflow: 'hidden' }}>

				{ grandparent ? <ItemBlade darken itemId={ grandparent?._id } selected={ parent?._id } style={{ zIndex: 100 }} /> : null }
				{ parent ? <ItemBlade itemId={ parent?._id } selected={ item?._id } style={{ marginLeft: grandparent ? -250 : 0, zIndex: 200 }} /> : null }
				<SelectedItemDisplay />


			</Flex>
		</Flex>
	)

})