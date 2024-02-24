import React, { useCallback, useEffect, useMemo } from 'react';
import { CreateStore } from './redux/store';
import { BaseScreen } from './screens/BaseScreen';
import { Provider } from 'react-redux';
import { GetAllItemsAction } from './redux/actions/ItemActions';
import { SetConfig } from './utils/Config';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Router } from 'react-router-dom';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Initialize } from './Startup';
import { useAsyncEffect } from './hooks/UseAsyncEffect';
import { TrHistory } from './constants/History';
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
    store.dispatch(GetAllItemsAction())
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
