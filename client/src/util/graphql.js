import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_ORGANIZATIONS_QUERY = gql`
  {
    
    getOrganizations{
    	id
   		orgName
   	 	orgDescription
      orgOwner{
      username id 
      }
      

  }
  }
`;

export const FETCH_ORGPOSTS_QUERY = gql`
  {
    
    getOrgPosts{
    	id
   		body
      username
   	 	createdAt
      orgname
      likes {
        username
      }
      commentCount
      likeCount
      comments {
        id
        username
        createdAt
        body
      }
  }
  }
`;