const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput,validateLoginInput}= require('../../util/validators');

const User = require('../../models/User');

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
//ta args edw einai apo ta typedefs(ta args pou exoume orisei sta mutations)
module.exports = {
    Query:{
        async getUserAndPics(){
            try{
                const user= await User.find();
                return users;
            }catch(err){
                throw new Error(err);
            }
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
                token
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
                isOwnerOrg:{},
                isOwnerAct:{},
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
        }
    }
}