const Post = require('../../models/Post');
const OrgPost = require('../../models/OrgPost');
const Action = require('../../models/Action');
const {AuthenticationError , UserInputError} = require('apollo-server');
const checkAuth= require('../../util/check-auth');
const organizations = require('./organizations');

module.exports={
    Mutation:{
        createComment: async (_,{postId,body,},context) => {
            const {username,profilePic} = checkAuth(context);
            if(body.trim() ===''){
                throw new UserInputError('Empty comment',{
                    errors:{
                        body:'Comment body must not empty'
                    }
                })
            }
            const post = await Post.findById(postId);
            //mongoose turns data mdoels to json objects normal javascript objects
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt:new Date().toISOString(),
                    profilePic:profilePic
                })
                await post.save();
                return post;
            }else throw new UserInputError('Post not found');
        },
        async deleteComment(_,{postId,commentId},context){
            const post = await Post.findById(postId);
            const {username } = checkAuth(context);

            if(post){
             const commentIndex = post.comments.findIndex((c)=>c.id === commentId);

             if(post.comments[commentIndex].username === username) {
                 post.comments.splice(commentIndex,1);
                 await post.save();
                 return post;
             }else{
                 throw new AuthenticationError('Action not allowed');
             }
        }else{
            throw new UserInputError('Post not found');
        }
        },
        createOrgComment: async (_,{postId,body,},context) => {
            const {username,profilePic} = checkAuth(context);
            if(body.trim() ===''){
                throw new UserInputError('Empty comment',{
                    errors:{
                        body:'Comment body must not empty'
                    }
                })
            }
            const post = await OrgPost.findById(postId);
            //mongoose turns data mdoels to json objects normal javascript objects
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt:new Date().toISOString(),
                    profilePic:profilePic
                })
                await post.save();
                return post;
            }else throw new UserInputError('Post not found');
        },
        async deleteOrgComment(_,{postId,commentId},context){
            const post = await OrgPost.findById(postId);
            const {username } = checkAuth(context);
            console.log(post)
            if(post){
             const commentIndex = post.comments.findIndex((c)=>c.id === commentId);

             if(post.comments[commentIndex].username === username) {
                 post.comments.splice(commentIndex,1);
                 await post.save();
                 return post;
             }else{
                 throw new AuthenticationError('Action not allowed');
             }
        }else{
            throw new UserInputError('Post not found');
        }
},
    createActComment: async (_,{actId,body,},context) => {
        const {username,profilePic} = checkAuth(context);

        if(body.trim() ===''){
            throw new UserInputError('Empty comment',{
                errors:{
                    body:'Comment body must not empty'
                }
            })
        }
        const act = await Action.findById(actId);
        //mongoose turns data mdoels to json objects normal javascript objects
        if(act){
            act.comments.unshift({
                body,
                username,
                createdAt:new Date().toISOString(),
                profilePic:profilePic
            })
            await act.save();
            return act;
        }else throw new UserInputError('act not found');
    },
    async deleteActComment(_,{actId,commentId},context){
        const act = await Action.findById(actId);
        const {username } = checkAuth(context);

        if(act){
        const commentIndex = act.comments.findIndex((c)=>c.id === commentId);

        if(act.comments[commentIndex].username === username) {
            act.comments.splice(commentIndex,1);
            await act.save();
            return act;
        }else{
            throw new AuthenticationError('Action not allowed');
        }
    }else{
        throw new UserInputError('act not found');
    }
    }
}
}