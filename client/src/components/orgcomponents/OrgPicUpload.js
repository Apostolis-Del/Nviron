import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";


// pass in the UploadMutation mutation we created earlier.
function OrgPicUpload({profilepic,orgname}){

  const mutation = profilepic ? UPLOAD_PROFILE_PIC : UPLOAD_COVER_PIC;

  const [uploadFile] = useMutation(mutation,{
      onCompleted: data=>console.log(data)
  });
  console.log(orgname,"sto orgpicupload")
  const handleFileChange =(e) =>{
    const file = e.target.files[0];
    if(!file) return
    uploadFile({variables:{file,orgname:orgname}})
  }
  return(
    <div>
    {/* <h1>Upload File</h1> */}
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

const UPLOAD_COVER_PIC = gql`
  mutation uploadOrgCoverPic($file: Upload! $orgname:String!) {
    uploadOrgCoverPic(file: $file orgname:$orgname) {
      url
      mimetype
      id
      filename
      path
    }
  }
`;
const UPLOAD_PROFILE_PIC = gql`
  mutation uploadOrgProfilePic($file: Upload! $orgname: String!) {
    uploadOrgProfilePic(file: $file orgname:$orgname) {
      url
      mimetype
      id
      filename
      path
    }
  }
`;

export default OrgPicUpload;