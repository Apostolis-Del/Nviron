const { gql } = require('apollo-server');

//type definitions for graphql
module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
     }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        #diko mou
        isOwnerOrg:Organization
        isOwnerAct:Action
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getOrganizations: [Organization]
        getActions:[Action]
     }
    #dika mou
    type Organization{
        id:ID!
        orgName:String!
        orgDescription:String!
        orgActions:[Action]
        orgPosts:[Post]
        orgLocationLat:Float!
        orgLocationLong:Float!
        orgType:String!
        orgOwner:User!
    }
    input OrganizationInput{
        orgName:String!
        orgDescription:String!
        orgLocationLat:Float!
        orgLocationLong:Float!
        orgType:String!
    }
    type Action{
        id:ID!
        actName:String!
        actDescription:String!
        actLocationLat:Float!
        actLocationLong:Float!
        actType:String!
        actOrg:Organization
        actOwner:User!
        #sto type prepei na epilegei anamesa se 6 types klp
    }
    input ActionInput{
        actName:String!
        actDescription:String!
        actLocationLat:Float!
        actLocationLong:Float!
        actType:String!
    }
    #telos dikwn mou
    #registeInput of type RegisterInput
    type Mutation{
        register(registerInput:RegisterInput):User!
        login(username: String!,password:String!):User!
        createPost(body:String!):Post!
        deletePost(postId:ID!):String!
        createComment(postId:ID!,body:String!):Post!
        deleteComment(postId:ID!,commentId:ID!):Post!
        likePost(postId:ID!):Post!
        #dika mou apo katw
        createOrg(organizationInput:OrganizationInput):Organization!
        createAction(actionInput:ActionInput):Action!
    }
    type Subscription{
        newPost:Post!
    }
`;