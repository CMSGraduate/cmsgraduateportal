import React, { useEffect, useState } from "react";
import { studentData } from "../DummyData/DummyData";
import DataTable from "../UI/TableUI";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GPAs } from "../DummyData/DummyData";

import courseService from "../../API/course";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Modal } from 'react-bootstrap';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import BackdropModal from "../UI/BackdropModal";
import studentService from "../../API/students";
import { useFormik } from "formik";
import sessionsService from "../../API/sessions";
import programsService from "../../API/programs";
import adminService from "../../API/admin";
import { useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import { setUseProxies } from "immer";
const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  /* gap: ".5rem", */
  top: "100%",
  left: "100%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",

  /* border: "2px solid #000", */
  boxShadow: 24,
  p: 4,
};

export default function ManageStudent() {
  const {
    user
  } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const {User}=useLocation().state
 
  const navigate=useNavigate()
  const [show, setShow] = useState(false);
  const [flag,setflag]=useState(0)
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
  };
 
  const max=12;
  const [totcredits,settotcredits]=useState("")
  const [editcoursename,setecn]=useState("")
  const [coursename,setCourse]=useState("");
  const [type,settype]=useState("");
  const [instructor,setinstructor]=useState("");
  const [credits,setcredits]=useState("");
  const [GPA,setGPA]=useState("")
  const [absent,setabsent]=useState(false)
 
  const [obj,setobj]=useState({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})
  const [instructors,setinstructors]=useState([])
  const [objarr,setarr]=useState([]);
  const [msg,setmsg]=useState("")
  const [courses,setcourses]=useState([]);
  const [totcourses,settcourses]=useState([]);
  const [decline,setdecline]=useState(false);
  const [edit,setedit]=useState(false)
  const [selectedSemester,setSelSem]=useState()
  
 const [freeze,setfreeze]=useState(false)
 const onClick=(event) => {
  if (!freeze) {
    var obj={
      Freeze:true,
      Result:selectedSemester.Result,
      semester:selectedSemester.semester,
      _id:selectedSemester._id
    }
    setSelSem(obj)
    setfreeze(true);
  }
  else{
    var obj={
      Freeze:false,
      Result:selectedSemester.Result,
      semester:selectedSemester.semester,
      _id:selectedSemester._id
    }
    setSelSem(obj)
    setfreeze(false)
  }
}

const updateSubject=(objj)=>{
  console.log("array234",objj.Subject)

  setarr(objarr.filter(item=>item.Subject!=editcoursename))
  setarr(objarr => [...objarr, objj])        
  setobj("")
  setabsent(false) 
  settotcredits(totcredits+credits)
  setcourses(courses.filter(element=>element.name!==objj.Subject))
  var arry=selectedSemester.Result.filter((item)=>item.Subject!=editcoursename)
  console.log("arra13y",freeze)

  arry.push(objj)
  var obj={
    Freeze:freeze,
    Result:arry,
    semester:selectedSemester.semester,
    _id:selectedSemester._id
  }
  setSelSem(obj)
  console.log("array",obj)
  handleClose()
}



const getCourses=()=>{
  console.log("userss",selectedSemester)
  if((User.data.program_id.programShortName).includes("MS")){
     courseService.getMSCourses("MS").then(res=>{
     if(res!=undefined){
     settcourses(res.data.courses)
     setcourses(res.data.courses)
     }
    }).catch(err=>{
    })
  }
  else{
    courseService.getPHDCourses("PHD").then(res=>{
    if(res!=undefined){
     setcourses(res.data.courses)

    }
   }).catch(err=>{
   })
  }
  

}
const handleSend=async()=>{
  var Result={'semester':selectedSemester.semester,'Freeze':selectedSemester.Freeze,'Result':selectedSemester.Result}
  console.log("resilt",Result)
  await studentService.updateResult(User.data._id,Result).then(res=>{
    if(res!=undefined){
     alert("Detailes Updated")
     navigate(-1)
    }
   }).catch(err=>{
    console.log("ererwe",err)
   })

}



const editcoursess=(item)=>{
 // setedit(true)
  console.log("itemss in edit coursesss",item)
             // setabsent(item.absent)
              //settype(item.Rank)
              //setinstructor(item.Instructor)
              //setGPA(item.GPA)
             // setCourse(item.Subject);
              //setCourse(item.Subject)
              //setcredits(credits)
              


  var objj=totcourses.find(value=>value.name==item.Subject)
  if(objj!=undefined){
 setcourses(courses => [...courses,objj])
  }
handleShow()
}



