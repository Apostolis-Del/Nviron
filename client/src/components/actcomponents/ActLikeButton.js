import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';
import MyPopup from '../../util/MyPopup';

function ActLikeButton({ user, action: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
 
  //useEffect is used for Data fetching, setting up a subscription, and manually changing the DOM in React components
  //einai to idio me componentdidMount klp
  //stin ousia edw ean o user exei kanei hdh like se ena post 
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  //
  const [likeAct] = useMutation(LIKE_ACT_MUTATION, {
    variables: { actId: id }
  });

  //edw tsekare ean o user exei kanei hdh like gia na allaksei to liked kai tsekare episis
  //ean o user einai syndedemenos alliws ton kanei redirect sto login page
  const likeButton = user ? (
    liked ? (
      <Button color="green">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="green" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="green" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likeAct}>
      <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>
      <Label basic color="green" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_ACT_MUTATION = gql`
  mutation likeAct($actId: ID!) {
    likeAct(actId: $actId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default ActLikeButton;