import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";


// pass in the UploadMutation mutation we created earlier.
function FileUpload({profilepic}){

  const mutation = profilepic ? UPLOAD_PROFILE_PIC : UPLOAD_FILE;

  const [uploadFile] = useMutation(mutation,{
      onCompleted: data=>console.log(data)
  });

  const handleFileChange =(e) =>{
    const file = e.target.files[0];
    if(!file) return
    uploadFile({variables:{file}})
  }
  return(
    <div>
    <h1>Upload File</h1>
    <input type="file" onChange={handleFileChange}/>
    </div>
  )
  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     // select the first file from the Array of files
  //     const file = acceptedFiles[0];
  //     // use the uploadFile variable created earlier
  //     uploadFile({
  //       // use the variables option so that you can pass in the file we got above
  //       variables: { file },
  //       onCompleted: () => {},
  //     });
  //   },
  //   // pass in uploadFile as a dependency
  //   [uploadFile]
  // );
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  // });
  // return (
  //   <>
  //     <div {...getRootProps()} className={`dropzone ${isDragActive && "isActive"}`}>
  //       <input {...getInputProps()} />
  //       {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
  //     </div>
  //   </>
  // );
  
};

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
      mimetype
      id
      filename
      path
    }
  }
`;
const UPLOAD_PROFILE_PIC = gql`
  mutation uploadProfilePic($file: Upload!) {
    uploadProfilePic(file: $file) {
      url
      mimetype
      id
      filename
      path
    }
  }
`;

export default FileUpload;