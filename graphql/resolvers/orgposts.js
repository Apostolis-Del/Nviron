const OrgPost = require('../../models/OrgPost');
const User = require('../../models/User');
const checkAuth= require('../../util/check-auth');
const {AuthenticationError, UserInputError}= require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');
const Organization = require('../../models/Organization');

module.exports = {
Query :{
    async getOrgPosts(){
        try{
            const posts= await OrgPost.find().sort({ createdAt: -1 });
            return posts;
        }catch(err){
            throw new Error(err);
        }
    },
    async getOrgPost(_,{postId}){
        try{
            const post = await OrgPost.findById(postId);
            if(post){
                return post;
            }else{
                throw new Error('Post not found');
            }
        }catch(err){
            throw new Error(err);
        }
    },
    async getOrgPostsByName(_,{orgname}){
        try{
            //var query={postId}
            const posts= await OrgPost.find({orgname}).sort({ createdAt: -1 });
            console.log(posts);
            return posts;
        }catch(err){
            throw new Error(err);
        }
    }
    },
    //mesa sto context yparxei to request body
    Mutation: {
        async createOrgPost(_,{body},context){
            //Checks the authorization and returns the user if correct

            const user= checkAuth(context);
            //AUTO EDW LEITOURGEI
            // const foundOrg = await Organization.findOne({orgName:'enas allos organismos'},{ 'orgOwner.username':2}, (err, result) => {
            //     console.log(result);
            // }).lean();

            // console.log(foundOrg.orgOwner.username);
            console.log(user.username)
            const foundOrg = await Organization.findOne({'orgOwner.username':user.username},{ 'orgName':2}, (err, result) => {
                console.log(result);
            }).lean();

            console.log(foundOrg.orgName);
        


            if(body.trim()===''){
                throw new Error('Org Post body must not be empty');
            }
            //console.log(user,isOwnerOrg.orgName)
            const {isOwnerOrg}=user;
            //console.log(isOwnerOrg)
            //twra mporei na kanei allow to action pou tou dinoume na kanei
            const newPost= new OrgPost({
                body,
                user: user.id,
                username: user.username,
                orgname:foundOrg.orgName,
                createdAt: new Date().toISOString(),
                profilePic:''
            });
            const post= await newPost.save();

            context.pubsub.publish('NEW_POST',{
                newPost: post
            });
            return post;
        },
        async deleteOrgPost(_,{postId} , context){
            const user = checkAuth(context);

            try{
                const post = await OrgPost.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully';
                }else {
                    throw new AuthenticationError('Action not allowed');
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async likeOrgPost(_,{postId},context){
            const {username} = checkAuth(context);
            const post = await OrgPost.findById(postId);
            if(post){
                if(post.likes.find(like =>like.username ===username)){
                    //post already likes, unlike it
                    post.likes = post.likes.filter(like=>like.username !== username);
                }else {
                    //Not liked ,like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            }else throw new UserInputError(' Org Post not found')
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub} ) => pubsub.asyncIterator('NEW_POST')
        }
    }
};