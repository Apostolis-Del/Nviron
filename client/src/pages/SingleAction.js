import React,{useContext,useState,useRef} from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation} from '@apollo/react-hooks';
import { Button,Icon,Label,Image, Segment,Card, Grid,Form } from 'semantic-ui-react';
import ActLikeButton from '../components/actcomponents/ActLikeButton';
import moment from 'moment';
import {AuthContext} from '../context/auth';
import DeleteAct from '../components/actcomponents/DeleteAct';
import MyPopup from '../util/MyPopup';
import ActDeleteButton from '../components/actcomponents/ActDeleteButton';
import SingleActMap from '../components/SingleActMap';
import AttendAct from '../components/AttendAct';

function SingleAction(props){

    //edw bazei sto postId tin timi tou post pou yparxei stin grammi tou url
    const actId = props.match.params.actId;
    
    const{user} = useContext(AuthContext);

    const commentInputRef=useRef(null);

    const [comment,setComment] = useState('');

    // const users={
    //     username:userpics.username,
    //     profilepic:userpics.profilePic
    // }
    // console.log(users);
    //epeidi theloume to field tou getPost dinoume sto data to alias getPost, to name getPost diladi
    const {data:{getAction}={}} = useQuery(FETCH_ACTION_QUERY,{
        variables:{
            actId
        }
    })
    console.log(getAction);
    const [submitComment] = useMutation(SUBMIT_ACTCOMMENT_MUTATION,{
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            actId,
            body: comment
        }
     });

    function deleteActionCallback(){
        props.history.push('/');
    }

    //let epeidi einai conditional
    let postMarkup;
    if(!getAction){
        //perimenoume na fortosei, mporoume na balooume kai kyklo pou gyrnaei
        postMarkup = <p>Loading Action.....</p>
    }else{
        const { id ,actName ,startDate,endDate,actDescription, actLocationLat, actLocationLong,actType,actOwner ,commentCount ,likeCount ,likes ,comments}=getAction;
        console.log(getAction);
        postMarkup=(

            <div className="profile">
                
             <div className="profileRight">
               <div className="profileRightTop">
                 <div className="profileCover">
                   <img
                     className="profileCoverImg"
                     src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
                     alt=""
                   />
                   <img
                     className="profileUserImg"
                     src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                     alt=""
                   />
                 </div>
                 <div className="profileInfo">
                     <h2 className="profileInfoName">{actName}</h2>
                     {/* <span className="profileInfoDesc">{orgDescription}</span> */}
                 </div>
               </div>
               <div className="profileRightBottom">

               <div className="sidebar">
                <div className="sidebarWrapper">
                <Segment>

                    <h4 style={{textAlign:"center"}}> Attend to this Action:</h4> 
                                 
                        <AttendAct user={user} act={getAction} />
                        </Segment>
                        <Segment>
                            <h4>Start Date:</h4>
                            <h4>{moment(startDate).format('LLLL')}</h4>
                            <h4>Start Date:</h4>
                            <h4>{moment(endDate).format('LLLL')}</h4>

                        </Segment>
                </div>
                </div>

               <div className="feed">
                    <div className="feedWrapper">
                        
                            <Grid.Row>
                                
                                <Grid.Column width={10}>
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Header>{actName}</Card.Header>
                                            {/* <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta> */}
                                            <Card.Description>{actDescription}</Card.Description>
                                        </Card.Content> 
                                        <hr/>
                                        <Card.Content extra>
                                            <ActLikeButton user={user} action={{id,likeCount,likes}}/>
                                            <MyPopup content="Comment on post">
                                            <Button
                                                as="div"
                                                labelPosition="right"
                                                onClick={()=>console.log("comment on post")}
                                                >
                                                    <Button basic color="blue">
                                                        <Icon name="comments"/>
                                                    </Button>
                                                    <Label basic color="blue" pointing="left">
                                                        {commentCount}
                                                    </Label>
                                            </Button>
                                            </MyPopup>
                                            {user && user.username===actOwner.username &&(
                                                <DeleteAct actId={id} callback={deleteActionCallback}/>
                                            )}
                                        </Card.Content>
                                    </Card>
                                    {user && (
                                        <Card fluid>
                                            <Card.Content>
                                            <p>Post a comment</p>
                                            <Form>
                                                <div className="ui action input fuild">
                                                    <input 
                                                        type="text"
                                                        placeholder="Comment.."
                                                        value={comment}
                                                        onChange={event =>setComment(event.target.value)}
                                                        ref={commentInputRef}
                                                    />
                                                    <button type="submit"
                                                        className="ui button teal"
                                                        //ean den yparxoun comments tote tha einai disabled
                                                        disabled={comment.trim()===''}
                                                        onClick={submitComment}
                                                        >
                                                            Submit
                                                    </button>
                                                </div>
                                            </Form>
                                            </Card.Content>
                                        </Card>
                                    )}
                                    {comments.map(comment=>(
                                        <Card fluid key={comment.id}>
                                            <Card.Content>
                                                {user && user.username === comment.username &&(
                                                    <ActDeleteButton actId={id} commentId={comment.id}/>
                                                )}
                                                <Card.Header>{comment.username}</Card.Header>
                                                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                                <Card.Description>{comment.body}</Card.Description>
                                            </Card.Content>
                                        </Card>
                                    ))}  
                                </Grid.Column>
                            </Grid.Row>
                        
                     </div>
                </div>
                <div className="rightbar">
                     <div className="rightbarWrapper">
                     {/* {user && orgOwner.username===user.username &&(
                                <div style={{textAlign:"center"}}>
                                    <Segment>
                                        <UpdateOrg />
                                    </Segment>

                                 </div>)} */}
                    <Segment>
                    
                    <h3 style={{textAlign:"center"}}> Action's Information</h3> 

                        <div className="rightbarInfo">
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">

                            <h4 className="rightbarInfoKey">Description:</h4>
                            <span className="rightbarInfoValue">{actDescription}</span>
                        </div>
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">
                            <h4 className="rightbarInfoKey">Type:</h4>
                            <span className="rightbarInfoValue">{actType}</span>
                        </div>
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">
                            <h4 className="rightbarInfoKeyloc">Location:</h4>
                            <span className="rightbarInfoValue"> 
                            <SingleActMap act={getAction}/>
                                        </span>
                        </div>
                        
                        </div>
                        </Segment>
                                          
                    </div>
                </div>
            </div>
            </div>
            </div>

        )
    }
    return postMarkup;
}

const SUBMIT_ACTCOMMENT_MUTATION =gql`
    mutation($actId:ID!,$body:String!){
        createActComment(actId:$actId, body:$body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_ACTION_QUERY = gql`
    query($actId:ID!){
        getAction(actId: $actId){
            id actName actDescription actLocationLat actLocationLong actType 
            actOwner{
                username
            }
            commentCount
            likeCount
            likes{
                username
            }
            
            comments{
                id username createdAt body
            }
            attendedUsername{
                username
            }
             attendCount
             startDate
             endDate
        }
    }
`;



export default SingleAction