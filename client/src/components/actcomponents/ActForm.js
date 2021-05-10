import React from 'react';
import { Button, Form ,Segment,Select,Dropdown} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation ,useState} from '@apollo/react-hooks';

import { useForm } from '../../util/hooks';
import { FETCH_ACTIONS_QUERY } from '../../util/graphql';

function ActForm(){

    //const[errors,setErrors]=useState({});


    const typeOptions = [
      { key: '1', text: "Nature Conservation", value:"Nature Conservation" },
      { key: '2', text: "Marine Conservation", value:"Marine Conservation" },
      { key: '3', text: "Animal Conservation", value:"Animal Conservation" },
      { key: '4', text: "Energy Conservation", value:"Energy Conservation" },
      { key: '5', text: "Agriculture",         value:"Agriculture",}
    ]

    const {onChange, onSubmit, values } = useForm(createActionCallback);
    console.log(values)

    values.actLocationLat=parseFloat(values.actLocationLat);
    values.actLocationLong=parseFloat(values.actLocationLong);
    //values.orgType="sdf"

    const onChangeType = (e, {value}) => {
      e.persist();
      //console.log(e.target.textContent);
      const typename = e.target.textContent;
      //const bird_name2 = e.target.value;
      values.actType= typename;
      //console.log(bird_name);
      //console.log(bird_name2);

    };

    const [createAct, { error }] = useMutation(CREATE_ACT_MUTATION, {
        variables: values,
        //update replaces proxy with result
        update(proxy, result) {
          console.log(result);
          const data = proxy.readQuery({
            query: FETCH_ACTIONS_QUERY
          });
          console.log(result.data.createAction.values);
          //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
          proxy.writeQuery({
            query: FETCH_ACTIONS_QUERY,
            data: {
                 getActions: [result.data.createAction.actDescription, result.data.createAction.actName,
                  result.data.createAction.actLocationLat, result.data.createAction.actLocationLong,
                  result.data.createAction.actType,   ...data.getActions]
               }
        });   
           //values.body = '';
        }
        
      });
      // data: {
      //   getOrganizations: [result.data.createOrg.values, ...data.getOrganizations]
      // }
    
    function createActionCallback() {
        createAct();
        //console.log(values)
    }

    return (
        <>
          <Form onSubmit={onSubmit}
            >
            <Form.Group style={{marginTop:30}} widths='equal'>
                 <h5 style={{marginTop:10}}>Name:</h5>
                <Form.Input 
                    placeholder="Action's Name"
                    name="actName"
                    size="medium"
                    onChange={onChange}
                    error={error ? true : false}
                    value={values.orgName}
                    // error={error ? true : false}
                />
                <h5 style={{marginTop:10,marginLeft:0}}>Latitude:</h5>

                 <Form.Input
                    placeholder="Action's Latitude:"
                    name="actLocationLat"
                    size="medium"
                    type="number"
                    step="0.1"
                    onChange={onChange}
                    error={error ? true : false}
                    value={values.orgLocationLat}
                // error={error ? true : false}
                />
               
               
            </Form.Group>

            <Form.Group>
            <h5 style={{marginTop:10,marginLeft:0}}>Longitude:</h5>
                <Form.Input
                    placeholder="Action's Longitude:"
                    name="actLocationLong"
                    type="number"
                    step="0.1"
                    size="medium"
                    onChange={onChange}
                    error={error ? true : false}
                    value={values.orgLocationLong}
                // error={error ? true : false}
                />
            </Form.Group>

            <Form.Group style={{marginTop:20}} widths='equal'>
            <label style={{ fontWeight:"bold",marginRight:10}}>Select Type:</label>
            <Dropdown
                  placeholder="Action's Type:"
                  fluid
                  search
                  selection
                  options={typeOptions}
                  onChange={onChangeType}
                  style={{height:20}}
              />
                          
            </Form.Group>

            <Form.Group widths='equal'>

                <h5 style={{marginTop:10}}>Description:</h5>

                <Form.TextArea 
                        placeholder="Action's Description"
                        name="actDescription"
                        size="medium"
                        onChange={onChange}
                        value={values.orgDescription}
                        error={error ? true : false}
                        // error={error ? true : false}
                    />
    
                <Button type="submit" color="green">
                    Submit
                </Button>
            </Form.Group>
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

     const CREATE_ACT_MUTATION = gql`
          mutation createAction( 
              $actName:String!
              $actDescription:String!
              $actLocationLat:Float!
              $actLocationLong:Float!
              $actType:String!
              ){
            createAction(
               actionInput:{
                    actName:$actName
                    actDescription:$actDescription
                    actLocationLat:$actLocationLat
                    actLocationLong:$actLocationLong
                    actType:$actType
                    }
                ) {
                id actName actDescription actLocationLat actLocationLong actType
                actOwner{
                    username
                }
                }
          }
        `;
export default ActForm;