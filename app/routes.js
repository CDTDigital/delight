/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import WindowTestPage from './containers/WindowTestPage';
import CustomerWindowPage from './containers/CustomerWindowPage';

export default () => (
  <App>
    <Switch>
      <Route path="/multiwindow" component={WindowTestPage} />
      <Route path="/customer" component={CustomerWindowPage} />
      <Route path="/counter" component={CounterPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
