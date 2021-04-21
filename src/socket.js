import { io } from 'socket.io-client';
let socket = null;

export default function getSocket(token, clientId) {
  if (!socket && token && clientId) {
    socket = io(window.config.apiServer, {
      transports: ['websocket'],
      reconnectionDelayMax: 10000,
      auth: {
        token,
      },
      query: {
        clientId,
      },
    });

    socket.on('connect_error', (err) => {
      console.log('connect_error', err.message); // prints the message associated with the error
    });
    socket.on('connect', () => {
      console.log('socket connected');
    });
  }
  return socket;
}
