import React from 'react';
import { Bump } from '../../components/Bump/Bump';
import { Button } from '../../components/Button/Button';
import { Flex } from '../../components/Flex/Flex';
import { Logo } from '../../components/Logo/Logo';
import './LoginScreen.css';
import { useAuth0 } from '@auth0/auth0-react';

export const OauthLoginScreen = React.memo(() => {

    const auth = useAuth0()

	return (
		<Flex column center className='login-screen'>

            <div style={{ maxWidth: 600, backgroundColor: 'white', padding: 50 }}>
                <Logo large variant='gradient' />
                <Bump h={ 120 } />
                <Button
                    variant={ auth.isLoading ? undefined : 'submit' }
                    fullWidth
                    large
                    onClick={ () => auth.loginWithRedirect({  }) }
                >
                    { auth.isLoading ? 'Loading...' : 'Log In' }
                </Button>
            </div>

		</Flex>
	)


})