const Organization = require('../../models/Organization');
const User = require('../../models/User');
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
        }
    },
    Mutation:{
            async createOrg(_,{organizationInput:{orgName,orgDescription,orgLocationLat,orgLocationLong,orgType}},context){
                //Checks the authorization and returns the user if correct
                const user= checkAuth(context);
                
                //TODO EDW PREPEI NA KANOUME VALIDATE TA STOIXEIA

                console.log(user);
               /* if(body.trim()===''){
                    throw new Error('Organization body must not be empty');
                }*/
                //twra mporei na kanei allow to action pou tou dinoume na kanei
                const newOrganization= new Organization({
                    orgName,
                    orgDescription,
                    orgLocationLat,
                    orgLocationLong,
                    orgType,
                    orgOwner: {...user}
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
                User.findOneAndUpdate({username:user.username}, {$set:{isOwnerOrg:newOrganization}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                    console.log(doc);
                });

                return organization;
            }
    }
}