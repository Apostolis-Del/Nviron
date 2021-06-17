import React,{useContext} from 'react';
import {Card,Icon,Label,Image,Button,Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import gql from 'graphql-tag';
import {AuthContext} from '../../context/auth';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../util/MyPopup';
import DeleteOrg from './DeleteOrg';
import { useQuery } from '@apollo/react-hooks';

import SubscribeOrgButton from './SubscribeOrgButton';

function OrganizationCard({org:{orgName,orgDescription,orgOwner,id}}){

    const {user} = useContext(AuthContext);

    // const forskip=user?false:true
    // //FOR SUBSORGS
    // console.log(forskip)

    // const { loading, data } = useQuery(FETCH_SUBSCRIBEDORGS_QUERY,{
        
    //     skip:forskip,
    //     variables:{
    //         username:user.username
    //     }
    // });
    // //edw ginetai destructure ta posts (to ? legetai ternary)
    // const {getSubscribedOrgs: suborgs } = data ? data : [];
    // console.log(suborgs,"ta sub orgssto orgcard")


   
    return(
        <>
         {/* {loading?(
            <h1>Loading Organizations</h1>
        ):(  */}
        <Card fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                />
                <Card.Header>{orgName}</Card.Header>
                
                <Card.Description>
                    {orgDescription}    
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button labelPosition='right' as={Link} to={`/organizations/${id}`}>
                            <Button basic color='green'>
                                Go to {orgName}'s Page
                            </Button>
                </Button>
                {user&&
                <SubscribeOrgButton user={user} orgName={orgName} orgId={id} 
                // subscribedorgs={suborgs}
                />
                    }
                {
                 user && user.username === orgOwner.username && <DeleteOrg orgId={id}/>}
            </Card.Content>
        </Card>
         {/* )
        } */}
        </> 
    );
                
}

const FETCH_SUBSCRIBEDORGS_QUERY= gql`
   query($username:String!){
        getSubscribedOrgs(username:$username){
            subscribed{
                orgName id
            }
        }
}
`
export default OrganizationCard;