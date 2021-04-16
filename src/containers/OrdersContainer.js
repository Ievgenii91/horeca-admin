import React from 'react';
import { connect } from 'react-redux';
import Order from '../components/Order';
import { addOrder, finishOrder } from '../stores/orders/ordersActions';
import OrderModel from '../stores/orders/orderModel';
import { getOrders } from '../stores/orders/ordersSelectors';
import getSocket from '../socket';

class OrdersContainer extends React.Component {
  constructor() {
    super();

    const socket = getSocket();
    socket.on('add_order', (data) => {
      if (this.props.orders.filter((v) => v.id === data.id).length) {
        console.warn('duplicate order sent', data);
        return;
      }
      this.props.addOrder(new OrderModel(data));
      console.log('addOrder', data);
    });

    socket.on('finish_order', ({ id }) => {
      this.props.finishOrder(id);
    });
  }

  markAsDone(id, room) {
    const socket = getSocket();
    socket.emit('finish_order', { id, room });
    this.props.finishOrder(id);
  }

  render() {
    let { orders } = this.props;
    return (
      <div className="row mt-2">
        {orders
          .filter((v) => v.status === 'new')
          .map((v, i) => {
            return <Order key={`order-${i}`} {...v} markAsDone={this.markAsDone.bind(this)} />;
          })}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    orders: getOrders(state),
  }),
  {
    finishOrder,
    addOrder,
  },
)(OrdersContainer);
