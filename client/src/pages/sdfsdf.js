let postMarkup;
if(!getOrganization || !getOrgPostsByName){
    //perimenoume na fortosei, mporoume na balooume kai kyklo pou gyrnaei
    postMarkup = <p>Loading Organization Page.....</p>
}else if((getOrgPostsByName==null && getOrganization)  ){
    console.log((getOrgPostsByName==null && getOrganization) );
    const {id,orgDescription,orgName,orgLocationLat,orgLocationLong}= getOrganization;
    //const {body,username,createdAt,likeCount,commentCount} = getOrgPostsByName.getOrgPostsByName;
    //console.log(username,createdAt,body,likeCount,commentCount);
    postMarkup=(
        <Grid>
            <Grid.Row>
                <Container >
                 <Image className="img-organizationpage"
                    src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
                    //size="small"
                    float="center"/>
                    <Segment>
                    <h1 className="header-organizationpage">{orgName}</h1>
                    </Segment>
                    <Segment>
                    <h4 style={{textAlign:"center"}}>Organization Description:</h4>
                    <h3>{orgDescription}</h3>
                    </Segment>
                </Container>
             </Grid.Row>     
             <Grid.Row>  
                <Grid.Column width={2}>
                   
                </Grid.Column>
                <Grid.Column width={10} >
                        
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={10}>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
else{
    const {id,orgDescription,orgName,orgLocationLat,orgLocationLong}= getOrganization;
    const {body,username,createdAt,likeCount,commentCount} = getOrgPostsByName.getOrgPostsByName;
    console.log(username,createdAt,body,likeCount,commentCount);
    postMarkup=(
        <Grid>
            <Grid.Row>
                <Grid.Column width={2}>
                    <Image
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    size="small"
                    float="right"/>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{orgName}</Card.Header>
                            <Card.Description>{orgDescription}</Card.Description>
                        </Card.Content> 
                        <hr/>
                    </Card>    
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={10}>
                    <OrgPostCard orgpost={getOrgPostsByName.getOrgPostsByName} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
return postMarkup;