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
                        await OrgPost.updateMany({username:user.username}, {$set:{username:username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST 1");
                            }
                        
                        });
                        //update orgpost likes
                        await OrgPost.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST 2");
                            }
                        
                        });
                        //update orgpost comments
                        await OrgPost.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! ORGPOST comments 2");
                            }
                        
                        });

                        //update post username
                        await Post.updateMany({username:user.username}, {$set:{username:username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 1");
                            }
                        
                        });
                        //update post likes
                        await Post.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 2");
                            }
                        
                        });
                        //update post comments
                        await Post.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST comments 2");
                            }
                        
                        });
                        //update action likes
                        await Action.updateMany({ "likes.username":user.username}, {$set:{"likes.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! action likes ");
                            }
                        
                        });
                        //update action comments
                        await Action.updateMany({ "comments.username":user.username}, {$set:{"comments.$.username":username}}, {new: true}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data! POST 2");
                            }
                        
                        });
                  }

                password= await bcrypt.hash(password, 12);

                //update user
                const newUser =await User.findOneAndUpdate({username:user.username}, {$set:{
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
                    await Action.updateMany({ actOwner :user2}, {$set:{"actOwner":user2}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data! actOwner");
                        }
                    
                    });


                    //update organization.orgOwner.username
                    await Organization.updateMany({ orgOwner :user2}, {$set:{"orgOwner":user2}}, {new: true}, (err, doc) => {
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
            },
            async updateOrganization (_, { updateOrgInput:{orgName,orgDescription,orgLocationLat,orgLocationLong,orgType}},context) { 
                
                const user= checkAuth(context);

                //validate to orgname
                const orgnamesame=await Organization.findOne({orgName});
                if(orgnamesame) {
                    throw new UserInputError('Organization Name is taken',{
                        errors:{
                            email:' This Organization Name is taken'
                        }
                    });
                }


                    console.log(orgnamesame);

                    const orgname2= user.isOwnerOrg.orgName
                    console.log(orgname2)
                    //update user
                    Organization.findOneAndUpdate({orgName: orgname2}, {$set:{
                        orgName:orgName,
                        orgDescription:orgDescription,
                        orgLocationLat:orgLocationLat,
                        orgLocationLong:orgLocationLong,
                        orgType:orgType,
                        orgOwner:user}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    
                    });
                  

                  const org2 = await Organization.findOne({orgName});
                
               console.log(org2,"TO NEWORG2")
               console.log(user.isOwnerOrg.orgName,"TO ISOWNERORG")
                

                    //update action.actOwner.username
                     User.findOneAndUpdate({"isOwnerOrg.orgName" :user.isOwnerOrg.orgName}, {$set:{isOwnerOrg:org2}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data! actOwner");
                        }
                    
                    });


                 
                return {
                    org2
                };
            }
        }
}