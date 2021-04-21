import React, { useContext, useEffect, useState } from 'react';
import getSocket from '../socket';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import Header from './Header';
import Main from './Main';
import { getClient } from '../stores/client/clientActions';
import { connect } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { isClientLoadFailed, getClientId } from '../stores/client/clientSelectors';
import Modal from 'react-bootstrap/Modal';
import { EnvironmentContext } from '../context';

function App({ getClient, isClientLoadFailed, clientId }) {
  const { getAccessTokenSilently, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [show, setShow] = useState(isClientLoadFailed);
  const [token, setToken] = useState(null);
  const context = useContext(EnvironmentContext);
  const [socket, setSocket] = useState();
  const handleShow = () => setShow(true);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        await loginWithRedirect();
      }
      try {
        const tkn = await getAccessTokenSilently({
          audience: context.authAudience,
          scope: 'read:oncoming',
        });
        setToken(tkn);
        getClient(tkn);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isAuthenticated, getClient, setToken, loginWithRedirect, getAccessTokenSilently, context]);

  useEffect(() => {
    setSocket(getSocket(token, clientId));
  }, [clientId, token]);

  useEffect(() => {
    isClientLoadFailed && handleShow(isClientLoadFailed);
  }, [isClientLoadFailed]);

  if (!isAuthenticated || !socket) {
    return null;
  }

  return (
    <div>
      <Header />
      <Main />
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Заклад за знайдено</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ваш акаунт не закріплений за закладом. Попросіть адміністратора додати ваш обліковий запис <b>{user.email}</b>{' '}
          до закладу.
        </Modal.Body>
      </Modal>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getClient: (token) => dispatch(getClient(token)),
});

export default connect(
  (state) => ({
    isClientLoadFailed: isClientLoadFailed(state),
    clientId: getClientId(state),
  }),
  mapDispatchToProps,
)(App);
