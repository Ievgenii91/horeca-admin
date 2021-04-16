import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrdersContainer from '../containers/OrdersContainer';
import SettingsContainer from '../containers/SettingsContainer';
import AdminContainer from '../containers/AdminContainer';

export default function Main() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route exact path="/" component={OrdersContainer} />
        <Route path="/settings" component={SettingsContainer} />
        <Route path="/admin" component={AdminContainer} />
      </Switch>
    </div>
  );
}
