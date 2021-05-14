import React from 'react';
import FileUpload from './FileUpload';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

function ProfilePicture() {
    
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Upload a New Profile Picture.</Button>}
    >
      <Modal.Header>Upload your Profile Picture</Modal.Header>
      <Modal.Content image>
          {/* //EDW PREPEI NA MPEI TO IMAGE */}
        <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <FileUpload profilepic="1" />

        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
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
      </Modal.Actions>
    </Modal>
  )
}

export default ProfilePicture