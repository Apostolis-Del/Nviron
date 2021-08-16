import React,{useContext , useState} from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid,Transition,Modal,Button,Icon, GridColumn, Header,Image,Container,Segment,Message } from 'semantic-ui-react';
import '../App.css';
import {AuthContext} from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import ActForm from '../components/actcomponents/ActForm';
import OrgForm from '../components/orgcomponents/OrgForm';
import OrganizationCard from '../components/orgcomponents/OrganizationCard';
import Map from '../components/Map';
import { FETCH_POSTS_QUERY,FETCH_ORGANIZATIONS_QUERY,FETCH_ORGPOSTS_QUERY} from '../util/graphql';
import 'leaflet/dist/leaflet.css';
import {Marker, Popup, TileLayer } from 'react-leaflet';
import OrgPostCard from '../components/orgcomponents/OrgPostCard';
import ActionCard from '../components/actcomponents/ActionCard';
import ActionTabs from '../components/ActionTabs';
import CustomMap from '../components/CustomMap';
import SubscribedOrgs from '../components/orgcomponents/SubscribedOrgs'
import SubscribedOrgsHelper from '../components/orgcomponents/SubscribedOrgsHelper'
import CardCarousel from "../components/carouselcomponents/CardCarousel";
import ImageCarousel from "../components/carouselcomponents/ImageCarousel";
import MyOrganizations from '../components/orgcomponents/MyOrganizations'
import "pure-react-carousel/dist/react-carousel.es.css";

function Home() {

    const {user}=useContext(AuthContext);
    const userName=user?user.username:"";
    console.log(userName,"to username")
    //FOR POSTS
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    const { getPosts: posts } = data ? data : [];

    //FOR ORGANIZATIONS
    const{loadingOrgs,data: dataOrgs } =useQuery(FETCH_ORGANIZATIONS_QUERY);
    const{ getOrganizations: orgs} = dataOrgs? dataOrgs:[];

    //FOR ORGPOSTS
    const{loadingOrgPosts,data: dataOrgPosts } =useQuery(FETCH_ORGPOSTS_QUERY);
    const{ getOrgPosts: orgposts} = dataOrgPosts? dataOrgPosts:[];


    console.log(userName,"to username")
    //FOR ACTIONS
    const{loadingActs,data: dataActs} =useQuery(FETCH_ACTIONS_OWNER_QUERY, {
        variables: { username:userName },
      });
    const{ getActionbyOwner: acts} = dataActs? dataActs:[];

    //FOR ORGANIZATION OWNER
   

    if(data){
        console.log(data);
    }
    if(dataOrgs){
        console.log(dataOrgs);
    }

    if(!loadingActs){
        console.log(acts,"ta acts tou owner");
    }
   
	return (
        <>

    <  Container style={{ margin: 20 }}>
        {!user&&
      <Segment attached="bottom" >
        <ImageCarousel />
      </Segment>
    }
    </Container>
    <  Container style={{ margin: 20 }}>
        {user&&(
    <Grid.Row className="seven">
        <h1 style = {{ marginBottom : 20, marginTop:60}}>Check your Environmental Actions or Organizations.</h1>

        <Segment>
            <Grid columns={2} style={{marginTop:10,marginBottom:10,marginLeft:20,marginRight:20}} divided >
            <Grid.Column style={{marginLeft:0}}>
            
            <Modal
            trigger={<Button size='big'color='green' icon labelPosition='left'>
            <Icon name='tree' />My Actions</Button>}
            header='My Actions.'
            content='Call Benjamin regarding the reports.' 
            //actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
            >
            <Modal.Header>My Actions.</Modal.Header>
            <Modal.Content>
            <Grid columns={2} style={{marginTop:20}}divided>

            {loadingActs?(
                <h1>Loading Your Actions</h1>
            ):(
               <Transition.Group>
                   {
                        acts && acts.map(act=>(
                           <Grid.Column key={act.id} style={{marginBottom:20}}>
                              <ActionCard act={act} username={userName}/>
                           </Grid.Column>
                       ))
                   }
               </Transition.Group>
            )}
            </Grid>
            </Modal.Content>
            </Modal>
            <MyOrganizations userName={userName}/>
            </Grid.Column>
            <Grid.Column>
                   <OrgForm username={userName}/>
            {/* <Modal
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
              open={open}
            trigger={<Button color='green' icon labelPosition='left'>
            <Icon name='building' />Create a New Organization</Button>}
            header='My Organizations'
            content='Call Benjamin regarding the reports.'
            //actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
            >
             <Modal.Header>New Organization</Modal.Header>
            <Modal.Content>
                <OrgForm />
            </Modal.Content>
            <Modal.Actions>
                <Button
                content="Yep, that's me"
                labelPosition='right'
                icon='checkmark'
                onClick={() => setOpen(false)}
                positive
                />
            </Modal.Actions>
            </Modal> */}

            <Modal
            trigger={<Button size='big' color='green' icon labelPosition='left'>
            <Icon name='tree' />New Action</Button>}
            header='My Organizations'
            content='Call Benjamin regarding the reports.'
            //actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
            >
             <Modal.Header>Create a New Action</Modal.Header>
            <Modal.Content>
                <h3>In order to create a new Action you should double-click on map, under Environmental Actions.</h3>
            </Modal.Content>
            </Modal>   
            </Grid.Column>  
            </Grid>   
            </Segment>
    </Grid.Row>
    )}
    <Grid.Row className="seven">
            <h1 style = {{ marginBottom : 20, marginTop:60}}>Enviromental Actions</h1>
    </Grid.Row>

    {user?(
        <Segment attached="bottom" >
            {/* <Grid columns={2} relaxed='very'> */}
           
            <Segment>
            <div>
                    <CustomMap username={userName}/>
            </div>
            </Segment>
           
        </Segment>
        ):(
           
                 <CustomMap /> 
            
        )}

        </Container>

        <Grid.Row className="seven">
            <h1 style={{marginTop:30,marginBottom:30}}>Browse Recent Actions and Organizations Based on Type</h1>

        </Grid.Row>
       <Segment>
        <ActionTabs/> 
        </Segment>

        <Grid columns={2} style={{marginTop:20}}divided>
        <Grid.Row >
            <h1 className="seven">Recent Posts</h1>
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
        
        {user &&(
            <>
            <div className='seven'>
                <h1 >Subscribed Organizations' Posts</h1>
                
                <SubscribedOrgsHelper user={user}/>
                </div>
            </>
        )
        }

        {/* <Segment padded>
        {//if user
            user && (
                <div>
                    <Transition.Group>
                    <Segment className="seven">
                    <h1>Create a new Organization</h1>
                    </Segment>
                    
                    <OrgForm/>
                    </Transition.Group>
                </div>
            )
            }
        </Segment> */}

        
        
        </Container>
        

        <>
            <div className='seven'>
                <h1 >Recent Organizations' Posts</h1>
                
                </div>
            </>
        
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


const FETCH_ACTIONS_OWNER_QUERY = gql`
   query($username:String!){
    getActionbyOwner(username:$username){
      id actName actDescription actLocationLat actLocationLong actType 
            actOwner{
                username
            }
            commentCount
            likeCount
            likes{
                username
            }
            comments{
                id username createdAt body
            }
            startDate
            endDate
         }
  }
  
`;

export default Home;