import React,{useContext , useState} from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid,Transition, GridColumn, Header,Image,Container,Segment,Message } from 'semantic-ui-react';
import '../App.css';
import {AuthContext} from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import ActForm from '../components/actcomponents/ActForm';
import OrgForm from '../components/orgcomponents/OrgForm';
import OrganizationCard from '../components/orgcomponents/OrganizationCard';
import Map from '../components/Map';
import { FETCH_POSTS_QUERY,FETCH_ORGANIZATIONS_QUERY,FETCH_ORGPOSTS_QUERY,FETCH_ACTIONS_QUERY } from '../util/graphql';
import 'leaflet/dist/leaflet.css';
import {Marker, Popup, TileLayer } from 'react-leaflet';
import OrgPostCard from '../components/orgcomponents/OrgPostCard';
import ActionCard from '../components/actcomponents/ActionCard';
import CardCarousel from "../components/carouselcomponents/CardCarousel";
import ImageCarousel from "../components/carouselcomponents/ImageCarousel";
import "pure-react-carousel/dist/react-carousel.es.css";

function Home() {

    const {user}=useContext(AuthContext);
    //ta kanoume fetch edw
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    //edw ginetai destructure ta posts (to ? legetai ternary)
    const { getPosts: posts } = data ? data : [];

    const{loadingOrgs,data: dataOrgs } =useQuery(FETCH_ORGANIZATIONS_QUERY);
    const{ getOrganizations: orgs} = dataOrgs? dataOrgs:[];


    const{loadingOrgPosts,data: dataOrgPosts } =useQuery(FETCH_ORGPOSTS_QUERY);
    const{ getOrgPosts: orgposts} = dataOrgPosts? dataOrgPosts:[];

    const{loadingActs,data: dataActs} =useQuery(FETCH_ACTIONS_QUERY);
    const{ getActions: acts} = dataActs? dataActs:[];

     console.log("ta org posts",orgposts);

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

    if(data){
        console.log(data);
    }
    if(dataOrgs){
        console.log(dataOrgs);
    }

	return (
        <>

    <  Container style={{ margin: 20 }}>
      <Segment attached="bottom" >
        <ImageCarousel />
      </Segment>
      
    </Container>
    <  Container style={{ margin: 20 }}>

    <Grid.Row className="page-title">
            <h1 style = {{ marginBottom : 20, marginTop:60}}>Enviromental Actions</h1>
    </Grid.Row>

    {user?(
        <Segment attached="bottom" >
            <Grid columns={2} relaxed='very'>
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
            </Grid.Column>
            <Grid.Column  >
                <div >
                    <Transition.Group>
                    <Segment className="page-title" >
                    <h1>Create a new Action</h1>
                    </Segment >
                    <Segment >
                    <ActForm />
                    </Segment>
                    </Transition.Group>
                </div>
            </Grid.Column>

            </Grid>
        </Segment>
        ):(
            <Segment>
            <div>
                <Map markerPosition={markerPosition} />
                <div>
                    Current markerPosition: lat: {lat}, lng: {lng}
                </div>
                <button onClick={moveMarker}>Move marker</button>
            
            </div>
            </Segment>
        )}

        </Container>

        <Grid columns={2} divided>
        <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
            
         {//if user
            user && (
                <Grid.Column>
                    <PostForm/>
                </Grid.Column>
            )
            }   
         {loading?(
             <h1>Loading Users' Posts...</h1>
         ):(
            <Transition.Group>
                {
                     posts && posts.map(post=>(
                        <Grid.Column key={post.id} style={{marginBottom:20}}>
                           <PostCard post={post}/>
                        </Grid.Column>
                    ))
                }
            </Transition.Group>
         )}
        </Grid.Row>
        <Container>

        <Segment padded>
        {//if user
            user && (
                <div>
                    <Transition.Group>
                    <Segment className="page-title">
                    <h1>Create a new Organization</h1>
                    </Segment>
                    {/* <ActForm/> */}
                    <OrgForm/>
                    </Transition.Group>
                </div>
            )
            }
        </Segment>

        
        <Grid.Row className="page-title">
            <h1>Recent Actions</h1>
        </Grid.Row>
        
        <Grid.Row>
        
       
          
         {loadingOrgs?(
             <h1>Loading Organizations...</h1>
         ):(
            <Transition.Group>
                {
                     acts && acts.map(act=>(
                        <Grid.Column key={act.id} style={{marginBottom:20}}>
                                <ActionCard act={act}/>
                        </Grid.Column>
                    ))
                }
            </Transition.Group>
         )}
        </Grid.Row>
        </Container>
        <Grid.Row className="page-title">
            <h1>Recent Organizations</h1>
        </Grid.Row>
        
        <Grid.Row>
        
       
          
         {loadingOrgs?(
             <h1>Loading Organizations...</h1>
         ):(
            <Transition.Group>
                {
                     orgs && orgs.map(org=>(
                        <Grid.Column key={org.id} style={{marginBottom:20}}>
                                <OrganizationCard org={org}/>
                        </Grid.Column>
                    ))
                }
            </Transition.Group>
         )}
        </Grid.Row>

        <Grid.Row className="page-title">
            <h1>Recent Organizations' Posts</h1>
        </Grid.Row>
        
        <Grid.Row>
        
       
          
         {loadingOrgs?(
             <h1>Loading Organizations's Posts...</h1>
         ):(
            <Transition.Group>
                {
                     orgposts && orgposts.map(orgpost=>(
                        <Grid.Column key={orgpost.id} style={{marginBottom:20}}>
                                <OrgPostCard orgpost={orgpost}/>
                        </Grid.Column>
                    ))
                }
            </Transition.Group>
         )}
        </Grid.Row>
        
    </Grid>
    
    </>
    );
}

export default Home;