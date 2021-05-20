import React from 'react';
import { Button, Form ,Segment,Select,Divider,Dropdown} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation ,useState} from '@apollo/react-hooks';

import { useForm } from '../../util/hooks';
import { FETCH_ORGANIZATIONS_QUERY } from '../../util/graphql';

function UpdateOrgForm(){

    //const[errors,setErrors]=useState({});


    const typeOptions = [
      { key: '1', text: "Nature Conservation", value:"Nature Conservation" },
      { key: '2', text: "Marine Conservation", value:"Marine Conservation" },
      { key: '3', text: "Animal Conservation", value:"Animal Conservation" },
      { key: '4', text: "Energy Conservation", value:"Energy Conservation" },
      { key: '5', text: "Agriculture",         value:"Agriculture",}
    ]

    const {onChange, onSubmit, values } = useForm(createOrgCallback);
    console.log(values)

    values.orgLocationLat=parseFloat(values.orgLocationLat);
    values.orgLocationLong=parseFloat(values.orgLocationLong);
    //values.orgType="sdf"

    const onChangeType = (e, {value}) => {
      e.persist();
      //console.log(e.target.textContent);
      const typename = e.target.textContent;
      //const bird_name2 = e.target.value;
      values.orgType= typename;
      //console.log(bird_name);
      //console.log(bird_name2);

    };

    const [createOrg, { error }] = useMutation(UPDATE_ORG, {
        variables: values,
        //update replaces proxy with result
        update(proxy, result) {
          console.log(result);
          const data = proxy.readQuery({
            query: FETCH_ORGANIZATIONS_QUERY
          });
          console.log(result.data.createOrg.values);
          //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
          proxy.writeQuery({
            query: FETCH_ORGANIZATIONS_QUERY,
            data: {
                 getOrganizations: [result.data.createOrg.orgDescription, result.data.createOrg.orgName,
                  result.data.createOrg.orgLocationLat, result.data.createOrg.orgLocationLong,
                  result.data.createOrg.orgType,   ...data.getOrganizations]
               }
        });   
           //values.body = '';
        }
        
      });
      // data: {
      //   getOrganizations: [result.data.createOrg.values, ...data.getOrganizations]
      // }
    
    function createOrgCallback() {
        createOrg();
        //console.log(values)
    }

    return (
        <>
          <Form  onSubmit={onSubmit}
            >
            <Form.Group widths='equal'>
                 <h5 style={{marginTop:10,marginLeft:10}}>Name:</h5>
                <Form.Input 
                    placeholder="Organization's name"
                    name="orgName"
                    size="medium"
                    onChange={onChange}
                    style={{width: "200px"}}
                    error={error ? true : false}
                    value={values.orgName}
                    // error={error ? true : false}
                />
                </Form.Group>
                {/* <Form.Group widths='equal'>

                <h5 style={{ marginLeft:20}}>Latitude:</h5>

                 <Form.Input
                    placeholder="Organization's latitude:"
                    name="orgLocationLat"
                    size="medium"
                    type="number"
                    step="0.1"
                    onChange={onChange}
                    error={error ? true : false}
                    value={values.orgLocationLat}
                // error={error ? true : false}
                />
                </Form.Group>
                <Form.Group widths='equal'>

                <h5 style={{ marginLeft:20}}>Longitude:</h5>
                <Form.Input style={{ marginLeft:20}}
                    placeholder="Organization's longitude:"
                    name="orgLocationLong"
                    type="number"
                    step="0.1"
                    size="medium"
                    fluid
                    onChange={onChange}
                    error={error ? true : false}
                    value={values.orgLocationLong}
                // error={error ? true : false}
                />
               
            </Form.Group> */}

            <Form.Group  widths='equal'>
            <label style={{ fontWeight:"bold",marginRight:10,marginTop:0,marginLeft:10}}>Select Type:</label>
            <Dropdown
                  placeholder='Types:'
                  
                  search
                  selection
                  style={{width: "200px"}}
                  options={typeOptions}
                  onChange={onChangeType}
              />
                          
            </Form.Group>

            <Form.Group widths='equal'>

                <h5 style={{marginTop:10,marginLeft:10}}>Description:</h5>

                <Form.TextArea  fluid
                        placeholder="Organization's description"
                        name="orgDescription"
                        size="large"
                        onChange={onChange}
                        value={values.orgDescription}
                        style={{width: "200px"}}
                        error={error ? true : false}
                        // error={error ? true : false}
                    />
               
                
            </Form.Group>
            <Divider style={{marginBottom:40}}>

            <Button attached='bottom' type="submit" color="green" >
                    Submit
                </Button>
                
            </Divider>
          </Form>
           {/* { //to error to bazoume giati otan apla patame submit xwris na grapsoume kati 
            //tote pairnoume graphql error
            error&&(
              <div className="ui error message" style={{marginBottom:20}}>
                <ul className="list">
                  <li>{error.graphQLErrors[0].extensions.exception.errors}</li>
                </ul>
              </div>
          )}   */}
          </>
        
      );
}
/* {//to error to bazoume giati otan apla patame submit xwris na grapsoume kati 
            //tote pairnoume graphql error
            error&&(
              <div className="ui error message" style={{marginBottom:20}}>
                <ul className="list">
                  <li>{error.graphQLErrors[0].message}</li>
                </ul>
              </div>
          )} */

     const UPDATE_ORG = gql`
          mutation updateOrganization( 
              $orgName:String!
              $orgDescription:String!
              $orgLocationLat:Float!
              $orgLocationLong:Float!
              $orgType:String!
              ){
            updateOrganization(
              updateOrgInput:{
                    orgName:$orgName
                    orgDescription:$orgDescription
                    orgLocationLat:$orgLocationLat
                    orgLocationLong:$orgLocationLong
                    orgType:$orgType
                    }
                ) {
                id orgName orgDescription orgLocationLat orgLocationLong orgType profilePic
                orgOwner{
                    username
                }
                }
          }
        `;
export default UpdateOrgForm;