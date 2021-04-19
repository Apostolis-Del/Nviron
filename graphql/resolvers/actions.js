const Action = require('../../models/Action');
const Organization = require('../../models/Organization');
const User = require('../../models/User');
const checkAuth= require('../../util/check-auth');
const {AuthenticationError, UserInputError}= require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

module.exports = {
    Query :{
        async getActions(){
            try{
                const actions= await Action.find();
                return actions;
            }catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation:{
            async createAction(_,{actionInput:{actName,actDescription,actLocationLat,actLocationLong,actType}},context){
                //Checks the authorization and returns the user if correct
                const user= checkAuth(context);
                
                //TODO EDW PREPEI NA KANOUME VALIDATE TA STOIXEIA

                console.log(user);
               /* if(body.trim()===''){
                    throw new Error('Organization body must not be empty');
                }*/
                //twra mporei na kanei allow to action pou tou dinoume na kanei
            
                //TODO:VALIDATE IF ACT OWNER === ORG.OWNER

                const newAction= new Action({
                    actName,
                    actDescription,
                    actLocationLat,
                    actLocationLong,
                    actType,
                    actOwner:{...user}
                });

                console.log(user.username);
                User.findOneAndUpdate({username:user.username}, {$set:{isOwnerAct:newAction}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                   // console.log(doc);
                });
            

                const action= await newAction.save();
    
                context.pubsub.publish('NEW_ACTION',{
                    newAction: action
                });
                return action;
            }
    }
}