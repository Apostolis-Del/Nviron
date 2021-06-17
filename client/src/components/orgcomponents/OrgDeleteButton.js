import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ORGPOSTS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function OrgDeleteButton({ postId, commentId, callback ,orgName}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_ORGCOMMENT_MUTATION : DELETE_ORGPOST_MUTATION;
  
  const orgName2=orgName;
  console.log(orgName2)
  const [deletePostOrMutation] = useMutation(mutation, {
    //otan mpei sto update simainei oti to post exei diagraftei epityxws
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
            query: FETCH_SINGLEORGPOST_QUERY,
            variables:{
              orgname:orgName2
            }
          });
          console.log(data,"ta data")
          proxy.writeQuery({
            query: FETCH_SINGLEORGPOST_QUERY,
            data: {
              //getOrgPostsByName: data.getOrgPostsbyName.filter(p => p.id !== postId)
              getOrgPostsByName: data.getOrgPostsByName.filter(p => p.id !== postId)
            },
            variables:{
              orgname:orgName2
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

const FETCH_SINGLEORGPOST_QUERY= gql`
    query($orgname:String!){
        getOrgPostsByName(orgname:$orgname){
            id
            body
            username
            createdAt
            comments{
                id username
            }
            likes{
                username
            }
            likeCount
            commentCount
        }
    }
`;
export default OrgDeleteButton;