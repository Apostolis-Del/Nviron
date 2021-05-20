import React, { useEffect,useState,useContext,useRef } from 'react';
import '../App.css';
import { Room, Star, StarBorder } from "@material-ui/icons";
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {AuthContext} from '../context/auth';
import { useForm } from '../util/hooks';
import {Icon,Image} from 'semantic-ui-react';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {FETCH_ACTIONS_QUERY} from '../util/graphql';
import {MAP_BOX} from '../mapconfig';
import Energy from '../icons/energy.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import NaturePin from './pins/NaturePin';
import EnergyPin from './pins/EnergyPin';
import AgriculturePin from './pins/AgriculturePin';
//import AnimalPin from './pins/AnimalPin';

function CustomMap() {

  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(null);

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
              result.data.createAction.actType,   ...data.getActions]
           }
    });   
       //values.body = '';
    }
    
  });


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

      <div style={{ height: "50vh", width: "100%" }}>
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
                // <>
                
                // <img src={Energy} className='marker'
                // onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                // />
                //   </>
                <EnergyPin size={20}  
              onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                  /> 
               
              )}

              {(act.actType=== "Nature Conservation" )&&(

                // <Icon name="tree"
                // style={{
                //   fontSize: 7 * viewport.zoom,
                //   // color:
                //   //   currentUsername === p.username ? "tomato" : "slateblue",
                //   // cursor: "pointer",
                // }}
                // onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}

                // />
                <NaturePin size={20}  
              onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                  /> 
              )}

                 {(act.actType=== "Marine Conservation" )&&(

                  // <Icon name="tree"
                  // style={{
                  //   fontSize: 7 * viewport.zoom,
                  //   // color:
                  //   //   currentUsername === p.username ? "tomato" : "slateblue",
                  //   // cursor: "pointer",
                  // }}
                  // onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}

                  // />
                  <MarinePin size={20}  
                  onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                      /> 
                  )
                  } 



                 {/* <Icon name="tree" 
                style={{
                  fontSize: 7 * viewport.zoom,
                  // color:
                  //   currentUsername === p.username ? "tomato" : "slateblue",
                  // cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}

                /> 
                */}
                


              {/* <div
                    style={{ transform: `translate(${-size / 2}px,${-size}px)` }}
                    onClick={() => handleMarkerClick(act.id, act.actLocationLat, act.actLocationLong)}
                  >
                    <img
                      src={Energy}
                    />
                  </div> */}

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
                <div className="card">
                  <label className="label-p">Name</label>
                  <h4 className="place">{act.actName}</h4>
                  <label className="label-p">Description</label>
                  <p className="desc">{act.actDescription}</p>
                  <label className="label-p">Information</label>
                  <span className="username">
                    Created by <b>{act.actOwner.username}</b>
                  </span>
                  <span className="date"></span>
                </div>
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
                <form className="form-p" onSubmit={handleSubmit}>
                  <label className="label-p">Name:</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    //onChange={onChange}
                    value={values.actName}
                  />
                  <label className="label-p">Description:</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value) }
                    //onChange={onChange}
                    value={values.actDescription}
                  />
                  <label className="label-p">Type:</label>
                  <select 
                  onChange={(e) => setStar(e.target.value)} 
                  //onChange={onChange}
                  //value={values.actType}
                  >
                    <option value="Marine Conservation">Marine Conservation</option>
                    <option value="Nature Conservation">Nature Conservation</option>
                    <option value="Energy Conservation">Energy Conservation</option>
                    <option value="Animal Conservation">Animal Conservation</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin fdsafsdf
                  </button>
                </form>
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

export default CustomMap;
