import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OrdersContainer from '../containers/OrdersContainer';
import SettingsContainer from '../containers/SettingsContainer';
import AdminContainer from '../containers/AdminContainer';
import CategoriesContainer from '../containers/CategoriesContainer';
import StatsContainer from '../containers/StatsContainer';

export default function Main() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route exact path="/" component={OrdersContainer} />
        <Route path="/settings" component={SettingsContainer} />
        <Route path="/admin" component={AdminContainer} />
        <Route path="/categories" component={CategoriesContainer} />
        <Route path="/stats" component={StatsContainer} />
      </Switch>
    </div>
  );
}
