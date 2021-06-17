const Organization = require('../../models/Organization');
const User = require('../../models/User');
const Post = require('../../models/Post');
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
        async getOrganizationsbyName(_,{orgName}){
            try{
                const organizations= await Organization.find(orgName);
                console.log(organizations);
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
                //Checks the authorization and returns the user if correct
                const user= checkAuth(context);
                
                //TODO EDW PREPEI NA KANOUME VALIDATE TA STOIXEIA
                
               // console.log(user);
               /* if(body.trim()===''){
                    throw new Error('Organization body must not be empty');
                }*/

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
                    profilePic:''
                });

              

                const organization= await newOrganization.save();
    
                context.pubsub.publish('NEW_ORGANIZATION',{
                    newOrganization: organization
                });

              /*  const newuser = {...user,isOwnerOrg:newOrganization};
                console.log(newuser);
                const newuser2 = await newuser.update();*/
                
            /* const newUser= User({
                    ...user,
                    isOwnerOrg:newOrganization
                });
                console.log(newUser);
                const user2= await newUser.updateOne();
                context.pubsub.publish('NEW_USER',{
                    newUser: user2
                });
*/
                User.findOneAndUpdate({username:user.username}, {$push:{isOwnerOrg:newOrganization}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                   // console.log(doc);
                });

                return organization;
            }
            
     ,
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
                return 'Organization deleted successfully';
            }else {
                throw new AuthenticationError('Action not allowed');
            }
        }catch(err){
            throw new Error(err);
        }
    }
    }
}