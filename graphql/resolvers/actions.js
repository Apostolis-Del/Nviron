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
        },
        async getAction(_,{actId}){
            try{
                const action = await Action.findById(actId);
                if(action){
                    return action;
                }else{
                    throw new Error('Action not found');
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async getActionbyType(_,{actType}){
            try{
                const actions= await Action.find(actType);
                console.log(actions);
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
                    actOwner:{...user},
                    profilePic:''
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
            ,
            async deleteAct(_,{actId} , context){
              const user = checkAuth(context);
      
              try{
                  const act = await Action.findById(actId);
                  console.log(act.actOwner.username)
                  if(user.username === act.actOwner.username){
                      await act.delete();
                      return 'Action deleted successfully';
                  }else {
                      throw new AuthenticationError('Action not allowed');
                  }
              }catch(err){
                  throw new Error(err);
              }
          }
          ,
            async likeAct(_,{actId},context){
                const {username} = checkAuth(context);
                const act = await Action.findById(actId);
                if(act){
                    if(act.likes.find(like =>like.username ===username)){
                        //post already likes, unlike it
                        act.likes = act.likes.filter(like=>like.username !== username);
                    }else {
                        //Not liked ,like post
                        act.likes.push({
                            username,
                            createdAt: new Date().toISOString()
                        })
                    }
                    await act.save();
                    return act;
                }else throw new UserInputError('Act post not found')
            }
    },
    Subscription: {
        newAction: {
            subscribe: (_, __, {pubsub} ) => pubsub.asyncIterator('NEW_ACTION')
        }
    }
}