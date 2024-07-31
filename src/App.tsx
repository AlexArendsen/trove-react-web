import { useAuth0 } from '@auth0/auth0-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import './App.css';
import { Initialize } from './Startup';
import { TrHistory } from './constants/History';
import { CreateStore } from './redux/store';
import { BaseScreen } from './screens/BaseScreen';
import { useItemStore } from './stores/ItemStore/useItemStore';
import { useLoginInitState } from './stores/useLoginInitState';
import { useTheme } from './hooks/UseTheme';

export const App = React.memo(() => {

  const store = useMemo(() => CreateStore(), [])
  const auth0 = useAuth0();
  const login = useLoginInitState()
  const theme = useTheme()

  const init = useCallback(async () => {
    login.setStatus('Loading')
    await Initialize({ auth0, store })
    login.setStatus('Ready')
    useItemStore.getState().load()
  }, [])

  useEffect(() => { init() }, [])

  return (
    <>
    {/* @ts-ignore */}
      <DndProvider backend={ HTML5Backend }>
        <Provider store={ store }>
          <Router history={TrHistory}>
            <div className='theme-root' data-theme={ theme.theme } data-lol='fa'>
              <BaseScreen />
            </div>
          </Router>
        </Provider>
      </DndProvider>
    </>
  );

})
