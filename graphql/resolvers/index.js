const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const organizationsResolvers = require('./organizations');
const actionResolvers = require('./actions');
const orgpostResolvers = require('./orgposts')
const filesResolvers = require('./files')
const updateResolvers = require('./updates')

//kati gia na einai ola mazi ta resolvers apta alla files kai na ta kanei export sto geniko index.js
module.exports = {
    Post:{
        //auto einai ena modifier kai kathe fora pou kaloume kati(pou kaleitai mutation i subscription ) pernaei apo auto to modifier
        likeCount(parent){
            return parent.likes.length;
        },
        commentCount(parent){
            return parent.comments.length;
        }
    },
    Action:{
        //auto einai ena modifier kai kathe fora pou kaloume kati(pou kaleitai mutation i subscription ) pernaei apo auto to modifier
        attendCount(parent){
            return parent.attendedUsername.length;
        }
    },
    OrgPost:{
        //auto einai ena modifier kai kathe fora pou kaloume kati(pou kaleitai mutation i subscription ) pernaei apo auto to modifier
        likeCount(parent){
            return parent.likes.length;
        },
        commentCount(parent){
            return parent.comments.length;
        }
    },
    Action:{
        //auto einai ena modifier kai kathe fora pou kaloume kati(pou kaleitai mutation i subscription ) pernaei apo auto to modifier
        likeCount(parent){
            return parent.likes.length;
        },
        commentCount(parent){
            return parent.comments.length;
        }
    },
    Query: {
        ...postsResolvers.Query,
        ...organizationsResolvers.Query,
        ...actionResolvers.Query,
        ...orgpostResolvers.Query,
        ...usersResolvers.Query,
        ...filesResolvers.Query

    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...organizationsResolvers.Mutation,
        ...actionResolvers.Mutation,
        ...orgpostResolvers.Mutation,
        ...filesResolvers.Mutation,
        ...updateResolvers.Mutation
    },
    Subscription:{
        ...postsResolvers.Subscription,
        ...orgpostResolvers.Subscription,
        ...usersResolvers.Subscription
    }
}