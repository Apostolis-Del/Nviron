const shortid = require('shortid')
const path =require('path')
const fs =require('fs')
const checkAuth= require('../../util/check-auth');
const User = require('../../models/User')
// import our model
const File = require('../../models/Files');

function generateRandomString(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

module.exports={
 Query:{
    async files(){
          try{
            const files= await File.find();
            return files;
          }catch(err){
            throw new Error(err);
          }

     }
     //,
    // async getProfilePic(){
    //   try{
    //     const files= await File.find();
    //     return files;
    //   }catch(err){
    //     throw new Error(err);
    //   }
  //}
 },
  Mutation: {
    uploadFile: async (parent,{file})=>{
        const {createReadStream,filename,mimetype,encoding}=await file;

        const {ext,name}= path.parse(filename);
        const randomName=generateRandomString(12)+ext;

        const stream= createReadStream();
        const pathName= path.join(__dirname,`../../public/images/${randomName}`);
        await stream.pipe(fs.createWriteStream(pathName));

        const newpic = new File({
          url:`http://localhost:5000/images/${randomName}`,
          filename:filename ,
          mimetype: mimetype,
          path: pathName
        });
        const newpic2= await newpic.save();

        return newpic2;
            // url:`http://localhost:5000/images/${randomName}`,
            // filename:filename ,
            // mimetype: mimetype,
            // path: pathName
        

    },
    uploadProfilePic: async (parent,{file},context)=>{
      const {createReadStream,filename,mimetype,encoding}=await file;

      const {ext,name}= path.parse(filename);
      const randomName=generateRandomString(12)+ext;

      const stream= createReadStream();
      const pathName= path.join(__dirname,`../../public/images/profileimages/${randomName}`);
      await stream.pipe(fs.createWriteStream(pathName));

      const newpic = new File({
        url:`http://localhost:5000/images/profileimages/${randomName}`,
        filename:filename ,
        mimetype: mimetype,
        path: pathName
      });
      const newpic2= await newpic.save();

      const user= checkAuth(context);

      User.findOneAndUpdate({username:user.username}, {$set:{profilePic:`http://localhost:5000/images/profileimages/${randomName}`}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data with image user");
        }
    
       });

      return newpic2;
          // url:`http://localhost:5000/images/${randomName}`,
          // filename:filename ,
          // mimetype: mimetype,
          // path: pathName
      
    }
  }
};