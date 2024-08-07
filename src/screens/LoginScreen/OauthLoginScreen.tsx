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

            <div className='login-card'>
                <Logo large variant='accent' />
                <Button
                    // variant={auth.isLoading ? undefined : 'submit'}
                    variant='primary'
                    fullWidth
                    large
                    onClick={() => auth.loginWithRedirect({})}
                    label={auth.isLoading ? 'Loading...' : 'Log In'}
                />
            </div>

        </Flex>
    )


})