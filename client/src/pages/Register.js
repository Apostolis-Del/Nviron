import React,{useContext,useState} from 'react';
import {Button,Form} from 'semantic-ui-react';
import {useMutation} from '@apollo/client';
import '../App.css'
import gql from 'graphql-tag';
import { useForm } from '../util/hooks';
import {AuthContext} from '../context/auth';

function Register(props) {

    const context=useContext(AuthContext);

    const[errors,setErrors]=useState({});

    const initialState ={
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    }

    const{ onChange,onSubmit,values} =useForm(registerUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [addUser,{loading}] = useMutation(REGISTER_USER,{
        update(_,{data:{register:userData}}){
            //console.log(result)
            context.login(userData);
            //redirect to home page
            props.history.push('/')
        },
        onError(err){
            //console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables:values
    })

    //auto to function voithaei gia na anagnwrizetai to addUser apo to useMutation sto useForm
    //giati an to baloume apo panw den anagnwrizetai to addUser alla an to baloume apo katw
    //den anagnwrizonte ta variables
    //diladi na einai mesa sto scope
    function registerUser(){
        //bazoume to addUser edw kai to pairname san callback sto userForm
        //sto opoio prin eixame san callback to addUser
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading?"loading":''}>
                <h1>Register</h1>
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
                    Register
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
        </div>
    );
}
const REGISTER_USER=gql`
        mutation register(
            $username:String!
            $email:String!
            $password:String!
            $confirmPassword:String!
        ){
            register(
                registerInput:{
                    username:$username
                    email:$email
                    password:$password
                    confirmPassword:$confirmPassword
                }
            ){
                id email username createdAt token
            }
        }
`
export default Register;