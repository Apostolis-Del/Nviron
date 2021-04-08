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
     }
    #dika mou
    type Organization{
        id:ID!
        orgName:String!
        orgDescription:String!
        orgAction:[Action]
        orgPosts:[Post]
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
        #sto type prepei na epilegei anamesa se 6 types klp
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
    }
    type Subscription{
        newPost:Post!
    }
`;