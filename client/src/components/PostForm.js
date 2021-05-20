import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });
  console.log(values);
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    //update replaces proxy with result
    update(proxy, result) {
      console.log(result,"to prwto result")
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      console.log(result,"to deutero result");
      //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
            getPosts: [result.data.createPost.body, ...data.getPosts]
        }
    });   
       values.body = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="green">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {//to error to bazoume giati otan apla patame submit xwris na grapsoume kati 
        //tote pairnoume graphql error
        error&&(
          <div className="ui error message" style={{marginBottom:20}}>
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
      )}
      
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      profilePic
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
        profilePic
      }
      commentCount
    }
  }
`;

export default PostForm;