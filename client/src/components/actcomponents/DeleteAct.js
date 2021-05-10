import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ACTIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function DeleteAct({ actId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = DELETE_ACT_MUTATION;

  const [DeleteAct] = useMutation(mutation, {
    //otan mpei sto update simainei oti to post exei diagraftei epityxws
    update(proxy) {
      setConfirmOpen(false);
      if (actId) {
        const data = proxy.readQuery({
            query: FETCH_ACTIONS_QUERY,
          });
          proxy.writeQuery({
            query: FETCH_ACTIONS_QUERY,
            data: {
              getActions: data.getActions.filter(p => p.id !== actId)
            }
          });
      }
      if (callback) callback();
    },
    variables: {
      actId
    }
  });
  return (
    <>
      <MyPopup content={'Delete Action'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={DeleteAct}
      />
    </>
  );
}

const DELETE_ACT_MUTATION = gql`
  mutation deleteAct($actId: ID!) {
    deleteAct(actId: $actId)
  }
`;


export default DeleteAct;