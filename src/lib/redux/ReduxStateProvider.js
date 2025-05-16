'use client';
import { Provider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

let persistor = persistStore(store);

export default function ReduxStateProvider({children}) {
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          { children }
      </PersistGate>
    </Provider>
  )

}