import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { LogOutAction } from "../../redux/actions/AuthenticationActions";
import { Avatar } from "../Avatar/Avatar";
import { Bump } from "../Bump/Bump";
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
		<Flex row style={{ padding: '15px 20px' }} align='center' justify='space-between'>
			<div style={{ cursor: 'pointer'}} onClick={ () => history.push(Routes.item('')) }>
				<Logo variant='gradient' />
			</div>
			<Bump w={ 10 } />
			<div style={{ flex: 1, maxWidth: 600 }}>
				<TextInput placeholder='Search' large onEnter={ handleSearch } />
			</div>
			<Bump w={ 10 } />
			<Avatar onClick={ handleAvatarClick } />
		</Flex>
	)

})