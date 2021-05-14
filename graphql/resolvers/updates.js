const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Action = require('../../models/Action')
const OrgPost = require('../../models/OrgPost');
const Organization = require('../../models/Organization');

const { SECRET_KEY } = require('../../config');
const jwt = require('jsonwebtoken');
const checkAuth= require('../../util/check-auth');
const {AuthenticationError, UserInputError}= require('apollo-server');
const {validateRegisterInput,validateLoginInput}= require('../../util/validators');

function generateToken(user){
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username
    },
    SECRET_KEY,
    {expiresIn:'1h'}
    );

}
module.exports = {

    Mutation :{
        async updateUser (_, { updateInput:{username,email,password,confirmPassword}},context) { 
                
                const user= checkAuth(context);

                const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword);

                if(!valid){
                    throw new UserInputError('Errors',{errors});
                }
                //Make sure user doesnt already exist
                const user1=await User.findOne({username});
                if(user1) {
                    throw new UserInputError('Username is taken',{
                        errors:{
                            username:' This username is taken'
                        }
                    });
                }

                const emailsame=await User.findOne({email});
                if(emailsame) {
                    throw new UserInputError('Email is taken',{
                        errors:{
                            email:' This email is taken'
                        }
                    });
                }

                 if(valid){

                       //update orgpost username
                        OrgPost.updateMany({username:user.username}, {$set:{username:username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST 1");
                            }
                        
                        });
                        //update orgpost likes
                        OrgPost.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST 2");
                            }
                        
                        });
                        //update orgpost comments
                        OrgPost.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST comments 2");
                            }
                        
                        });

                        //update post username
                        Post.updateMany({username:user.username}, {$set:{username:username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 1");
                            }
                        
                        });
                        //update post likes
                        Post.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 2");
                            }
                        
                        });
                        //update post comments
                        Post.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST comments 2");
                            }
                        
                        });
                        //update action likes
                        Action.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! action likes ");
                            }
                        
                        });
                        //update action comments
                        Action.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 2");
                            }
                        
                        });
                  }

                password= await bcrypt.hash(password, 12);

                //update user
                const newUser = User.findOneAndUpdate({username:user.username}, {$set:{
                    username:username,
                    email:email,
                    password:password,
                    confirmPassword:confirmPassword,isOwnerOrg:user.isOwnerOrg,isOwnerAct:user.isOwnerAct}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                // console.log(doc);
                });
                
                const user2 = await User.findOne({username});
                
               
                if(newUser){

                    //update action.actOwner.username
                    Action.updateMany({ actOwner :user2}, {$set:{"actOwner":user2}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data! actOwner");
                        }
                    
                    });


                    //update organization.orgOwner.username
                    Organization.updateMany({ orgOwner :user2}, {$set:{"orgOwner":user2}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data! orgOwner");
                        }

                    });
                 }
                const token = generateToken(newUser);
                // console.log(user2)
                return {
                    ...user2._doc,
                    id:user2._id,
                    token
                };
            }
        }
}