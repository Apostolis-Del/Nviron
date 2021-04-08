import React,{useContext} from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid,Transition, GridColumn, Image } from 'semantic-ui-react';
import '../App.css';
import {AuthContext} from '../context/auth';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {

    const {user}=useContext(AuthContext);
    //ta kanoume fetch edw
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    //edw ginetai destructure ta posts (to ? legetai ternary)
    const { getPosts: posts } = data ? data : [];

    if(data){
        console.log(data);
    }
	return (
        <Grid columns={3} divided>
        <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            
         {//if user
            user && (
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            )
            }   
         {loading?(
             <h1>Loading Posts...</h1>
         ):(
            <Transition.Group>
                {
                     posts && posts.map(post=>(
                        <Grid.Column key={post.id} style={{marginBottom:20}}>
                           <PostCard post={post}/>
                        </Grid.Column>
                    ))
                }
            </Transition.Group>
         )}
        </Grid.Row>
    </Grid>
    );
}

export default Home;