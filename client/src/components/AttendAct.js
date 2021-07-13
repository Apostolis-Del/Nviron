import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';

function AttendAct({ user, act: { id, attendedUsername,attendCount } }) {
  const [attended, setAttended] = useState(false);
 
  //useEffect is used for Data fetching, setting up a subscription, and manually changing the DOM in React components
  //einai to idio me componentdidMount klp
  //stin ousia edw ean o user exei kanei hdh like se ena post 
  useEffect(() => {
    if (user && attendedUsername.find((attend) => attend.username === user.username)) {
      setAttended(true);
    } else setAttended(false);
  }, [user, attendedUsername]);

  //
  const [AttendAct] = useMutation(ATTEND_ACT_MUTATION, {
    variables: { actId: id }
  });

  //edw tsekare ean o user exei kanei hdh like gia na allaksei to liked kai tsekare episis
  //ean o user einai syndedemenos alliws ton kanei redirect sto login page
  const AttendActButton = user ? (
    attended ? (
      <Button color="green">
        <Icon name="user times" />
      </Button>
    ) : (
      <Button color="green" basic>
        <Icon name="user plus" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="green" basic>
      <Icon name="user plus" />
    </Button>
  );

  return (
    <>
    <Button as="div" labelPosition="right" onClick={AttendAct}>
      <MyPopup content={attended ? 'Cancel Attend' : 'Attend'}>{AttendActButton}</MyPopup>
      
    </Button>
    <h2 basic color="green" pointing="left">
      <h3>Other people attending this action:</h3>
    {attendedUsername && attendedUsername.map(attend=>
      (<h3>{attend.username}</h3>))}
    {attendCount}
  </h2>
  </>
  );
}

const ATTEND_ACT_MUTATION = gql`
  mutation attendToAct($actId: ID!) {
    attendToAct(actId: $actId) {
      id
      attendedUsername {
        username
      }
      attendCount
    }
  }
`;

export default AttendAct;