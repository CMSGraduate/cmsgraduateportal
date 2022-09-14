import React,{useState,useEffect} from "react";
import ViewAnnouncement from "./ViewAnnouncement";
import ViewNotification from "./ViewNotification";
import { useSelector } from "react-redux";
import Notverified from './Notverified'
import studentService from "../../API/students";
import { Label } from "@material-ui/icons";

const HomeStudentMs = () => {
  const { user } = useSelector((state) => state.auth);
  
  const userRole = user.user.userRole[0].role;
  let userProgram;
  if (userRole === "STUDENT") {
    userProgram = user.user.student.program_id.programShortName;
    // console.log(userRole);
  }
  return (

    <div style={{ textAlign: "center" }}>

      <>
      <div style={{display:'flex',flexDirection:'row',marginLeft:'41.5%'}}>
      <h1 style={{marginRight:"60%"}}>Welcome!</h1>
      </div>
      
      <p> {`Your are logged in as MS Student`}</p>

      <h3> Notification </h3>
      <ViewNotification />
      <h3> Announcement </h3>
      <ViewAnnouncement />
      </>
     
    </div>
  );
};

export default HomeStudentMs;
