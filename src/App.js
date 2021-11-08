import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone'


const UserProfiles = () => {

  const [UserProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () =>{
    axios.get("http://localhost:8080/api/v1/upload-image").then(res =>{
      console.log(res);
      setUserProfiles(res.data);
    });
  };
 
  useEffect(() => {
    fetchUserProfiles();
  }, []); //the array is there to restart the useeffect if there is a change in the response
  
  return UserProfiles.map((userProfile, index) => {

    return (
      <div key={index}>
        {
          userProfile.userProfileId ? 
            (<img src={`http://localhost:8080/api/v1/upload-image/${userProfile.userProfileId}/image/download`}/>) : null
        }
        <br/>
        <br/>
        <h1>{userProfile.username}</h1>
        <p>{userProfile.userProfileId}</p>
        
        <Dropzone {...userProfile}/> 
        {/* or <Dropzone userProfileId = {userProfile.userProfileId} */}
        <br/>
      </div>
    )
  })
};

function Dropzone({userProfileId}) {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    axios.post(
      `http://localhost:8080/api/v1/upload-image/${userProfileId}/image/upload`,
      formData,
      {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(() => {
      console.log("file uploaded successfully")
    }).catch(err => {
      console.log(err);
    });
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop Image here!</p> :
          <p>Drag and drop Profile Image here, or click to select one</p>
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">

      <UserProfiles/>
    </div>
  );
}

export default App;
