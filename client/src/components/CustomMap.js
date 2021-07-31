import React, { useEffect,useState,useContext,useRef } from 'react';
import '../App.css';
import { Room, Star, StarBorder } from "@material-ui/icons";
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {AuthContext} from '../context/auth';
import {Link} from 'react-router-dom';
import { useForm } from '../util/hooks';
import {Icon,Image,Label,Card,Button,Form} from 'semantic-ui-react';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {FETCH_ACTIONS_QUERY} from '../util/graphql';
import {MAP_BOX} from '../mapconfig';
import moment from 'moment'
import Energy from '../icons/energy.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import NaturePin from './pins/NaturePin';
import EnergyPin from './pins/EnergyPin';
import AgriculturePin from './pins/AgriculturePin';
import AnimalPin from './pins/AnimalPin';
import MarinePin from './pins/MarinePin';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

function CustomMap() {

  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState("Marine Conservation");
  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);

  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
    values.actLocationLat=latitude
    values.actLocationLong=longitude
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
      values.actName=title
      values.actDescription=desc
      values.actType=star
      values.startDate=startdate
      values.endDate=enddate
      //console.log(startdate,enddate,"TO STARTDATE KAI ENDDATE")
    createAct();
    
  }
  //----------------------------------------------------------------------

  const {user} = useContext(AuthContext);
  const {onChange, onSubmit, values } = useForm(createActionCallback);

   const{loadingActs,data: dataActs } =useQuery(FETCH_ACTIONS_QUERY);
   const{ getActions: acts} = dataActs? dataActs:[];
  // const acts=acts2
  console.log(values,"VALUES GIA TON XARTI")
  // values.actLocationLat=parseFloat(values.actLocationLat);
  // values.actLocationLong=parseFloat(values.actLocationLong);
    //console.log(values)
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
              result.data.createAction.actType, result.data.createAction.startDate,
              result.data.createAction.endDate,   ...data.getActions]
           }
    });   
       //values.body = '';
    }
    
  });

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));
  const classes = useStyles();
//----------------------------------------------------------------------

  
  //----------------------------
  function createActionCallback() {
    createAct();
    //console.log(values)
}
  //----------------------------
  let postMarkup;
  let size = 40;

  if(!acts){
    postMarkup=<p>Loading!!!!</p>
  }else{
    postMarkup=(


      
      <div style={{ height: "65vh", width: "100%" }}>
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
         {acts.map((act) => (
          <>
            <Marker
              latitude={act.actLocationLat}
              longitude={act.actLocationLong}
              //offsetLeft={-3.5 * viewport.zoom}
              //offsetTop={-7 * viewport.zoom}
              
            >
                
               {(act.actType === "Energy Conservation")&&(
                
                <EnergyPin size={20}  
              onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                  /> 
               
              )}
               
               {(act.actType === "Nature Conservation")&&(
               
                <NaturePin size={20}  
              onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                  /> 
               
              )}

             

                 {(act.actType=== "Marine Conservation" )&&(

                
                  <MarinePin size={20}  
                  onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                      /> 
                  )
                  } 

                   {(act.actType=== "Agriculture" )&&(

                                
                  <AgriculturePin size={20}  
                  onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                    /> 
                  )}

                   {(act.actType === "Animal Conservation")&&(
                                
                                <AnimalPin size={20}  
                              onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                                  /> 
                                
                    )}  

            {/* <Icon name="tree" 
                style={{
                  fontSize: 7 * viewport.zoom,
                  // color:
                  //   currentUsername === p.username ? "tomato" : "slateblue",
                  // cursor: "pointer",
                }}
                /> */}
            </Marker>
            {act.id === currentPlaceId && (
              <Popup
                key={act.id}
                latitude={act.actLocationLat}
                longitude={act.actLocationLong}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <Card>
                <Card.Content>
                    <Card.Header content={act.actName} />
                    <Card.Meta content={moment(act.startDate).format("MMM Do YY")} />
                    <Card.Description content={act.actDescription} />
                  </Card.Content>
                  <Button as={Link} to={`/actions/${act.id}`}>{act.actName}'s page.</Button>

                </Card>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              //offsetLeft={-3.5 * viewport.zoom}
              //offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <Form  onSubmit={handleSubmit}>
                  <Form.Input
                    label="Name:"
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    //onChange={onChange}
                    value={values.actName}
                  />
                  <Form.TextArea
                    label="Description:"
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value) }
                    //onChange={onChange}
                    value={values.actDescription}
                  />
                  <h5 style={{marginTop:-5}}>Type:
                  </h5>                  
                  <select 
                  label="Type"
                  onChange={(e) => setStar(e.target.value)} 
                  //onChange={onChange}
                  //value={values.actType}
                  >
                    <option selected value="Marine Conservation">Marine Conservation</option>
                    <option value="Nature Conservation">Nature Conservation</option>
                    <option value="Energy Conservation">Energy Conservation</option>
                    <option value="Animal Conservation">Animal Conservation</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                  <h5>Start Date:
                  </h5>  
                  <TextField
                    id="datetime-local"
                    //label="Start Date"
                    type="datetime-local"
                    defaultValue={new Date()}
                    className={classes.textField}
                    onChange={(e) => setStartDate(e.target.value)} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                   <h5>End Date:
                  </h5> 
                  <TextField
                    id="datetime-local"
                   //label="End Date"
                    type="datetime-local"
                    defaultValue={new Date()}
                    className={classes.textField}
                    onChange={(e) => setEndDate(e.target.value)} 
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <button type="submit" className="submitButton">
                    Add Pin 
                  </button>
                </Form>
              </div>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
       
    )
  }
  return postMarkup;
}

const CREATE_ACT_MUTATION = gql`
          mutation createAction( 
              $actName:String!
              $actDescription:String!
              $actLocationLat:Float!
              $actLocationLong:Float!
              $actType:String!
              $startDate:String!
              $endDate:String!
              ){
            createAction(
               actionInput:{
                    actName:$actName
                    actDescription:$actDescription
                    actLocationLat:$actLocationLat
                    actLocationLong:$actLocationLong
                    actType:$actType
                    startDate:$startDate
                    endDate:$endDate
                    }
                ) {
                id actName actDescription actLocationLat actLocationLong actType
                actOwner{
                    username
                }
                startDate
                endDate
                }
          }
        `;

export default CustomMap;
