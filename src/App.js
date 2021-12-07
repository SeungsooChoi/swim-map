import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import "./App.css";
import rootReducer from "./modules";
import SwimMap from "./routes/SwimMap";

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={SwimMap} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
