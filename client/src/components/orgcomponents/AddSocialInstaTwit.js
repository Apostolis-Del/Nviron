import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm,Form,Modal, Icon,Image,Header, Popup } from 'semantic-ui-react';

import { FETCH_ORGANIZATIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function AddSocialInstaTwit({ instagram, orgname,orgId, twitter }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [link, setLink] = useState(null);

    const [open, setOpen] = React.useState(false)

    const values=[];

      const onSubmit = async (e) => {
        e.preventDefault();
          if(instagram){
              values.instagramlink=link
              values.orgname=orgname
          }
          if(twitter){
            values.twitterlink=link
            values.orgname=orgname
        }
          addSocial();
        
      }
    const mutation = instagram ? ADD_INSTAGRAM : ADD_TWITTER;
    const [addSocial] = useMutation(mutation, {
      
      variables:values
      
      ,
      //otan mpei sto update simainei oti to post exei diagraftei epityxws
      update(proxy, result) {
        const data = proxy.readQuery({
          query: FETCH_SINGLEORG_QUERY,
          variables:{
            orgId:orgId
          }
        });
        console.log(result,"TO GAM RESUTLTT");

        if(instagram){
                proxy.writeQuery({
                query: FETCH_SINGLEORG_QUERY,
                data: {
                  getOrganization: result.data.addInstagram.instagramLink,   ...data.getOrganization
                },
                variables:{
                  orgId
              }
            }); 
         }

        if(twitter){
                proxy.writeQuery({
                query: FETCH_SINGLEORG_QUERY,
                data: {
                    getOrganization: result.data.addTwitter.twitterLink, ...data.getOrganization
                },
                variables:{
                  orgId
              }
            }); 
         } 
         values.twitterLink = '';
         values.instagramLink = '';

      }
      
  });
 
  return (
    <>
      {/* <MyPopup content={'Update Social Media'}>
        <Button
          as="div"
          color="green"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="edit" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={addSocial}
      /> */}
  <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button icon>
        <Icon name="edit"/>
      </Button>}
    >
      <Modal.Header>Update your {instagram&&(
            <h2>Instagram</h2>
            )}
        {twitter&&(
            <h2>Twitter</h2>
            )}</Modal.Header>
      <Modal.Content >
        
      </Modal.Content>
      <Form onSubmit={onSubmit}>
          {instagram&&(
            <h2>Add your Instagram:</h2>
            )}
        {twitter&&(
            <h2>Add your Twitter:</h2>
            )}
        <Form.Field>
          <Form.Input
            placeholder=""
            name="body"
            onChange={(e) => setLink(e.target.value)}         
            value={values.body}
          />
          <Button type="submit" color="green">
            Add
          </Button>
        </Form.Field>
      </Form>
    </Modal>

      

    </>
  );
}


const ADD_TWITTER = gql`
  mutation addTwitter($orgname: String! $twitterlink:String!) {
    addTwitter(orgname: $orgname twitterlink:$twitterlink){
        orgName
        twitterLink
    }
  }
`;

const ADD_INSTAGRAM = gql`
  mutation addInstagram($instagramlink:String! $orgname: String! ) {
    addInstagram(orgname: $orgname instagramlink:$instagramlink){
        orgName
        instagramLink
    }
  }
`;

const FETCH_SINGLEORG_QUERY=gql`
    query($orgId:ID!){
        getOrganization(orgId:$orgId){
            id
            orgName
            orgDescription
            orgLocationLat
            orgType
            orgLocationLong
            orgOwner{
                id username
            }
            donations{
                username
                donateDate
            }
            instagramLink
            facebookLink
            youtubeLink
            twitterLink
        }
    }
`;

export default AddSocialInstaTwit;