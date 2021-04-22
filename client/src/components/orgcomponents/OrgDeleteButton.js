import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ORGPOSTS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function OrgDeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_ORGCOMMENT_MUTATION : DELETE_ORGPOST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    //otan mpei sto update simainei oti to post exei diagraftei epityxws
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
            query: FETCH_ORGPOSTS_QUERY,
          });
          proxy.writeQuery({
            query: FETCH_ORGPOSTS_QUERY,
            data: {
              getOrgPosts: data.getOrgPosts.filter(p => p.id !== postId)
            }
          });
      }
      if (callback) callback();
    },
    variables: {
      postId,
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
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_ORGPOST_MUTATION = gql`
  mutation deleteOrgPost($postId: ID!) {
    deleteOrgPost(postId: $postId)
  }
`;

const DELETE_ORGCOMMENT_MUTATION = gql`
  mutation deleteOrgComment($postId: ID!, $commentId: ID!) {
    deleteOrgComment(postId: $postId, commentId: $commentId) {
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

export default OrgDeleteButton;