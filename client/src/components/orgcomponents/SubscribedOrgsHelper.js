import React,{useContext} from 'react';
import { useQuery, gql } from '@apollo/client';
import {Transition,Grid} from 'semantic-ui-react'
import OrgPostCard from './OrgPostCard';
import SubscribedOrgs from './SubscribedOrgs'


function SubscribedOrgsHelper({user}){


    //FOR SUBSCRIBEDORGS
    const { loading, data } = useQuery(FETCH_SUBSCRIBEDORGS_QUERY,{
        variables:{
            username:user.username
        }
      });

    const {getSubscribedOrgs: suborgs } = data ? data : [];
    console.log(suborgs,"ta sub orgs helpererrrrrr")

    
    var subscribedarray=[]
    var subscribedorgs;
    if(suborgs){
      subscribedorgs=suborgs.subscribed
      
    }else{
      subscribedorgs=[]
    }
    console.log(subscribedorgs)
     return(
         <>
         <Grid columns={3} divided>
                <Grid.Row>
         {!loading&&(
            
                    <Transition.Group>
                        {
                            subscribedorgs && subscribedorgs.map(subscribed=>
                                
                                <Grid.Column style={{marginBottom:60}}>
                                <SubscribedOrgs subscribed={subscribed} />
                                </Grid.Column>
                            
                            )
                        }
                    </Transition.Group>
               

         )}
         </Grid.Row>
            </Grid>
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

 export default SubscribedOrgsHelper;