useEffect(()=>{
  getCourses();
},[totcourses.length])





  return (
    <>
        <div style={{ textAlign: "center" }}>
      <div style={{display:'flex',flexDirection:'row', marginLeft:'40%'}}>
      <p style={{fontWeight:'bold', fontSize:19}}>Semester:</p>
      
      <Select style={{marginLeft: '5px',marginRight:35,height:30}} >
                
                {User.data.Result?.map((val)=>{
                  return(                
                  <MenuItem  onClick={(e)=>{
                    setSelSem(val)}} value={val}>{val.semester}</MenuItem >)
})}
                </Select>   
      </div>
      <div style={{display:'flex',flexDirection:'row'}}>
      <label style={{marginRight:'10px',marginLeft:'30px'}}>Freeze</label>
      <input type="checkbox" style={{marginBottom:'19px', marginTop:"5px"}} name="consultantname" 
 onClick={onClick} id="consultantname" value={freeze} placeholder={e=>setfreeze(e.target.value)} defaultChecked={selectedSemester?.Freeze}></input>
      {freeze==true?
      <div></div>:
      <div style={{alignItems:'center',
      justifyContent:'center',marginLeft:'70%'}}>
        </div>
      }
      </div>
      

      {selectedSemester?.Freeze==true?
      <></>:

      selectedSemester?.Result?.length>0?

      selectedSemester?.Result?.map((item)=>(
          <Paper
          variant="outlined"
          elevation={3}
          style={{
            placeItems: "center",
             placeContent: "center",
            marginBottom: "2rem",
          }}
        >
            
            <div style={{display:'flex',flexDirection:'row',marginTop:20}}>

            <div style={{display:'flex',flexDirection:'row',marginLeft:"25%"}}>
            <label style={{fontWeight:'bold',marginRight:27}}>Subject</label>
            <label>{item.Subject}  ({item.Rank})</label>
            </div>
            <div style={{display:'flex',flexDirection:'row',marginLeft:40}}>
            <label style={{marginRight:'10px',marginLeft:'85px',fontWeight: 'bold',marginLeft:'40%'}}>Absent</label>
            <input type="checkbox" defaultChecked={item.absent} style={{marginBottom:'29px', marginTop:"5px"}} name="consultantname" id="consultantname" value={item.absent} placeholder={item.absent} readOnly={true}></input>
             </div> 
            </div>
            <div style={{display:'flex',flexDirection:'row',marginBottom:20,marginRight:'37.5%'}}>
            <label style={{marginRight:'10px',fontWeight: 'bold',marginLeft:'40%'}}>Instructor</label>
            <label>{item.Instructor}</label>
             </div> 
             <div style={{display:'flex',flexDirection:'row',marginBottom:20,marginRight:'37.5%'}}>
            <label style={{marginRight:'55px',fontWeight:'bold',marginLeft:'40%'}}>GPA</label>
            <label>{item.GPA}</label>
             </div> 
            
            <Button style={{backgroundColor:'darkblue',padding:3,marginBottom:5,fontSize:14}} onClick={()=>{
              
              editcoursess(item)
              setecn(item.Subject)

            }}>Edit</Button>
          </Paper>
        ))
        :
        <></>
      }
    

    
      <Button style={{backgroundColor:'darkblue',padding:4,paddingRight:6,paddingLeft:6}} onClick={()=>handleSend()}>Update</Button>

    </div>


  
      
      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Update!"}
      >
        Student has been Updated.
      </BackdropModal>


      <Modal show={show} onHide={handleClose} style={{marginTop:70,marginLeft:"10%"}}>
        <Modal.Header style={{backgroundColor:'#572E74',color:'lightgrey',margin:8,borderRadius:2,borderWidth:2,borderColor:"black"}}>
          <Modal.Title style={{fontFamily:'segoe',marginLeft:"30%"}}>Subject Information</Modal.Title>
    </Modal.Header>
        <Modal.Body >
        
        <div class="rows">
        {msg==""?
             <></>
            
            :<div>
            <label style={{color:'maroon',marginLeft:'40%',marginBottom:10}}>{msg}</label>
            <hr/>
            </div>
            }
              <div style={{display:'flex',flexDirection:'row'}} >
                <label style={{marginRight:'10px',marginLeft:'85px',fontWeight: 'bold',marginLeft:'40%'}}>Absent</label>
              <input type="checkbox" style={{marginBottom:'29px', marginTop:"5px"}} onClick={()=>{absent?setabsent(false):setabsent(true)}}  name="consultantname" id="consultantname" value={absent} placeholder={absent} readOnly=""></input>
              </div>
            </div>
            <Paper
      variant="outlined"
      elevation={3}
      style={{
        display: "grid",
        placeItems: "center",
        marginBottom: "1rem",
        paddingTop:20,
        paddingBottom:20,
      }}
    >
            <div class="rows" style={{display:"flex",flexDirection:'row'}} >
              <div>
                <label style={{fontWeight:'bold'}}>Course</label>
              <select style={{marginLeft: '5px',marginBottom:'10px',marginRight:35}} onChange={e=>{setCourse(e.target.value)
                               settype((courses.find(element=>element.name==coursename)).type)
                               setinstructors((courses.find(element=>element.name==coursename)).Faculty)
                              setcredits((courses.find(element=>element.name==coursename)).credits)
                              setmsg("")
                              }} onClick={e=>{setCourse(e.target.value)
                               settype((courses.find(element=>element.name==coursename)).type)
                               setinstructors((courses.find(element=>element.name==coursename)).Faculty)
                              setcredits((courses.find(element=>element.name==coursename)).credits)
                              setmsg("")

                              }}  >
                <option></option>
                {(courses.length>0)?
                courses.map((val)=>(
                <option value={val.name}>{val.name.toString()}</option>
                  )):<></>}
                </select> 
  
                         </div>

              <div style={{display:'flex',flexDirection:'row'}} >
                <label style={{marginRight:'10px',fontWeight:'bold'}}>Type</label>
               
                <label style={{marginTop:'1px',marginBottom:'14px'}} value={type}>
                {type}
              </label>
      </div>
            </div>

            <div class="rows" style={{display:'flex',flexDirection:'row'}}>
              <div style={{marginRight:125}}>
                <label style={{fontWeight:'bold'}}>GPA</label>
               
                  <select style={{marginLeft: '10px',marginBottom:'10px'}} onClick={e=>{setGPA(e.target.value)
                                            setmsg("")
                                          }}  >
                <option></option>

                  
                    
                    {absent?<option value={0}>0</option>:
                  
                  GPAs.map((val)=>(
                  <option value={val} >{val.toString()}</option>
                    ))}
                  </select>   
                </div>
                <div style={{marginLeft:50}}>
                <label style={{marginLeft:10,marginRight:10,fontWeight:'bold'}}>Credits</label>
                <label style={{marginTop:'1px',marginBottom:'14px'}} value={credits}>
                {credits}
                </label>
                </div>
            </div>
              
            
            <div class="rows">
              <div style={{marginRight:95}}>
                <label style={{marginRight:'30px',fontWeight:'bold',marginTop:5}}>Instructor</label>
                
                <select style={{marginTop:'1px',marginBottom:'14px',width:'40%'}} onClick={e=>{setinstructor(e.target.value)
               setmsg("")
               }} >
                <option value={instructor}>{instructor}</option>

                {(instructors.length)>0?
                
                instructors.map((val)=>(
                  (val==instructor?false:

                  <option value={val}>{val.toString()}</option>)
                    ))
                  
                :
                  <></>}
                  
                </select>
             </div>
            </div>
  
           
            </Paper>
                
        </Modal.Body>
        <Modal.Footer >
          
            <>
          <Button variant="secondary" style={{backgroundColor:'Darkblue',padding:5}} onClick={()=>{
            setcourses(courses.filter(item=>item.name!=coursename))
            handleClose()
          }}>
            Cancel
          </Button>
          <Button variant="primary" style={{backgroundColor:'#572E74',padding:5}} onClick={()=>{
            
            if(coursename!="" && type!="" && credits!="" && instructor!="" && GPA!=""){
              console.log("credits",credits)
              var to=totcredits-parseInt(credits)
              settotcredits(totcredits-parseInt(credits))
              console.log("totalcredits",to)

              if(to!=max){
                setobj({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})
                var objj= ({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})

              updateSubject(objj);
              }
              else{
                setmsg("Maximum subject credit hours completed")
              }

            }
            else{
              setmsg("Please fill fields")
            }
            
          }}>
            Update
          </Button>
        </>
        

        </Modal.Footer>
        </Modal>
    </>
  );
}
