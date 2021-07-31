import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm,Form,Modal, Icon,Image,Header, Popup } from 'semantic-ui-react';

import { FETCH_ORGANIZATIONS_QUERY } from '../../util/graphql';
import MyPopup from '../../util/MyPopup';

function AddSocialFaceYou({ facebook, orgname,orgId, youtube }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [link, setLink] = useState(null);

    const [open, setOpen] = React.useState(false)

    const values=[];

      const onSubmit = async (e) => {
        e.preventDefault();
          if(facebook){
              values.facebooklink=link
              values.orgname=orgname
          }
          if(youtube){
            values.youtubelink=link
            values.orgname=orgname
        }
          addSocial();
        
      }
    const mutation = facebook ? ADD_FACEBBOK : ADD_YOUTUBE;
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

        if(facebook){
                proxy.writeQuery({
                query: FETCH_SINGLEORG_QUERY,
                data: {
                  getOrganization: result.data.addfacebook.facebookLink,   ...data.getOrganization
                },
                variables:{
                  orgId
              }
            }); 
         }

        if(youtube){
                proxy.writeQuery({
                query: FETCH_SINGLEORG_QUERY,
                data: {
                    getOrganization: result.data.addYoutube.youtubeLink, ...data.getOrganization
                },
                variables:{
                  orgId
              }
            }); 
         } 
         values.youtubeLink = '';
         values.facebookLink = '';

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
      <Modal.Header>Update your {facebook&&(
            <h2>Facebook</h2>
            )}
        {youtube&&(
            <h2>Youtube</h2>
            )}</Modal.Header>
      <Modal.Content >
        
      </Modal.Content>
      <Form onSubmit={onSubmit}>
          {facebook&&(
            <h2>Add your Facebook:</h2>
            )}
        {youtube&&(
            <h2>Add your Youtube:</h2>
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


const ADD_YOUTUBE = gql`
  mutation addYoutube($orgname: String! $youtubelink:String!) {
    addYoutube(orgname: $orgname youtubelink:$youtubelink){
        orgName
        youtubeLink
    }
  }
`;

const ADD_FACEBBOK = gql`
  mutation addFacebook($facebooklink:String! $orgname: String! ) {
    addFacebook(orgname: $orgname facebooklink:$facebooklink){
        orgName
        facebookLink
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

export default AddSocialFaceYou;