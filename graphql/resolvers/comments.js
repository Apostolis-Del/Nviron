const Post = require('../../models/Post');
const OrgPost = require('../../models/OrgPost');
const {AuthenticationError , UserInputError} = require('apollo-server');
const checkAuth= require('../../util/check-auth');

module.exports={
    Mutation:{
        createComment: async (_,{postId,body,},context) => {
            const {username} = checkAuth(context);
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
                    createdAt:new Date().toISOString()
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
            const {username} = checkAuth(context);
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
                    createdAt:new Date().toISOString()
                })
                await post.save();
                return post;
            }else throw new UserInputError('Post not found');
        },
        async deleteOrgComment(_,{postId,commentId},context){
            const post = await OrgPost.findById(postId);
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
}
}
}