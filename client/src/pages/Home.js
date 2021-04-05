import React from 'react';
import { useQuery, gql } from '@apollo/client';

function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);

    //const { getPosts: posts } = data ? data : [];
    if(data){
        console.log(data);
    }
	return (
		<div>
				<h1>Home Page</h1>
        </div>
    );
}
const FETCH_POSTS_QUERY = gql`
    
    {
        getPosts{
            id
            body
            likeCount
            commentCount
        }
}
      
`;

export default Home;