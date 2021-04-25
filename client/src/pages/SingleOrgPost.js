import React,{useContext,useState,useRef} from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation} from '@apollo/react-hooks';
import { Button,Icon,Label,Image, Card, Grid,Form } from 'semantic-ui-react';
import OrgLikeButton from '../components/orgcomponents/OrgLikeButton'
import moment from 'moment';
import {AuthContext} from '../context/auth';
import OrgDeleteButton from '../components/orgcomponents/OrgDeleteButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function SingeOrgPost(props){

    //edw bazei sto postId tin timi tou post pou yparxei stin grammi tou url
    const postId = props.match.params.postId;

    const{user} = useContext(AuthContext);

    const commentInputRef=useRef(null);

    const [comment,setComment] = useState('');

    //epeidi theloume to field tou getPost dinoume sto data to alias getPost, to name getPost diladi
    const {data:{getOrgPost}={}} = useQuery(FETCH_ORGPOST_QUERY,{
        variables:{
            postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_ORGCOMMENT_MUTATION,{
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
     });

    function deletePostCallback(){
        props.history.push('/');
    }
    //let epeidi einai conditional
    let postMarkup;
    if(!getOrgPost){
        //perimenoume na fortosei, mporoume na balooume kai kyklo pou gyrnaei
        postMarkup = <p>Loading Organization Post.....</p>
    }else{
        const {id,body,createdAt,username,orgname,comments,likes,likeCount,commentCount}=getOrgPost;

        postMarkup=(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                        size="small"
                        float="right"/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{orgname}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content> 
                            <hr/>
                            <Card.Content extra>
                                <OrgLikeButton user={user} orgpost={{id,likeCount,likes}}/>
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
                                {user && user.username===username &&(
                                    <OrgDeleteButton postId={id} callback={deletePostCallback}/>
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
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))} 
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_ORGCOMMENT_MUTATION =gql`
    mutation($postId:ID!,$body:String!){
        createOrgComment(postId:$postId, body:$body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

const FETCH_ORGPOST_QUERY = gql`
    query($postId:ID!){
        getOrgPost(postId: $postId){
            id body createdAt username likeCount orgname
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`;


export default SingeOrgPost