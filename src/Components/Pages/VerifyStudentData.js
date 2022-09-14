import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Button} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Verified from "./Verifiedd"
import adminService from "../../API/admin";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const VerifyData = ({ route,navigation }) => {
  const {state}=useLocation();
  const navigate=useNavigate()
  const [verified,setverified]=useState()
  const { currentRole } = useSelector((state) => state.userRoles);

  console.log("route",state.data.student_id);
  
  const Resultt=state.data.student_id.Result;

  var a=[];
  var sem=[];
  if(Resultt.length==0){
    return <div style={{marginLeft:'43%'}}> No Results Yet</div>
  }
  Resultt.map((val,index)=>{
      a.push(val.semester)
      sem.push(val)
  })

  var max=Math.max(...a)
  var res= sem.find(index=> index.semester==max)
  const Verifydata=async(verify,decline)=>{
    await adminService.updateVerify(state.data.student_id._id,verify,decline).then(res=>{
        console.log("responsee",res)
       alert("Verified")
       navigate('/Dashboard/HomeAdmin')
      
     }).catch(err=>{
      console.log("ererwe",err)
     })

  }
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
      
      
      <div style={{display:'flex',flexDirection:'row'}}>
      <label style={{marginRight:"40px",fontWeight:'bold',fontSize:22,marginBottom:'20px'}}>Semester: {res.semester}</label>
      
      </div>
      {res.Freeze?<></>:
      res.Result.map((val,index)=>(
        !val.absent?
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
      
      :
      <></>
      ))}
      {currentRole=="ADMIN"? <></>:
      state.data.student_id.verified?
      <Button  style={{backgroundColor:'#333333',borderRadius:6,marginTop:'2%'}} onClick={()=>Verifydata(false,true)}>Decline</Button>
:
      <div style={{display:'flex',flexDirection:'row',marginRight:"34%",marginTop:20,marginBottom:20}}>
      <Button  style={{backgroundColor:'#333333',borderRadius:6,marginLeft:'80%',marginTop:'2%'}} onClick={()=>Verifydata(true,false)}>Verify</Button>
      <Button  style={{backgroundColor:'#333333',borderRadius:6,marginLeft:'80%',marginTop:'2%'}} onClick={()=>Verifydata(false,true)}>Decline</Button>
      </div>
}
    </Paper>
  );
};
const verified=()=>{
  return(
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
    ></Paper>
  );
};

export default VerifyData;
