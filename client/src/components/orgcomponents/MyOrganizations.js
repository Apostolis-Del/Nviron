import React,{useState} from 'react';
import {  Modal,Button,Icon,Grid,Transition} from 'semantic-ui-react';
import { useQuery, gql } from '@apollo/client';

import 'mapbox-gl/dist/mapbox-gl.css';
import OrganizationCard from './OrganizationCard';

function OrgForm({userName}){

    const{loadingOrgsOwner,data: dataOrgs3 } =useQuery(FETCH_ORGANIZATIONS_OWNER_QUERY, {
        variables: { orgOwner:userName },
      });
    const{ getOrganizationsbyOwner: orgsowner} = dataOrgs3? dataOrgs3:[];
    return (
        <Modal
            trigger={<Button size='big' color='green' icon labelPosition='left'>
            <Icon name='building' />My Organizations</Button>}
            header='My Organizations'
            content='Call Benjamin regarding the reports.'
            //actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
            >
             <Modal.Header>My Organizations.</Modal.Header>
            <Modal.Content>
            <Grid columns={2} style={{marginTop:20}}divided>

            {loadingOrgsOwner?(
                <h1>Loading Your Organizations</h1>
            ):(
               <Transition.Group>
                   {
                        orgsowner && orgsowner.map(org=>(
                           <Grid.Column key={org.id} style={{marginBottom:20}}>
                              <OrganizationCard org={org} username={userName}/>
                           </Grid.Column>
                       ))
                   }
               </Transition.Group>
            )}
            </Grid>
            </Modal.Content>
            </Modal>
        
      );
}


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
export default OrgForm;