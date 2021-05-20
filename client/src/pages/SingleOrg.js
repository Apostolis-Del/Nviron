import React,{useContext,useState,useRef,useEffect} from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks';
import { Button,Icon,Container,Segment,Header,Label,Image,Grid, Card,Form, GridColumn } from 'semantic-ui-react';
import OrgLikeButton from '../components/orgcomponents/OrgLikeButton'
import moment from 'moment';
import {AuthContext} from '../context/auth';
import  { TileLayer, Marker,MapContainer, Popup } from 'react-leaflet';
import OrgDeleteButton from '../components/orgcomponents/OrgDeleteButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';
import OrgPostCard from '../components/orgcomponents/OrgPostCard'
import OrgPostForm from '../components/orgcomponents/OrgPostForm';
import { FETCH_ORGPOSTS_QUERY } from '../util/graphql';
import FileUpload from '../components/FileUpload';
import Uploads from '../components/Uploads'
import UpdateOrg from '../components/orgcomponents/UpdateOrg'
import Map from '../components/Map'
import '../App.css';
import CustomMap from '../components/CustomMap'

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


// import 'leaflet/dist/leaflet.css';
// import * as L from 'leaflet';
// delete L.Icon.Default.prototype._getIconUrl;

//     L.Icon.Default.mergeOptions({
//         iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//         iconUrl: require('leaflet/dist/images/marker-icon.png'),
//         shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
//       });

function SingleOrg(props){

    
      

    const [markerPosition, setMarkerPosition] = useState({
        lat: 49.8419,
        lng: 24.0315
      });
      const { lat, lng } = markerPosition;


      function moveMarker() {
        setMarkerPosition({
          lat: lat + 0.0001,
          lng: lng + 0.0001
        });
      }


      //CUSTOM CODE FOR LEAFLET ---------------------------------------------
      const position = [37.99413501196684, 23.70341791940465]


      //CUSTOM CODE FOR LEAFLET ---------------------------------------------


    //edw bazei sto postId tin timi tou post pou yparxei stin grammi tou url
    const orgId=props.match.params.orgId;
    const{user} = useContext(AuthContext);

    const {loading,data:{getOrganization}={}} = useQuery(FETCH_SINGLEORG_QUERY,{
        variables:{
            orgId
        }
    })

    
    const {orgName:orgname2}=getOrganization?getOrganization:[];
    console.log(orgname2);
    
    //variables2:{orgname:"enas allos organismos"};
    const [bookItem,{data:getOrgPostsByName}] = useLazyQuery(FETCH_SINGLEORGPOST_QUERY)
    useEffect(()=>{
        if(!loading){
            //EDW MPOREI NA YPARXEI THEMA KAI NA THELEI [] STA TYPEDEFS
           //bookItem({variables:{orgname:"enas allos organismos"}});
           bookItem({variables:{
               orgname:orgname2}
            });
           console.log("mpike sto useeffect")
        }
        return () => {
            console.log("This will be logged on unmount");
          }
    },[loading])

   console.log(getOrgPostsByName);
   
   //let epeidi einai conditional
   let postMarkup;
   if(!getOrganization || !getOrgPostsByName){
       //perimenoume na fortosei, mporoume na balooume kai kyklo pou gyrnaei
       postMarkup = <p>Loading Organization Page.....</p>
   }
   else{
       
       const {id,orgDescription,orgName,orgOwner,orgLocationLat,orgLocationLong}= getOrganization;

       if(getOrgPostsByName.getOrgPostsByName){
       const {body,username,createdAt,likeCount,commentCount} = getOrgPostsByName.getOrgPostsByName;
       }

       postMarkup=(
           <Grid>

               <Container >

                    <Image className="img-organizationpage"
                       src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
                       //size="small"
                       float="center"/>
                       <h1 style={{ position: "absolute",
                                    top: "25%",
                                    left: "20%",
                                    right:"15%",
                                    color:"white",
                                    textAlign:"center",
                                    textShadow: "2px 2px 4px #606060	"}}>Welcome to {orgName}'s Page.</h1>
                        {user && orgOwner.username===user.username &&(
                        <div style={{textAlign:"right",marginTop:"10px"}}>
                       <UpdateOrg />
                       </div>)}
                        <Grid columns={2} relaxed='very'>
                       <Grid.Row >
                                   <Grid.Column>
                                   <Segment>
                                   <div>
                                    <h3 style={{textAlign:"center"}}>Organization Description:</h3>
                                    <h3>{orgDescription}</h3>
                                    </div>
                                    </Segment>
                                  </Grid.Column>
                                  <Grid.Column>
                                  <Segment>

                                        <div>
                                        <Map markerPosition={markerPosition} />
                                        <div>
                                            Current markerPosition: lat: {lat}, lng: {lng}
                                        </div>
                                        <button onClick={moveMarker}>Move marker</button>
                                        </div>
                                        </Segment>
                                        {/* <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                                            <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={position}>
                                            <Popup>
                                                A pretty CSS3 popup. <br /> Easily customizable.
                                            </Popup>
                                            </Marker>
                                        </MapContainer> */}
                                 </Grid.Column>
                       </Grid.Row>
                       </Grid>
                       {/* <Segment>
                           <h4> Add your file</h4> 
                          <FileUpload />
                            <Uploads />  
                       </Segment> */}
                       <CustomMap />
                <Grid.Row>
                    <Segment>
                    <Grid.Column width={10}>
                    <h3 style={{textAlign:"center"}}> Recent Organization's Posts</h3> 

                            
                            {user && orgOwner.username===user.username &&(
                                <Segment>
                                    <OrgPostForm />
                                    </Segment>

                            )}
                            {getOrgPostsByName.getOrgPostsByName &&getOrgPostsByName.getOrgPostsByName.map(orgpost=>(
                                <OrgPostCard orgpost={orgpost} />
                            ))
                            }
                    </Grid.Column>
                    </Segment>
                </Grid.Row>
                </Container>
           </Grid>
       )
   }
   return postMarkup;

}


const FETCH_SINGLEORG_QUERY=gql`
    query($orgId:ID!){
        getOrganization(orgId:$orgId){
            id
            orgName
            orgDescription
            orgLocationLat
            orgLocationLong
            orgOwner{
                id username
            }
            
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
`;

export default SingleOrg