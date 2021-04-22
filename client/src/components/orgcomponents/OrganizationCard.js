import React,{useContext} from 'react';
import {Card,Icon,Label,Image,Button,Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/auth';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';
import MyPopup from '../../util/MyPopup';
import DeleteOrg from './DeleteOrg';

function OrganizationCard({org:{orgName,orgDescription,orgOwner,id}}){

    //kanoume extract ton user
    const {user} = useContext(AuthContext);

    function likePost(){
        console.log("liked post")
    }
    function commentPost(){
        console.log("commented post")
    }
    return(
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
            {/* <LikeButton user ={user} post={{id,likes,likeCount}}/>
                    {
                        //bgazei ena thema me dom nesting edw
                    }
                <MyPopup content="Comment on Post">
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                            <Button basic color='blue'>
                                <Icon name='comments' />
                                Comment
                            </Button>
                            <Label as='a' basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                </MyPopup> */}
                {//edw tsekare ean o user einai o idioktitis tou post kai ean einai bazoume
                 //to delete button
                 user && user.username === orgOwner.username && <DeleteOrg orgId={id}/>}
            </Card.Content>
        </Card>
    );
}
export default OrganizationCard;