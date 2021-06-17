import React,{useContext} from 'react';
import {Card,Icon,Label,Image,Button,Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/auth';
import OrgLikeButton from './OrgLikeButton';
import OrgDeleteButton from './OrgDeleteButton';
import MyPopup from '../../util/MyPopup';

function SubscribedOrgs({orgpost:{body,orgname,createdAt,id,username,likeCount,commentCount,likes},orgName}){

     //kanoume extract ton user
     const {user} = useContext(AuthContext);

     function likePost(){
         console.log("liked post")
     }
     function commentPost(){
         console.log("commented post")
     }
     //console.log(user.username);
     //console.log(username);
     return(
         <Card fluid>
             <Card.Content>
                 <Image
                 floated='right'
                 size='mini'
                 src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                 />
                 <Card.Header>{orgname}</Card.Header>
                 
                 <Card.Meta as={Link} to={`/orgposts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                 <Card.Description>
                     {body}    
                 </Card.Description>
             </Card.Content>
             
             <Card.Content extra>
                 <OrgLikeButton user ={user} orgpost={{id,likes,likeCount}}/>
                     {
                         //bgazei ena thema me dom nesting edw
                     }
                 <MyPopup content="Comment on Post">
                     <Button labelPosition='right' as={Link} to={`/orgposts/${id}`}>
                             <Button basic color='blue'>
                                 <Icon name='comments' />
                                 Comment
                             </Button>
                             <Label as='a' basic color='blue' pointing='left'>
                                 {commentCount}
                             </Label>
                         </Button>
                 </MyPopup>
                 {//edw tsekare ean o user einai o idioktitis tou post kai ean einai bazoume
                  //to delete button
                  user && user.username === username && <OrgDeleteButton postId={id} orgName={orgName}/>}
             </Card.Content>
         </Card>
     );
 }

 const FETCH_SUBSCRIBEDORGS_QUERY= gql`
    query($username:String!){
        getSubscribedOrgs(username:$username){
            subscribed
        }
`

const FETCH_ORGPOST_BYNAME= gql`
    query($orgname:String!){
        getOrgPostsByName(orgname:$orgname){
            id
            body
            username
                createdAt
            orgname
            likes {
                username
            }
            commentCount
            likeCount
            comments {
                id
                username
                createdAt
                body
            }
        }
`
 export default SubscribedOrgs;