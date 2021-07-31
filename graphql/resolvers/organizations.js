const Organization = require('../../models/Organization');
const User = require('../../models/User');
const Post = require('../../models/Post');
const OrgPost = require('../../models/OrgPost');
const checkAuth= require('../../util/check-auth');
const {AuthenticationError, UserInputError}= require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

module.exports = {
    Query :{
        async getOrganizations(){
            try{
                const organizations= await Organization.find();
                return organizations;
            }catch(err){
                throw new Error(err);
            }
        },
        async getOrganizationsbyName(_,orgName){
            try{
                const organizations= await Organization.find(orgName);
                console.log(organizations);
                return organizations;
            }catch(err){
                throw new Error(err);
            }
        },
        async getOrganizationsbyOwner(_,{orgOwner}){
            try{
                const organizations= await Organization.find({"orgOwner.username":orgOwner});
                //console.log(orgOwner);
                return organizations;
            }catch(err){
                throw new Error(err);
            }
        },
        async getOrganization(_,{orgId}){
            try{
                const org = await Organization.findById(orgId);
                if(org){
                    return org;
                }else{
                    throw new Error('Organization not found');
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async getOrganizationsbyType(_,{orgType}){
            try{
                const organizations= await Organization.find(orgType);
                console.log(organizations);
                return organizations;
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation:{
            async createOrg(_,{organizationInput:{orgName,orgDescription,orgLocationLat,orgLocationLong,orgType}},context){

                const user= checkAuth(context);    
                const orgnamesame=await Organization.findOne({orgName});
                if(orgnamesame) {
                    throw new UserInputError('Organization Name is taken',{
                        errors:{
                            email:' This Organization Name is taken'
                        }
                    });
                }
                //twra mporei na kanei allow to action pou tou dinoume na kanei
                const newOrganization= new Organization({
                    orgName,
                    orgDescription,
                    orgLocationLat,
                    orgLocationLong,
                    orgType,
                    orgOwner: {...user},
                    profilePic:'',
                    donations:[],
                    facebookLink:'',
                    youtubeLink:'',
                    twitterLink:'',
                    instagramLink:''
                });

                const organization= await newOrganization.save();
                context.pubsub.publish('NEW_ORGANIZATION',{
                    newOrganization: organization
                });

                User.findOneAndUpdate({username:user.username}, {$push:{isOwnerOrg:newOrganization}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                   // console.log(doc);
                });

                return organization;
            },
                async deleteOrg(_,{orgId} , context){
                    const user = checkAuth(context);

                    try{
                        const org = await Organization.findById(orgId);
                        if(user.username === org.orgOwner.username){
                            await org.delete();
                            User.findOneAndUpdate({isOwnerOrg: org}, {$set:{isOwnerOrg:''}}, {new: true}, (err, doc) => {
                                if (err) {
                                    console.log("Something wrong when updating data!");
                                }
                            
                            });
                            OrgPost.deleteMany({"orgname": org.orgName});
                            return 'Organization deleted successfully';
                        }else {
                            throw new AuthenticationError('Action not allowed');
                        }
                    }catch(err){
                        throw new Error(err);
                    }
                },
                async addFacebook(_,{orgname,facebooklink},context){
                    const org= Organization.findOneAndUpdate({orgName:orgname}, {$set:{facebookLink:facebooklink}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    
                    });
                
                    return org
                },
                async addInstagram(_,{orgname,instagramlink},context){
                    const org= Organization.findOneAndUpdate({orgName:orgname}, {$set:{instagramLink:instagramlink}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    
                    });
                
                    return org
                },
                async addTwitter(_,{orgname,twitterlink},context){
                    const org= Organization.findOneAndUpdate({orgName:orgname}, {$set:{twitterLink:twitterlink}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    
                    });
                
                    return org
                },
                async addYoutube(_,{orgname,youtubelink},context){
                    const org= Organization.findOneAndUpdate({orgName:orgname}, {$set:{youtubeLink:youtubelink}}, {new: true}, (err, doc) => {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    
                    });
                
                    return org
                },
                async createDonation(_,{orgId} , context){
                    const {username} = checkAuth(context);
                    const org = await Organization.findById(orgId);
                    if(org){
                        if(org.donations.find(don =>don.username ===username)){
                            //post already likes, unlike it
                            org.donations = org.donations.filter(don=>don.username !== username);
                        }else {
                            //Not liked ,like post
                            org.donations.push({
                                username,
                                donateDate: new Date().toISOString()
                            })
                        }
                        await org.save();
                        return org;
                    }else throw new UserInputError('Post not found')
                }

    }
}