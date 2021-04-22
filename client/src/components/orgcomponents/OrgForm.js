import React from 'react';
import { Button, Form ,Segment,Select} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../../util/hooks';
import { FETCH_POSTS_QUERY } from '../../util/graphql';

function OrgForm(){

    const typeOptions = [
        { key: '1', text: "Nature Conservation", value: 'naturecons' },
        { key: '2', text: "Marine Conservation", value: 'marinecons' },
        { key: '3', text: "Animal Conservation", value: 'animalcons' },
        { key: '4', text: "Energy Conservation", value: 'energycons' },
        { key: '5', text: "Agriculture",         value: 'agriculturecons' }
      ]
   

    // const { values, onChange, onSubmit } = useForm(createPostCallback, {
    //     body: ''
    //   });
    function onChange(){
        console.log("changed");
    }
    const values=1;

    return (
        <>
          <Form //onSubmit={onSubmit}
            >
            <Form.Group style={{marginTop:30}} widths='equal'>
                 <h5 style={{marginTop:10}}>Name:</h5>
                <Form.Input 
                    placeholder="Organization's name"
                    name="body"
                    size="large"
                    onChange={onChange}
                    value={values.body}
                    // error={error ? true : false}
                />
                <h5 style={{marginTop:10,marginLeft:10}}>Latitude:</h5>

                 <Form.Input
                    placeholder="Organization's latitude:"
                    name="body"
                    size="large"
                    onChange={onChange}
                    value={values.body}
                // error={error ? true : false}
                />
                <h5 style={{marginTop:10,marginLeft:10}}>Longitude:</h5>
                <Form.Input
                    placeholder="Organization's longitude:"
                    name="body"
                    size="large"
                    onChange={onChange}
                    value={values.body}
                // error={error ? true : false}
                />
               
            </Form.Group>

            <Form.Group style={{marginTop:20}} widths='equal'>
            <label style={{ fontWeight:"bold",marginRight:10,marginTop:10}}>Select Type:</label>
                <Select  options={typeOptions} label="Type:" placeholder=" Type:" />

            </Form.Group>

            <Form.Group widths='equal'>

                <h5 style={{marginTop:10}}>Description:</h5>

                <Form.Input 
                        placeholder="Organization's description"
                        name="body"
                        size="large"
                        onChange={onChange}
                        value={values.body}
                        // error={error ? true : false}
                    />
    
                <Button type="submit" color="green">
                    Submit
                </Button>
            </Form.Group>
          </Form>
          
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
export default OrgForm;