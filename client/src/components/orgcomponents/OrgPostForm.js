import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../../util/hooks';
import { FETCH_ORGPOSTS_QUERY } from '../../util/graphql';

function OrgPostForm({orgId,orgName}) {
  const { values, onChange, onSubmit } = useForm(createOrgPostCallback, {
    body: '',
    orgId:''
  });

  values.orgId=orgId;
  const orgName2=orgName;
  const [createOrgPost, { error }] = useMutation(CREATE_ORGPOST_MUTATION, {
    variables: values,
    //update replaces proxy with result
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_SINGLEORGPOST_QUERY,
        variables:{
          orgname:orgName2
        }
      });
      console.log(result);
      //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
      proxy.writeQuery({
        query: FETCH_SINGLEORGPOST_QUERY,
        data: {
            getOrgPostsByName: [result.data.createOrgPost.body, ...data.getOrgPostsByName]
        },
        variables:{
          orgname:orgName2
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
        <h3>Create an organization post:</h3>
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
  mutation createOrgPost($body: String! $orgId: ID!) {
    createOrgPost(body: $body,orgId:$orgId) {
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
const FETCH_SINGLEORGPOST_QUERY= gql`
    query($orgname:String!){
        getOrgPostsByName(orgname:$orgname){
            id
            body
            username
            createdAt
            comments{
                id username
            }
            likes{
                username
            }
            likeCount
            commentCount
        }
    }
`
export default OrgPostForm;