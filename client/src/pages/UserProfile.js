import {AuthContext} from '../context/auth';
import React,{useContext,useState}  from 'react';
import {useMutation} from '@apollo/client';
import ProfilePicture from '../components/ProfilePicture';
import { Grid,Transition,Form,Button,Error, Card,Icon,GridColumn, Header,Image,Container,Segment,Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import moment from 'moment';
import { useForm } from '../util/hooks';

function UserProfile(props){
    //const {user,logout}=useContext(AuthContext);
    const context=useContext(AuthContext);
    //console.log(context.user.username)
    const[errors,setErrors]=useState({});

    const{ onChange,onSubmit,values} =useForm(updateUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [addUser,{loading}] = useMutation(UPDATE_USER,{
        update(_,{data:{updateUser:userData}}){
            console.log(userData)
            props.history.push('/')
            context.logout();
            console.log("after logout")
            // localStorage.setItem('userinfo', userData.username);

            // setTimeout(function() {
            //     //your code to be executed after 1 second
            //     context.login(userData);

            //   }, 5000)

            console.log("after login")
            //redirect to home page
            console.log("after push")
        },
        onError(err){
            //console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err&&err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
        },
        variables:values
    })
    console.log(context.user)
    function updateUser(){
        addUser();
    }
    return(
       <>
        <Grid>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Card>
                    {context.user.profilePic?(
                    <Image src={context.user.profilePic} />
                    ):(
                        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    )}
                    
                    <Card.Content>
                    <Card.Header>{context.user.username}</Card.Header>
                    <Card.Meta>
                        <span className='date'>{moment(context.user.createdAt).fromNow(true)}</span>
                    </Card.Meta>
                    <Card.Description>
                            DESCRIPTION
                    </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        
                    </Card.Content>
                </Card>
                <ProfilePicture />
                </Grid.Column>

                <Grid.Column>
                    <h3>Update Your Profile:</h3>
                <Form onSubmit={onSubmit} noValidate>
                        <Form.Input 
                            label="Username"
                            placeholder="Username.."
                            name="username"
                            type="text"
                            value={values.username}
                            error={errors.username ? true : false}
                            onChange={onChange}
                        />
                        <Form.Input 
                            label="Email"
                            placeholder="Email.."
                            name="email"
                            type="email"
                            value={values.email}
                            error={errors.email ? true : false}
                            onChange={onChange}
                        />
                        <Form.Input 
                            label="Password"
                            placeholder="Password.."
                            name="password"
                            type="password"
                            value={values.password}
                            error={errors.password ? true : false}
                            onChange={onChange}
                        />
                        <Form.Input 
                            label="Confirm Password"
                            placeholder="Confirm Password.."
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            error={errors.confirmPassword ? true : false}
                            onChange={onChange}
                        />
                        <Button type="submit" color="green">
                            Update
                        </Button>
                    </Form>
                    {Object.keys(errors).length>0 &&(
                        <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(value=>(
                                <li key={value}>{value}</li>
                            ))}
                        </ul>
                    </div>
                    )}
                    <h4>You need to login again with your new credentials.</h4>

             </Grid.Column>
             </Grid.Row>

        </Grid>
    </>
        
    )
}
const UPDATE_USER =gql`
    mutation($username:String!,$email:String!,$password:String!,$confirmPassword:String!){
        updateUser(updateInput:{username:$username, email:$email, password:$password, confirmPassword:$confirmPassword}){
            id email username createdAt token profilePic
        }
    }
`


export default UserProfile