import React,{useContext} from 'react';
import {Card,Icon,Label,Image,Button,Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

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
                {//edw tsekare ean o user einai o idioktitis tou post kai ean einai bazoume
                 //to delete button
                 user && user.username === orgOwner && <DeleteButton postId={id}/>}
            </Card.Content>
        </Card>
    );
}
export default OrganizationCard;