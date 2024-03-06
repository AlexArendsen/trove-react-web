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

export const App = React.memo(() => {

  const store = useMemo(() => CreateStore(), [])
  const auth0 = useAuth0();
  const login = useLoginInitState()

  const init = useCallback(async () => {
    console.log('Setting')
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
            <BaseScreen />
          </Router>
        </Provider>
      </DndProvider>
    </>
  );

})
