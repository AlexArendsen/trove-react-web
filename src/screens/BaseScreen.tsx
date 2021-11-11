import React, { useEffect, useMemo, useState } from "react";
import ReactTooltip from "react-tooltip";
import { Flex } from "../components/Flex/Flex";
import { Header } from "../components/Header/Header";
import { useQueryParams } from "../hooks/UseQueryParams";
import { useStore } from "../hooks/UseStore";
import { GetStoredToken } from "../redux/actions/AuthenticationActions";
import { ItemsScreen } from "./ItemsScreen/ItemsScreen";
import { LoadingScreen } from "./LoadingScreen/LoadingScreen";
import { LoginScreen } from "./LoginScreen/LoginScreen";
import { SearchScreen } from "./SearchScreen/SearchScreen";

export const BaseScreen = React.memo(() => {

	const [ loggedIn, setLoggedIn ] = useState(false);
	const login = useStore(s => s.authentication.token);
	useEffect(() => setLoggedIn(!!GetStoredToken()), []);
	useEffect(() => {
		if(!login.loading) setLoggedIn(!!GetStoredToken())
	}, [ login ])

	const itemsLoading = useStore(s => s.items.all.loading);
	const showHeader = useMemo(() => !itemsLoading && loggedIn, [ itemsLoading, loggedIn ])

	const { view } = useQueryParams();
	const screen = useMemo(() => {

		if (!loggedIn) return <LoginScreen />
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
		</Flex>
	)

})