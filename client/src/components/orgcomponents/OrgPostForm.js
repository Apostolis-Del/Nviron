import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../../util/hooks';
import { FETCH_ORGPOSTS_QUERY } from '../../util/graphql';

function OrgPostForm() {
  const { values, onChange, onSubmit } = useForm(createOrgPostCallback, {
    body: ''
  });

  const [createOrgPost, { error }] = useMutation(CREATE_ORGPOST_MUTATION, {
    variables: values,
    //update replaces proxy with result
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ORGPOSTS_QUERY
      });
      console.log(result);
      //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
      proxy.writeQuery({
        query: FETCH_ORGPOSTS_QUERY,
        data: {
            getOrgPosts: [result.data.createOrgPost.body, ...data.getOrgPosts]
        }
    });   
       values.body = '';
    }
  });

  function createOrgPostCallback() {
    createOrgPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create an organization post:</h2>
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
      {/* {//to error to bazoume giati otan apla patame submit xwris na grapsoume kati 
        //tote pairnoume graphql error
        error&&(
          <div className="ui error message" style={{marginBottom:20}}>
            <ul className="list">
              <li>{error.graphQLErrors[0].extensions.code}</li>
            </ul>
          </div>
      )} */}
      
    </>
  );
}

const CREATE_ORGPOST_MUTATION = gql`
  mutation createOrgPost($body: String!) {
    createOrgPost(body: $body) {
      id
      body
      createdAt
      username
      orgname
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
      }
      commentCount
    }
  }
`;

export default OrgPostForm;