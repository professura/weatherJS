import "@babel/polyfill";
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppContainer from './containers/AppContainer'
import configureStore from './store/configureStore'
import { HashRouter, Route, Switch } from 'react-router-dom'

const store = configureStore()

render(
  <Provider store={store}>
    <HashRouter>
            <Switch>
                <Route path="/weather/:city" component={AppContainer} />
                <Route path="/weather" component={AppContainer} />
                <Route path="/" component={AppContainer} />
            </Switch>
    </HashRouter>  
  </Provider>,
  document.getElementById('app')
)