import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ACTIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function DeleteAct({ actId, callback,username}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = DELETE_ACT_MUTATION;
  console.log(username,"tousername2")
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

          const data2 = proxy.readQuery({
            query: FETCH_ACTIONS_OWNER_QUERY,
            variables: { username:username },
          });
          console.log(data2,"TA DATA2")
          //console.log(data,"to data")
    
          proxy.writeQuery({
            query: FETCH_ACTIONS_OWNER_QUERY,
            variables: { username:username },
            data: {
              getActionbyOwner: data2.getActionbyOwner.filter(p => p.id !== actId)
            }
        })
        //console.log("ta data2 meta",data2)  
           //values.body = '';
        
          
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

const FETCH_ACTIONS_OWNER_QUERY = gql`
query($username:String!){
 getActionbyOwner(username:$username){
   id actName actDescription actLocationLat actLocationLong actType 
         actOwner{
             username
         }
         commentCount
         likeCount
         likes{
             username
         }
         comments{
             id username createdAt body
         }
         startDate
         endDate
      }
}

`;
export default DeleteAct;