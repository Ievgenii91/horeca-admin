import React, { useContext, useEffect, useState } from 'react';
import getSocket from '../socket';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/App.css';
import Header from './Header';
import Main from './Main';
import { getClient, setClient } from '../stores/client/clientActions';
import { connect } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import {
  isClientLoadFailed,
  getClientId,
  showSelectClientModal,
  getClientsMetaData,
} from '../stores/client/clientSelectors';
import Modal from 'react-bootstrap/Modal';
import { EnvironmentContext } from '../context';

function App({ getClient, setClient, isClientLoadFailed, clientId, showSelectClientModal, clientsMetaData = [] }) {
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

  const selectClient = (index) => {
    setClient({ id: clientsMetaData[index]?.id, token });
  };

  if (!isAuthenticated || !socket) {
    if (showSelectClientModal) {
      return (
        <Modal show={true}>
          <Modal.Header>
            <Modal.Title>Оберіть свій заклад</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Ваш акаунт закріплений задекількома закладами, оберіть з яким будете працювати у поточній сессії.</p>
            {clientsMetaData.map((v, index) => {
              return (
                <p key={'s432' + index}>
                  <button
                    className="p-0 m-0 btn btn-link"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      selectClient(index);
                    }}
                  >
                    {v.name}
                  </button>
                </p>
              );
            })}
          </Modal.Body>
        </Modal>
      );
    }
    return (
      <div>
        <Header hide={true} />
      </div>
    );
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
  setClient: (id) => dispatch(setClient(id)),
});

export default connect(
  (state) => ({
    isClientLoadFailed: isClientLoadFailed(state),
    clientId: getClientId(state),
    showSelectClientModal: showSelectClientModal(state),
    clientsMetaData: getClientsMetaData(state),
  }),
  mapDispatchToProps,
)(App);
