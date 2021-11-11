import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../components/Button/Button";
import { Flex } from "../../components/Flex/Flex";
import { Logo } from "../../components/Logo/Logo";
import { Text } from "../../components/Text/Text";
import { TextInput } from "../../components/TextInput/TextInput";
import { useStore } from "../../hooks/UseStore";
import { GetStoredToken, GetTokenAction } from "../../redux/actions/AuthenticationActions";
import './LoginScreen.css';

export const LoginScreen = React.memo(() => {

	const dispatch = useDispatch();
	const [ username, setUsername ] = useState('')
	const [ password, setPassword ] = useState('')
	const loggingIn = useStore(s => s.authentication.token.loading);

	const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const x: any = await dispatch(GetTokenAction(username, password))
		setPassword('')
	}, [ username, password ])

	return (
		<Flex row wrap justify='space-around' align='center' className='login-screen'>

			<Logo large variant='white' />

			<form onSubmit={ handleLogin }>

				<Flex column className='login-card'>

					<Flex column style={{ flex: 1 }}>
						<TextInput key='username' large style={{ height: 54, fontSize: 24 }} onChange={ setUsername } value={ username } />
						<TextInput key='password' large secret style={{ marginTop: 24, height: 54, fontSize: 24 }} onChange={ setPassword } value={ password } />
					</Flex>

					<Button variant='submit' disabled={ loggingIn } fullWidth textStyle={{ fontSize: 24, fontWeight: 700, textTransform: 'uppercase' }} style={{ height: 54, opacity: loggingIn ? 0.4 : 1 }} submitForm>
						Log In
					</Button>

				</Flex>

			</form>

		</Flex>
	)

})