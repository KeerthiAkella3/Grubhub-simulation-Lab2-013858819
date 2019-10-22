import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/rootReducer";

const store = createStore(rootReducer);

export default store;