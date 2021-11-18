import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import OrdersContainer from '../containers/OrdersContainer';
import HomeContainer from '../containers/HomeContainer';
import TimeTrackingContainer from '../containers/TimeTrackingContainer';
import AdminContainer from '../containers/AdminContainer';
import UsersContainer from '../containers/UsersContainer';
import CategoriesContainer from '../containers/CategoriesContainer';
// import StatsContainer from '../containers/StatsContainer';

export default function Main() {
  return (
    <div className="container-fluid">
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        {/* <Route path="/orders" component={OrdersContainer} /> */}
        <Route path="/categories" component={CategoriesContainer} />
        {/* <Route path="/stats" component={StatsContainer} /> */}
        <Route path="/admin" component={AdminContainer} />
        <Route path="/users" component={UsersContainer} />
        <Route path="/timetracking" component={TimeTrackingContainer} />
      </Switch>
    </div>
  );
}
