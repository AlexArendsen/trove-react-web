import React, { useCallback } from "react";
import { Breadcrumbs, SelectedItemBreadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { Flex } from "../../components/Flex/Flex";
import { useSelectedItem } from "../../hooks/UseSelectedItem";
import { useWindowSize } from "../../hooks/UseWindowSize";
import { ItemBlade } from "./ItemBlade/ItemBlade";
import { SelectedItemDisplay } from "./SelectedItemDisplay/SelectedItemDisplay";
import { useLayout } from "../../stores/useLayout";
import { useHistory } from "react-router";
import { Item } from "../../redux/models/Items/Item";
import { Routes } from "../../constants/Routes";
import { Button } from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faColumns } from "@fortawesome/free-solid-svg-icons";

export const ItemsScreen = React.memo(() => {

	const history = useHistory()
	const { item, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()
	const layout = useLayout()

	const handleBladeItemClick = useCallback((item: Item) => { history.push(Routes.item(item._id)) }, [])

	return (
		<Flex column>
			<Flex row justify='space-between' align='center'>
				<SelectedItemBreadcrumbs />
				<Flex row align='center'>
					{ layout.sidebarVisible ? <Breadcrumbs itemId={ layout.sidebarItemId || '' } onSelectCrumb={ i => layout.setSidebarItemId(i?._id || null) } /> : null }
					<Button onClick={ layout.toggleSidebar } style={{ margin: '0 10px', padding: 8 }} variant={ layout.sidebarVisible ? 'submit' : undefined }>
						<FontAwesomeIcon icon={ faColumns } />
					</Button>
				</Flex>
			</Flex>
			<Flex row style={{ height: 'calc(100vh - 112px)', maxHeight: 'calc(100vh - 115px)', overflow: 'hidden' }}>

				{ grandparent && !isMobile ? <ItemBlade darken itemId={ grandparent?._id } selected={ parent?._id } style={{ zIndex: 100 }} onItemClick={ handleBladeItemClick } /> : null }
				{ parent && !isMobile ? <ItemBlade itemId={ parent?._id } selected={ item?._id } style={{ marginLeft: grandparent ? -250 : 0, zIndex: 200 }} onItemClick={ handleBladeItemClick } /> : null }
				<SelectedItemDisplay />
				{ layout.sidebarVisible ? <ItemBlade itemId={ layout.sidebarItemId || '' } onItemClick={ i => layout.setSidebarItemId(i._id) } /> : null }

			</Flex>
		</Flex>
	)

})