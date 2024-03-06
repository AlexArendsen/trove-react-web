import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useMemo } from "react";
import ReactTooltip from "react-tooltip";
import { GlobalEventController } from "../components/Controllers/GlobalEventController";
import { Flex } from "../components/Flex/Flex";
import { Header } from "../components/Header/Header";
import { ItemEditorModal } from "../components/ItemEditor/ItemEditorModal";
import { MoveEditorModal } from "../components/MoveEditor/MoveEditor";
import { ConfirmPopover } from "../components/Popover/ConfirmPopover";
import { MultiSelectBottomSheet } from "../components/Popover/MultiSelectBottomSheet";
import { useQueryParams } from "../hooks/UseQueryParams";
import { useSelectedItem } from "../hooks/UseSelectedItem";
import { useItemStore } from "../stores/ItemStore/useItemStore";
import { ItemsScreen } from "./ItemsScreen/ItemsScreen";
import { LoadingScreen } from "./LoadingScreen/LoadingScreen";
import { OauthLoginScreen } from "./LoginScreen/OauthLoginScreen";
import { SearchScreen } from "./SearchScreen/SearchScreen";

export const BaseScreen = React.memo(() => {

	const auth = useAuth0()
	const loggedIn = auth.isAuthenticated

	const { item } = useSelectedItem();
	useEffect(() => {
		document.title = item ? `${ item.title } | Trove` : 'Trove'
	}, [ item ])

	const itemsLoading = useItemStore(s => s.isLoading);
	const showHeader = useMemo(() => !itemsLoading && loggedIn, [ itemsLoading, loggedIn ])

	const { view, edit } = useQueryParams();
	const screen = useMemo(() => {

		if (!loggedIn) return <OauthLoginScreen />
		if (itemsLoading) return <LoadingScreen />

		switch (view) {
			case 'search': return <SearchScreen />
			default: return <ItemsScreen />
		}
	}, [ view, loggedIn, itemsLoading ])

	return (
		<Flex column>
			{ showHeader ? <Header /> : null }
			{ screen }
			<GlobalEventController />
			<ReactTooltip id='tooltip' place='left' effect='solid' />
			<ItemEditorModal />
			<MoveEditorModal />
			<MultiSelectBottomSheet />
			<ConfirmPopover />
		</Flex>
	)

})