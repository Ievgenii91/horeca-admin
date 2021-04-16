export default class OrderModel {
  constructor(data = {}) {
    this.id = data.id;
    this.type = data.type || 'bar'; // bar food mixed
    this.products = data.products || [];
    this.date = new Date();
    this.initiator = 'bot';
    this.status = 'new';
    this.room = data.room;
    this.waiter = data.waiter || 'Jon Doe';
    this.clientId = data.clientId || null;
    this.type = data.type || 'white';
  }
}
