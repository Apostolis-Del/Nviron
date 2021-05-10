import {AuthContext} from '../context/auth';
import React,{useContext} from 'react';
import { Grid,Transition, GridColumn, Header,Image,Container,Segment,Message } from 'semantic-ui-react';



function UserProfile(){
    const {user}=useContext(AuthContext);

    return(
       <>
       <div>
            Auto edw einai to userpage tou {user.username} 
        </div>

        <div>

            Change Your Email
        <div>
            Your current email: {user.email}
        </div>
            Change Your Username
        </div>
        <div>

            Your current username: {user.username}
            
        </div>
    </>
        
    )
}

export default UserProfile