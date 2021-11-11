import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { LogOutAction } from "../../redux/actions/AuthenticationActions";
import { Avatar } from "../Avatar/Avatar";
import { Flex } from "../Flex/Flex";
import { Logo } from "../Logo/Logo";
import { Text } from "../Text/Text";
import { TextInput } from "../TextInput/TextInput";

export const Header = React.memo(() => {

	const dispatch = useDispatch();
	const history = useHistory();
	const handleSearch = useCallback((value: string) => history.push(Routes.search(value)), [ history ])
	const handleAvatarClick = useCallback(() => {
		dispatch(LogOutAction())
	}, [ history ])

	return (
		<Flex row style={{ padding: 15 }} align='center' justify='space-between'>
			<div style={{ cursor: 'pointer', marginLeft: 20 }} onClick={ () => history.push(Routes.item('')) }>
				<Logo variant='gradient' />
			</div>
			<div style={{ flex: 1, maxWidth: 600 }}>
				<TextInput placeholder='Search' large onEnter={ handleSearch } />
			</div>
			<Avatar onClick={ handleAvatarClick } />
		</Flex>
	)

})