import React,{useContext} from 'react';
import {Card,Icon,Label,Image,Button,Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/auth';
import ActLikeButton from './ActLikeButton';
import DeleteAct from './DeleteAct';
import MyPopup from '../../util/MyPopup';

function ActionCard({act:{id,actName,actDescription,actLocationLat,actLocationLong,actType,likes,likeCount,commentCount,actOwner}}){

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
                <Card.Header>{actName}</Card.Header>
                {//EDW PREPEI NA MPEI LINK STO ACTS/:ID
                }
                { <Card.Meta as={Link} to={`/actions/${id}`}></Card.Meta> }
                <Card.Description>
                    {actDescription}    
                </Card.Description>
            </Card.Content>
             <Card.Content extra>
                <ActLikeButton user ={user} action={{id,likes,likeCount}}/>
                    {
                        //bgazei ena thema me dom nesting edw
                    }
                <MyPopup content="Comment on Post">
                    <Button labelPosition='right' as={Link} to={`/actions/${id}`}>
                            <Button basic color='blue'>
                                <Icon name='comments' />
                                Comment
                            </Button>
                            <Label as='a' basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                </MyPopup>

                {//edw tsekare ean o user einai o idioktitis tou post kai ean einai bazoume to delete button
                 user && user.username === actOwner.username && <DeleteAct actId={id}/>}
            </Card.Content> 
        </Card>
    );
}
export default ActionCard;