import React, { useEffect, useMemo } from 'react';
import { CreateStore } from './redux/store';
import { BaseScreen } from './screens/BaseScreen';
import { Provider } from 'react-redux';
import { GetAllItemsAction } from './redux/actions/ItemActions';
import { SetConfig } from './utils/Config';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

export const App = React.memo(() => {

  const store = useMemo(() => CreateStore(), [])

  useEffect(() => {
    store.dispatch(GetAllItemsAction())
    SetConfig({ Store: store })
  }, [])

  return (
    <DndProvider backend={ HTML5Backend }>
      <Provider store={ store }>
        <BrowserRouter>
          <BaseScreen />
        </BrowserRouter>
      </Provider>
    </DndProvider>
  );

})
