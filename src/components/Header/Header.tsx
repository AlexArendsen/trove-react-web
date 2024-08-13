import { useAuth0 } from "@auth0/auth0-react";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../constants/Routes";
import { Bump } from "../Bump/Bump";
import { Button } from "../Button/Button";
import { Flex } from "../Flex/Flex";
import { Logo } from "../Logo/Logo";
import { TextInput } from "../TextInput/TextInput";
import './Header.css';

export const Header = React.memo(() => {

	const history = useHistory();
	const handleSearch = useCallback((value: string) => history.push(Routes.search(value)), [ history ])
	const auth = useAuth0()
	const handleAvatarClick = useCallback(() => {
		auth.logout()
	}, [ history ])


	return (
		<Flex row className='header' align='stretch' justify='space-between'>
			<div style={{ cursor: 'pointer'}} onClick={ () => history.push(Routes.item('')) }>
				<Logo variant='gradient' />
			</div>
			<Bump w={ 10 } />
			<div style={{ flex: 1, maxWidth: 600 }}>
				<TextInput placeholder='Search' onEnter={ handleSearch } />
			</div>
			<Bump w={ 10 } />
			<Button onClick={ handleAvatarClick } label='Log Out' />
		</Flex>
	)

})