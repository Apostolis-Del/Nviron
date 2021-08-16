import React,{useState} from 'react';
import { Button, Form, Modal,Segment,Select,Icon,Dropdown} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Room} from "@material-ui/icons";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { InMemoryCache, ApolloClient } from '@apollo/client';

import { useForm } from '../../util/hooks';
import { FETCH_ORGANIZATIONS_QUERY } from '../../util/graphql';

function OrgForm({username}){


// const client = new ApolloClient({
//   // ...other arguments...
//   cache: new InMemoryCache()
// });

  //   const[errors,setErrors]=useState({ orgName:false,
  //   orgDescription:false,
  //   orgLocationLat:false,
  //   orgLocationLong:false,
  //   orgType:false
  // });

  //const [currentPlaceId, setCurrentPlaceId] = useState(null);
  
  
    const [newPlace, setNewPlace] = useState(null);
    const [open, setOpen] = React.useState(false)


    const typeOptions = [
      { key: '1', text: "Nature Conservation", value:"Nature Conservation" },
      { key: '2', text: "Marine Conservation", value:"Marine Conservation" },
      { key: '3', text: "Animal Conservation", value:"Animal Conservation" },
      { key: '4', text: "Energy Conservation", value:"Energy Conservation" },
      { key: '5', text: "Agriculture",         value:"Agriculture",}
    ]

    const {onChange, values } = useForm(createOrgCallback);
    //console.log(values)

    const onSubmit = (event) => {
      event.preventDefault();
      //callback();
      createOrg()
      setTimeout(function() {
        setOpen(false)

  }, 1000);
    };
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

    const [createOrg] = useMutation(CREATE_ORG_MUTATION, {
        variables: values,
        //update replaces proxy with result
        update(proxy, result) {
          console.log(result);
          const data = proxy.readQuery({
            query: FETCH_ORGANIZATIONS_QUERY
          });

          // const data2 = proxy.readQuery({
          //   query: FETCH_ORGANIZATIONS_OWNER_QUERY
          //   ,variables:{
          //     username
          //   }
          // });
         // console.log(result.data.createOrg.values);
          //edw prosthetoume to post mas sto getPosts gia na emfanizetai realtime
          proxy.writeQuery({
            query: FETCH_ORGANIZATIONS_QUERY,
            data: {
                 getOrganizations: [result.data.createOrg.orgDescription, result.data.createOrg.orgName,
                  result.data.createOrg.orgLocationLat, result.data.createOrg.orgLocationLong,
                  result.data.createOrg.orgType,   ...data.getOrganizations]
               }
        })

        const data2 = proxy.readQuery({
          query: FETCH_ORGANIZATIONS_OWNER_QUERY,
          variables: { orgOwner:username },
        });
        console.log(data2,"TA DATA2")
        console.log(data,"to data")
        proxy.writeQuery({
          query: FETCH_ORGANIZATIONS_OWNER_QUERY,
          
          variables: { orgOwner:username },
          data: {
            getOrganizationsbyOwner: [result.data.createOrg.orgDescription, result.data.createOrg.orgName,
                result.data.createOrg.orgLocationLat, result.data.createOrg.orgLocationLong,
                result.data.createOrg.orgType,   ...data2.getOrganizationsbyOwner]
            }
      })
      console.log("ta data2 meta",data2)
          }

        //,onError(err){
        //   //console.log(err.graphQLErrors[0].extensions.exception.errors);
        //   setErrors(err && err.graphQLErrors[0]?err.graphQLErrors[0].extensions.exception.errors:{});
        // }
        
      });
      

      const handleAddClick = (e) => {
        const [longitude, latitude] = e.lngLat;
        setNewPlace({
          lat: latitude,
          long: longitude,
        });
        values.orgLocationLat=latitude
        values.orgLocationLong=longitude
      };

      const [viewport, setViewport] = useState({
        latitude: 37.983810,
        longitude: 23.727539,
        zoom: 4,
      });
    
      
    function createOrgCallback() {
        createOrg();
        //console.log(values)
    }

    return (
        <>
        <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button size='big' color='green' icon labelPosition='left'>
        <Icon name='building' />New Organization</Button>}
        header='My Organizations'
        content='Call Benjamin regarding the reports.'
        //actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
        >
       <Modal.Header>New Organization</Modal.Header>
      <Modal.Content>
      <Form style={{marginTop:-30}} onSubmit={onSubmit}
            >
            <Form.Group style={{marginTop:30}} widths='equal'>
                 <h5 style={{marginTop:10}}>Name:</h5>
                <Form.Input 
                    placeholder="Organization's name"
                    name="orgName"
                    size="large"
                    onChange={onChange}
                    //error={errors.orgName ? true : false}
                    value={values.orgName}
                />
                <h5 style={{marginTop:10,marginLeft:10}}>Latitude:</h5>

                 <Form.Input
                    placeholder="Organization's latitude:"
                    name="orgLocationLat"
                    size="large"
                    type="number"
                    //step="0.1"
                    onChange={onChange}
                    value={values.orgLocationLat}
                    // error={errors.orgLocationLat ? true : false}
                />
                <h5 style={{marginTop:10,marginLeft:10}}>Longitude:</h5>
                <Form.Input
                    placeholder="Organization's longitude:"
                    name="orgLocationLong"
                    type="number"
                    step="0.1"
                    size="large"
                    onChange={onChange}
                    value={values.orgLocationLong}
                    // error={errors.orgLocationLong ? true : false}
                />
               
            </Form.Group>

            <Form.Group style={{marginTop:20}} widths='equal'>
            <label style={{ fontWeight:"bold",marginRight:10,marginTop:10}}>Select Type:</label>
            <Dropdown
                  placeholder='Types:'
                  fluid
                  search
                  selection
                  options={typeOptions}
                  onChange={onChangeType}
              />
                          
            </Form.Group>

            <Form.Group widths='equal'>

                <h5 style={{marginTop:10}}>Description:</h5>

                <Form.Input 
                        placeholder="Organization's description"
                        name="orgDescription"
                        size="large"
                        onChange={onChange}
                        value={values.orgDescription}
                        // error={errors.orgDescription ? true : false}
                        />
    
                <Button type="submit" color="green" 
                          >
                    Submit
                </Button>
            </Form.Group>


            <div style={{ height: "45vh", width: "100%" }}>
                <ReactMapGL
                  mapboxApiAccessToken="pk.eyJ1IjoiZGVsNDQiLCJhIjoiY2tvdjc2eXloMDAyYTJvdXRyMHg1dWh6dSJ9.26H3W4EzkfNfqHwanTdsUg"
                  {...viewport}
                  width="100%"
                  height="100%"
                  transitionDuration="200"
                  mapStyle="mapbox://styles/mapbox/dark-v9"
                  onViewportChange={(viewport) => setViewport(viewport)}
                  //onDblClick={currentUsername && handleAddClick}
                  onDblClick={handleAddClick}
                >
                  
                    
                  {newPlace && (
                    <>
                      <Marker
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        offsetLeft={-3.5 * viewport.zoom}
                        offsetTop={-7 * viewport.zoom}
                      >
                        <Room
                          style={{
                            fontSize: 7 * viewport.zoom,
                            color: "tomato",
                            cursor: "pointer",
                          }}
                        />
                      </Marker>
                      
                            </>
                  )}
                </ReactMapGL>
              </div>

          </Form>
          {/* {Object.keys(errors).length>0 &&(
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value=>(
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}   */}

      </Modal.Content>
      </Modal>
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

     const CREATE_ORG_MUTATION = gql`
          mutation createOrg( 
              $orgName:String!
              $orgDescription:String!
              $orgLocationLat:Float!
              $orgLocationLong:Float!
              $orgType:String!
              ){
            createOrg(
               organizationInput:{
                    orgName:$orgName
                    orgDescription:$orgDescription
                    orgLocationLat:$orgLocationLat
                    orgLocationLong:$orgLocationLong
                    orgType:$orgType
                    }
                ) {
                id orgName orgDescription orgLocationLat orgLocationLong orgType
                orgOwner{
                    username
                }
                }
          }
        `;

        const FETCH_ORGANIZATIONS_OWNER_QUERY = gql`
        query($orgOwner:String!){  
        getOrganizationsbyOwner(orgOwner:$orgOwner){
            id
                orgName
                orgDescription
          orgLocationLat
          orgLocationLong
          orgType
          orgOwner{
          username id 
          }
          donations{
            username
            donateDate
          }
          profilePic
        }
        }
        `;
export default OrgForm;