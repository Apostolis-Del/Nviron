import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { useMutation,useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';
import MyPopup from '../../util/MyPopup';
import {AuthContext} from '../../context/auth';


function SubscribeOrgButton( {user,orgName,orgId,subscribedorgs}) {

    //const {user} = useContext(AuthContext);


  const [subscribed, setSubscribed] = useState(false);


    const { loading, data } = useQuery(FETCH_SUBSCRIBEDORGS_QUERY,{
        variables:{
            username:user.username
        }
      });

    const {getSubscribedOrgs: suborgs } = data ? data : [];
    console.log(suborgs,"ta sub orgs")
    
  //useEffect is used for Data fetching, setting up a subscription, and manually changing the DOM in React components
  //einai to idio me componentdidMount klp
  //stin ousia edw ean o user exei kanei hdh like se ena post
  var subscribedorgs;
  if(suborgs){
    subscribedorgs=suborgs.subscribed
  }else{
    subscribedorgs=[]
  }
  useEffect(() => {
       //if(!loading){
            if (user && subscribedorgs.find((d) => d.orgName === orgName)) {
            setSubscribed(true);
            } else setSubscribed(false);
         //}
  }, [user, subscribedorgs]);

  
  const [SubscribeFunction] = useMutation(SUBSCRIBE_TO_ORG, {
    variables: { orgId: orgId },
    
        update(proxy, result) {
          const data = proxy.readQuery({
            query: FETCH_SUBSCRIBEDORGS_QUERY,
            variables:{
              username:user.username            
            }
          });
          //console.log(result);
          //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
          proxy.writeQuery({
            query: FETCH_SUBSCRIBEDORGS_QUERY,
            data: {
              ...subscribed,
              [subscribed]: [...subscribed[orgName],orgName]
            },
            variables:{
              username:user.username            
            }
        });   
        }
      
    
  });

  //edw tsekare ean o user exei kanei hdh like gia na allaksei to liked kai tsekare episis
  //ean o user einai syndedemenos alliws ton kanei redirect sto login page
  const SubscribeOrgButton = user ? (
    subscribed ? (
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

  const forreturn=(
       <>
         {!loading &&
      <Button as="div" labelPosition="right" onClick={SubscribeFunction}>
      <MyPopup content={subscribed ? 'Unsubscribe' : 'Subscribe'}>{SubscribeOrgButton}</MyPopup>
      {/* <Label basic color="green" pointing="left">
          {likeCount}
      </Label> */}
      </Button>
             }
     </>
  )
  return (
    forreturn
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

const SUBSCRIBE_TO_ORG= gql`
mutation subscribeOrg($orgId:ID!){
    subscribeOrg(orgId:$orgId){
    id
    email
    username
    subscribed{
      orgName
      orgDescription
      orgLocationLat
      orgLocationLong
      orgType
    }
    
  }
}
`

export default SubscribeOrgButton;