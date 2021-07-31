const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput,validateLoginInput}= require('../../util/validators');
const checkAuth= require('../../util/check-auth');

const OrgPost = require('../../models/OrgPost');
const Organization = require('../../models/Organization');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id:user.id,
        email:user.email,
        username:user.username,
        profilePic:user.profilePic,
        isOwnerOrg:user.isOwnerOrg,
        //subscribed:user.subscribed
    },
    SECRET_KEY,
    {expiresIn:'1h'}
    );

}
//ta args edw einai apo ta typedefs(ta args pou exoume orisei sta mutations)
module.exports = {
    Query:{
        async getUserAndPics(){
            try{
                const users= await User.find();
                return users;
            }catch(err){
                throw new Error(err);
            }
        },
        async getSubscribedOrgs(_,username,context){
             //const {username} = checkAuth(context);
             const user1=await User.findOne(username);
            //console.log(user1)
            return user1
         },
         async getSubscribedOrgs2(_,username,context){
            //const {username} = checkAuth(context);
            const user1=await User.findOne(username).lean();
            //console.log(user1)
            const subscribedorgs=user1.subscribed;
            //console.log(subscribedorgs)
            const orgname1="enas allos organismos"
             const post1=await OrgPost.find({orgname1}).sort({ createdAt: -1 });
             //console.log(post1,"to post1")
            var posts;
            const kati= subscribedorgs.forEach( function(subscribedorgs){
                const orgname=subscribedorgs.orgName
                console.log(orgname,"TO ORGNAME")
                posts= OrgPost.find({orgname}).sort({ createdAt: -1 });
                //console.log(posts)
                }
                )

                //console.log(posts,"TA POSTSSSSSSS")
           return posts
           
        }
    },
    Mutation: {
        async login(_,{username,password}){
            const {errors,valid}= validateLoginInput(username,password);
            
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general= 'User not found';
                throw new UserInputError('User not found',{errors});
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general='Wrong credentials';
                throw new UserInputError('Wrong credentials',{errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id:user._id,
                token,
                profilePic:user.profilePic,
                isOwnerOrg:user.isOwnerOrg,
            };
        },

        //kanoume destructure to registerinput gia na mporoume na paroume ta data pio katw
        async register(
            _,
            {registerInput:{username,email,password,confirmPassword}}
            ){
            //Validate user data
            const {valid,errors} = validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            //Make sure user doesnt already exist
            const user=await User.findOne({username});
            if(user) {
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
            
            // Hash password and create auth token
            password= await bcrypt.hash(password, 12);
            
            const newUser= new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                isOwnerOrg:[],
                isOwnerAct:[],
                profilePic:''
            });
            //save to database
            const res = await newUser.save();

            const token = generateToken(res);
            //mongoose document
            return {
                ...res._doc,
                id:res._id,
                token
            };
        },
        async subscribeOrg(_,{orgId},context){
            const {username} = checkAuth(context);
            const user=await User.findOne({username});
            const org = await Organization.findById(orgId);
            const orgname2=org.orgName
            if(org){
                if(user.subscribed.find(subscribed =>subscribed.orgName ===org.orgName)){
                    //post already likes, unlike it
                    user.subscribed = user.subscribed.filter(subscribed=>subscribed.orgName  !== org.orgName);
                }else {
                    //Not liked ,like post
                    user.subscribed.push({
                        id:org.id,
                        orgName:org.orgName,
                        orgDescription:org.orgDescription,
                        orgLocationLat:org.orgLocationLat,
                        orgLocationLong:org.orgLocationLong,
                        orgType:org.orgType,
                        orgOwner:org.orgOwner,
                        profilePic:org.profilePic
                    })
                }
                await user.save();
                return user;
            }else throw new UserInputError('Organization or User not found')
        }
    },
    Subscription: {
        newUserSub: {
            subscribe: (_, __, {pubsub} ) => pubsub.asyncIterator('NEW_USER')
        }
    }
}