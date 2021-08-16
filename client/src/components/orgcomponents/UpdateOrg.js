import React from 'react';
import FileUpload from '../FileUpload';
import { Button, Header,Segment,Container,Divider, Image, Modal,Grid,GridColumn,GridRow } from 'semantic-ui-react';
import UpdateOrgForm from './UpdateOrgForm';
import OrgPicUpload from './OrgPicUpload';

function UpdateOrg({orgname}) {
    
  const [open, setOpen] = React.useState(false)
  console.log(orgname)
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Update your Organization Info.</Button>}
    >
      <Modal.Header>Update</Modal.Header>
      <Modal.Content image>
          {/* //EDW PREPEI NA MPEI TO IMAGE */}
        
        <Modal.Description>
          {/* <Header>Default Profile Image</Header> */}
          <Grid>
            <GridRow>
              <GridColumn style={{width:400,left:25}}>  
                <Segment>

                <h4 style={{marginBottom:15}}>Update Your Organization's Profile Picture:</h4>
                <Image style={{marginBottom:30}} size='tiny' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
                <OrgPicUpload profilepic="1" orgname={orgname}/>
                <h4 style={{marginBottom:15}}>Update Your Organization's Cover Picture:</h4>
                <Image style={{marginBottom:30}} size='tiny' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />

                <OrgPicUpload orgname={orgname}/>

                <Divider style={{marginBottom:40}}>
                <Button  onClick={() => setOpen(false)} attached='bottom' type="submit" color="green" >
                    Upload
                </Button>
                </Divider>
                </Segment>
              </GridColumn>
              <GridColumn style={{left:35,width:400}}>
              <Segment>

                  <h4 style={{marginBottom:25}}>Update Your Organization's Information</h4>
                 <UpdateOrgForm />
                 </Segment>

              </GridColumn>
          </GridRow>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      {/* <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions> */}
    </Modal>
  )
}

export default UpdateOrg