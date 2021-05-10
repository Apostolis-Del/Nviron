import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ACTIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function ActDeleteButton({ actId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_ACTCOMMENT_MUTATION : DELETE_ACTION_MUTATION;

  const [deleteActorMutation] = useMutation(mutation, {
    //otan mpei sto update simainei oti to post exei diagraftei epityxws
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
            query: FETCH_ACTIONS_QUERY,
          });
          proxy.writeQuery({
            query: FETCH_ACTIONS_QUERY,
            data: {
              getActions: data.getActions.filter(p => p.id !== commentId)
            }
          });
      }
      if (callback) callback();
    },
    variables: {
      actId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
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
        onConfirm={deleteActorMutation}
      />
    </>
  );
}

const DELETE_ACTION_MUTATION = gql`
  mutation deleteAct($actId: ID!) {
    deleteAct(actId: $actId)
  }
`;

const DELETE_ACTCOMMENT_MUTATION = gql`
  mutation deleteActComment($actId: ID!, $commentId: ID!) {
    deleteActComment(actId: $actId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default ActDeleteButton;