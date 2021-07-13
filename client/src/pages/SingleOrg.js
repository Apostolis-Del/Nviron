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
import SingleOrgMap from '../components/SingleOrgMap'
import '../App.css';
import CustomMap from '../components/CustomMap'
import spatula from '../img/logo.png';
import StripeContainer from '../components/orgcomponents/StripeContainer';

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

    const [showItem, setShowItem] = useState(false)


    const [markerPosition, setMarkerPosition] = useState({
        lat: 49.8419,
        lng: 24.0315
      });
      const { lat, lng } = markerPosition;


     


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
       
       const {id,orgDescription,orgName,orgOwner,orgLocationLat,orgType,orgLocationLong}= getOrganization;

       if(getOrgPostsByName.getOrgPostsByName){
       const {body,username,createdAt,likeCount,commentCount} = getOrgPostsByName.getOrgPostsByName;
       }

       postMarkup=(
           <>
           <div className="profile">
             {/* <Sidebar /> */}   

             <div className="profileRight">
               <div className="profileRightTop">
                 <div className="profileCover">
                   <img
                     className="profileCoverImg"
                     src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
                     alt=""
                   />
                  

                   <img
                     className="profileUserImg"
                     src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                     alt=""
                   />
                 </div>
                 <div className="profileInfo">
                     <h2 className="profileInfoName">{orgName}</h2>
                     {/* <span className="profileInfoDesc">{orgDescription}</span> */}
                 </div>
               </div>
              
               <div className="profileRightBottom">
                 {/* <Feed />
                 <Rightbar profile/> */}
                <Segment>
                <div className="sidebar">
                <div className="sidebarWrapper">
                    <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <Button color='facebook'>
                            <Icon name='facebook' /> Facebook
                        </Button>
                    </li>
                    <li className="sidebarListItem">
                        <Button color='youtube'>
                            <Icon name='youtube' /> YouTube
                        </Button>
                    </li>
                    <li className="sidebarListItem">
                        <Button color='twitter'>
                                <Icon name='twitter' /> Twitter
                        </Button>
                    </li>
                    <li className="sidebarListItem">
                        <Button color='instagram'>
                                <Icon name='instagram' /> Instagram
                        </Button>
                    </li>
                    </ul>
                    <hr className="sidebarHr" />
                    <ul className="sidebarFriendList">
                        Donations
                    </ul>

                    
                </div>
                </div>
                </Segment>


                <div className="feed">
                    <div className="feedWrapper">
                        <Grid.Row>
                            <Segment>
                            <Grid.Column width={10}>

                                    {user && orgOwner.username===user.username &&(
                                                <Segment>
                                                    <OrgPostForm orgId={id} orgName={orgName}/>
                                                    </Segment>

                                                )}
                            <h2 style={{textAlign:"center"}}> Recent Organization's Posts</h2> 

                                        {getOrgPostsByName.getOrgPostsByName &&getOrgPostsByName.getOrgPostsByName.map(orgpost=>(
                                                <OrgPostCard orgpost={orgpost} orgName={orgName}/>
                                            ))
                                            }
                                </Grid.Column>
                            </Segment>
                        </Grid.Row>
                     </div>
                     <div className="App">
                    <h1>The Spatula Store</h1>
                    {showItem ? <StripeContainer/> : <> <h3>$10.00</h3> <img src={spatula} alt="Spaluta" />
                    <button onClick={() => setShowItem(true)}>Purchase Spatula</button></>}
                    </div>
                 </div>
                 <div className="rightbar">
                     <div className="rightbarWrapper">
                                {user && orgOwner.username===user.username &&(
                                <div style={{textAlign:"center"}}>
                                    <Segment>
                                        <UpdateOrg />
                                    </Segment>

                                 </div>)}
                    <Segment>
                    <h3 style={{textAlign:"center"}}> Organization's Information</h3> 

                    {/* <h4 className="rightbarTitle">Organization's Information</h4> */}
                        <div className="rightbarInfo">
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">

                            <h4 className="rightbarInfoKey">Description:</h4>
                            <span className="rightbarInfoValue">{orgDescription}</span>
                        </div>
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">
                            <h4 className="rightbarInfoKey">Type:</h4>
                            <span className="rightbarInfoValue">{orgType}</span>
                        </div>
                        <hr className="sidebarHr" />

                        <div className="rightbarInfoItem">
                            <h4 className="rightbarInfoKeyloc">Location:</h4>
                            <span className="rightbarInfoValue"> 
                            <SingleOrgMap org={getOrganization}/>
                                        </span>
                        </div>
                        
                        </div>
                        </Segment>
                        <Segment>
                        <h3 style={{textAlign:"center"}}> Organization's Actions</h3> 

                        <div className="rightbarFollowing">
                            <img
                            src="assets/person/2.jpeg"
                            alt=""
                            className="rightbarFollowingImg"
                            />
                            <span className="rightbarFollowingName">John Carter</span>
                        </div>
                        </Segment>
                        </div>
                    </div>
               </div>
             </div>
           </div>
        </>
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
            orgType
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