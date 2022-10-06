import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Button} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Verified from "./Verifiedd"
import adminService from "../../API/admin";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import axios from 'axios'
import Modal from "@mui/material/Modal";
const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  borderRadius: "6px",
  boxShadow: 24,
  p: 3,
};
const Result = () => {
 // const {state}=useLocation();
  //const navigate=useNavigate()
  const [verified,setverified]=useState()
  const { currentRole } = useSelector((state) => state.userRoles);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification,setnotification]=useState()
  const {user} = useSelector((state) => state.auth);
  console.log("user",user)
  //const Resultt=state.data.student_id.Result;

 
 
  return (
    
    <Paper
      variant="outlined"
      elevation={7}
      //key={""}
      style={{
        display: "grid",
        placeItems: "center",
        // placeContent: "center",
        marginBottom: "2rem",
      }}
    >
      
      
      
     { user?.user?.student?.Result?.map((value,index)=>(
          value.Freeze?<div></div>:

     <div>
     
      <label style={{marginLeft:100,marginTop:20,fontWeight:'bold',fontSize:22,marginBottom:'20px'}}>Semester: {value.semester}</label>
      
      {value.Result?.map((val,index)=>(
        
        <table
          cellSpacing={4}
          cellPadding={6}
          style={{
            color: "#333333",
            borderCollapse: "separate",
            padding: ".5rem",
            /* margin: "1rem", */
            /* border: "2px solid #572E74",
                    borderRadius: "6px", */
          }}
        >
          <colgroup className="cols">
            <col className="col1" />
            <col className="col2" />
            <col className="col3" />
            <col className="col4" />
          </colgroup>
          <tbody>
            
            <tr
              style={{
                backgroundColor: "white",marginTop:'43px'
              }}
            >
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                Course
              </td>
              <td
                valign="middle"
                style={{
                  backgroundColor: "",
                  fontWeight: "bold",
                  marginLeft:"34px"
                }}
              >
                {val.Subject}
              </td>
            </tr>
            <tr
              style={{
                backgroundColor: "white",
              }}
            >
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                Course category
              </td>
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                {val.Rank}
              </td>
            </tr>
            <tr style={{ color: "#333333", backgroundColor: "#F7F6F3" }}>
              <td
                valign="middle"
                style={{
                  backgroundColor: "",
                  fontWeight: "bold",
                }}
              >
                GPA
              </td>
              <td
                valign="middle"
                style={{
                  backgroundColor: "",
                  fontWeight: "bold",
                }}
              >
               {val.GPA}
              </td>
            </tr>
            <tr
              style={{
                backgroundColor: "white",
              }}
            >
              <td
                valign="middle"
                style={{
                  backgroundColor: "#E9ECF1",
                  fontWeight: "bold",
                }}
              >
                Instructor
              </td>
              <td
                valign="middle"
                style={{
                  backgroundColor: "",
                  fontWeight: "bold",
                }}
              >
                {val.Instructor}
              </td>
            </tr>
            
              
                
                  
          </tbody>
          
        </table>
))}
      </div>
            ))}
    </Paper>

  );
};


export default Result;
