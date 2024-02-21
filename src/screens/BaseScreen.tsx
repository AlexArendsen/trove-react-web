import React, { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import { Flex } from "../components/Flex/Flex";
import { Header } from "../components/Header/Header";
import { useQueryParams } from "../hooks/UseQueryParams";
import { useSelectedItem } from "../hooks/UseSelectedItem";
import { useStore } from "../hooks/UseStore";
import { GetStoredToken } from "../redux/actions/AuthenticationActions";
import { ItemsScreen } from "./ItemsScreen/ItemsScreen";
import { LoadingScreen } from "./LoadingScreen/LoadingScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { SearchScreen } from "./SearchScreen/SearchScreen";
import { useAuth0 } from "@auth0/auth0-react";
import { OauthLoginScreen } from "./LoginScreen/OauthLoginScreen";
import { ModalPopover } from "../components/Popover/ModalPopover";
import { ItemEditorModal } from "../components/ItemEditor/ItemEditorModal";
import { MoveEditorModal } from "../components/MoveEditor/MoveEditor";
import { MultiSelectBottomSheet } from "../components/Popover/MultiSelectBottomSheet";

export const BaseScreen = React.memo(() => {

	const auth = useAuth0()
	const loggedIn = auth.isAuthenticated

	const { item } = useSelectedItem();
	useEffect(() => {
		document.title = item ? `${ item.title } | Trove` : 'Trove'
	}, [ item ])

	const itemsLoading = useStore(s => s.items.all.loading);
	const showHeader = useMemo(() => !itemsLoading && loggedIn, [ itemsLoading, loggedIn ])

	const { view } = useQueryParams();
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
			<ReactTooltip id='tooltip' place='left' effect='solid' />
			<ItemEditorModal />
			<MoveEditorModal />
			<MultiSelectBottomSheet />
		</Flex>
	)

})