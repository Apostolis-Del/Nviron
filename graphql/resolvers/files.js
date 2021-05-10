const shortid = require('shortid')
const path =require('path')
const fs =require('fs')
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
        

    }
  //   uploadFile: async (parent, { file }) => {
  //     const {
  //         createReadStream,
  //         filename,
  //         mimetype,
  //         encoding,
  //     } = await file;

  //     const stream = await createReadStream();
  //     const pathName = path.join(__dirname, `/public/images/${filename}`);

  //     await new Promise((resolve, reject) => {
  //         const writeStream = fs.createWriteStream(pathName);
  //         stream
  //             .pipe(writeStream)
  //             .on('finish', resolve)
  //             .on('error', reject);
  //     });

  //     return {
  //         url: `http://localhost:4000/images/${filename}`,
  //     };
  // },
  }
};