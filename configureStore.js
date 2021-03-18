import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage";
import rootReducer from "./src/store/reducers";
import thunk from "redux-thunk";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const persistConfig = {
  key: "root",
  storage: storageSession,
  stateReconciler: hardSet
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  let store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
  let persistor = persistStore(store);
  return { store, persistor };
};
