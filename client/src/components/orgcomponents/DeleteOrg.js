import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_ORGANIZATIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function OrgDeleteButton({ orgId, callback ,username}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = DELETE_ORG_MUTATION;
  console.log(username,"username sto delete org")
  const [deleteOrg] = useMutation(mutation, {
    //otan mpei sto update simainei oti to post exei diagraftei epityxws
    update(proxy) {
      setConfirmOpen(false);
      if (orgId) {
        const data = proxy.readQuery({
            query: FETCH_ORGANIZATIONS_QUERY,
          });
          proxy.writeQuery({
            query: FETCH_ORGANIZATIONS_QUERY,
            data: {
              getOrganizations: data.getOrganizations.filter(p => p.id !== orgId)
            }
          });

          const data2 = proxy.readQuery({
            query: FETCH_ORGANIZATIONS_OWNER_QUERY,
            variables: { orgOwner:username },
          });
          console.log(data2,"TA DATA2")
          //console.log(data,"to data")
    
          proxy.writeQuery({
            query: FETCH_ORGANIZATIONS_OWNER_QUERY,
            variables: { orgOwner:username },
            data: {
              getOrganizationsbyOwner: data2.getOrganizationsbyOwner.filter(p => p.id !== orgId)
            }
        })
      }
      if (callback) callback();
    },
    variables: {
      orgId
    }
  });
  return (
    <>
      <MyPopup content={'Delete Organization'}>
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
        onConfirm={deleteOrg}
      />
    </>
  );
}

const DELETE_ORG_MUTATION = gql`
  mutation deleteOrg($orgId: ID!) {
    deleteOrg(orgId: $orgId)
  }
`;
const FETCH_ORGANIZATIONS_OWNER_QUERY = gql`
query($orgOwner:String!){  
getOrganizationsbyOwner(orgOwner:$orgOwner){
    id
        orgName
        orgDescription
  orgLocationLat
  orgLocationLong
  orgType
  orgOwner{
  username id 
  }
  donations{
    username
    donateDate
  }
  profilePic
}
}
`;

export default OrgDeleteButton;