import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { refreshTexts, updateTexts } from '../stores/client/clientActions';
import { getTexts } from '../stores/client/clientSelectors';

function AdminContainer({ updateTexts, texts, refreshTexts }) {
  let { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let t = await getAccessTokenSilently();
        setToken(t);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  function handleChange(key, value) {
    // TODO: add throttle
    refreshTexts({ key, value });
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Button
          variant="primary"
          onClick={(e) => {
            //submit
            updateTexts(texts, token);
          }}
        >
          Зберегти
        </Button>
      </div>
      <div className="row mt-2">
        {texts &&
          Object.keys(texts).map((key, index) => {
            return (
              <div className="col-12" key={index}>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>{key}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    as="textarea"
                    aria-label="With textarea"
                    defaultValue={texts[key] || ''}
                    onChange={(e) => handleChange(key, e.currentTarget.value)}
                  />
                </InputGroup>
              </div>
            );
          })}
      </div>
    </div>
  );
}
//
// const mapDispatchToProps = dispatch => ({
//     updateTexts: (data) => dispatch(updateTexts(data)),
//     refreshTexts: (data) => dispatch(refreshTexts(data))
// })

export default connect(
  (state) => ({
    texts: getTexts(state),
  }),
  {
    updateTexts,
    refreshTexts,
  },
)(AdminContainer);
