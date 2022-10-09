import React,{useEffect, useState} from "react";
import ViewAnnouncement from "./ViewAnnouncement";
import ViewNotification from "./ViewNotification";
import { useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { supervisor } from "../DummyData/facultyData";
import { GPAs } from "../DummyData/DummyData";
import { Row , Col,Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import studentService from "../../API/students";
import courseService from "../../API/course";

import { useNavigate } from "react-router-dom";
import { Paper, Typography } from "@mui/material";
import { add, addSeconds, set } from "date-fns";
import { EmojiObjectsOutlined } from "@material-ui/icons";


const HomeGo = () => {
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.auth);
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
  const [ecoursename,seteCourse]=useState("");
  const [etype,setetype]=useState("");
  const [einstructor,seteinstructor]=useState("");
  const [ecredits,setecredits]=useState("");
  const [eGPA,seteGPA]=useState("")
  const [eabsent,seteabsent]=useState(false)
  const [obj,setobj]=useState({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})
  const [instructors,setinstructors]=useState([])
  const [objarr,setarr]=useState([]);
  const [msg,setmsg]=useState("")
  const [courses,setcourses]=useState([]);
  const [totcourses,settcourses]=useState([]);
  const [decline,setdecline]=useState(false);
  const [edit,setedit]=useState(false)
 
  
 const [freeze,setfreeze]=useState(false)
 const onClick=(event) => {
  if (!freeze) {
    setfreeze(true);
  }
  else{
    setfreeze(false)
  }
}
const addSubject=(objj)=>{
            setarr(objarr => [...objarr, objj])        
            setobj("")
            setabsent(false) 
            if(totcredits>=0){
            }
            else{
              settotcredits("0")

            }
            settotcredits(0)
            settotcredits(totcredits+parseInt(credits))
            setcourses(courses.filter(element=>element.name!==objj.Subject))
            handleClose()
}

const updateSubject=(objj)=>{
  setarr(objarr.filter(item=>item.Subject!=editcoursename))
  setarr(objarr => [...objarr, objj])        
  setobj("")
  seteabsent(false) 
  settotcredits(totcredits+ecredits)
  setcourses(courses.filter(element=>element.name!==objj.Subject))
  handleClose()
}
const updateSubjectt=(objj)=>{
  console.log("objarr",objarr)
  setarr(objarr.filter(item=>item.Subject!=editcoursename))
  setarr(objarr => [...objarr, objj])        
  setobj("")
  setabsent(false) 
  settotcredits(totcredits+credits)
  console.log("totalcreists",totcredits)
  setcourses(courses.filter(element=>element.name!==objj.Subject))
  handleClose()

}


const getCourses=()=>{
 
  if((user.user.student.program_id.programShortName).includes("MS")){
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
  var Result={'semester':(user.user.student.Semester)-1,'Freeze':freeze,'Result':objarr}
  await studentService.updateResult(user.user.student._id,Result).then(res=>{
    if(res!=undefined){
     alert("report sent for verification")
     navigate('/')
    }
   }).catch(err=>{
    console.log("ererwe",err)
   })

}
const getVerificationdata=()=>{

  if(user.user.student.decline==true){
    setdecline(true)
  }
  var arr=""
  arr=(user.user.student.Result.find(element=>element.semester==(user.user.student.Semester)-1))
  if(arr==undefined){
    setarr([])
  }

  else
  {
    setarr(arr.Result)
    var tot=0;
    arr.Result.map((item)=>{
      var a=totcourses.find(itemm=>itemm.name==item.Subject)
    if(a!=undefined){
      tot=tot+parseInt(a.credits)
      }
        })
        }

        settotcredits(tot)

}

const getupdateCourses=()=>{
  
  if(objarr.length>0 && flag<3){
    setcourses(courses.filter(a => !objarr.some(b => a.name == b.Subject)));  
    setflag(flag+1)
}

}
const editcourses=(item)=>{
  console.log("itemss",item)
              seteabsent(item.absent)
              setetype(item.Rank)
              seteinstructor(item.Instructor)
              seteGPA(item.GPA)
              seteCourse(item.Subject);
              setCourse(item.Subject)
              setecredits(credits)
  var objj=totcourses.find(value=>value.name==item.Subject)
  if(objj!=undefined){
 setcourses(courses => [...courses,objj])
  }
handleShow()
}
const editcoursess=(item)=>{
  setedit(true)
  console.log("itemss in edit coursesss",item)
              setabsent(item.absent)
              settype(item.Rank)
              setinstructor(item.Instructor)
              setGPA(item.GPA)
             // setCourse(item.Subject);
              setCourse(item.Subject)
              setcredits(credits)
              


  var objj=totcourses.find(value=>value.name==item.Subject)
  if(objj!=undefined){
 setcourses(courses => [...courses,objj])
  }
handleShow()
console.log("asbegggnt",absent)
              console.log("type",type)
              console.log("instructor",instructor)
              console.log("GPA",GPA)
              console.log("course",coursename)
              console.log("credits",credits)
}
useEffect(()=>{
  getCourses();
},[totcourses.length])

  useEffect(()=>{
    getVerificationdata();
  },[totcourses.length])

  useEffect(()=>{
    getupdateCourses();
  },[totcourses.length])
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{display:'flex',flexDirection:'row', marginLeft:'40%'}}>
      <p style={{fontWeight:'bold', fontSize:19}}>Semester:</p>
      <p style={{marginLeft:20,fontSize:19}}>{(user.user.student.Semester)-1}</p>   
      </div>
      <div style={{display:'flex',flexDirection:'row'}}>
      <label style={{marginRight:'10px',marginLeft:'30px'}}>Freeze</label>
      <input type="checkbox" style={{marginBottom:'19px', marginTop:"5px"}} name="consultantname" 
 onClick={onClick} id="consultantname" value={freeze} placeholder={e=>setfreeze(e.target.value)} defaultChecked={freeze}></input>
      {freeze==true?
      <div></div>:
      <div style={{alignItems:'center',
      justifyContent:'center',marginLeft:'70%'}}>
        {courses.length==0?<></>:
      <Button style={{backgroundColor:'darkblue',height:23,width:23,padding:0,marginLeft:180}} onClick={()=>handleShow()}>+</Button>
      
        }</div>
      }
      </div>
      

      {      freeze==true?
      <></>:

        objarr.length>0?

        objarr.map((item)=>(
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
             {decline?
            <Button style={{backgroundColor:'darkblue',padding:3,marginBottom:5,fontSize:14}} onClick={()=>{
              
              editcourses(item)
              setecn(item.Subject)
            }}>Edit</Button>:
            <Button style={{backgroundColor:'darkblue',padding:3,marginBottom:5,fontSize:14}} onClick={()=>{
              
              editcoursess(item)
              setecn(item.Subject)

            }}>Edit</Button>}
          </Paper>
        ))
        :
        <></>
      }
    

    <Modal show={show} onHide={handleClose} style={{marginTop:70,marginLeft:"10%"}}>
        <Modal.Header style={{backgroundColor:'#572E74',color:'lightgrey',margin:8,borderRadius:2,borderWidth:2,borderColor:"black"}}>
          <Modal.Title style={{fontFamily:'segoe',marginLeft:"30%"}}>Subject Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
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
                {decline?<input type="checkbox" style={{marginBottom:'29px', marginTop:"5px"}} defaultChecked={eabsent} onClick={()=>{eabsent?seteabsent(false):seteabsent(true)}}  name="consultantname" id="consultantname" value={eabsent} placeholder={eabsent} readOnly=""></input>:
              <input type="checkbox" style={{marginBottom:'29px', marginTop:"5px"}} onClick={()=>{absent?setabsent(false):setabsent(true)}}  name="consultantname" id="consultantname" value={absent} placeholder={absent} readOnly=""></input>}
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
              {decline?<select style={{marginLeft: '5px',marginBottom:'10px',marginRight:35}} onChange={e=>{seteCourse(e.target.value)
                               setetype((courses.find(element=>element.name==ecoursename)).type)
                               setinstructors((courses.find(element=>element.name==ecoursename)).Faculty)
                              setecredits((courses.find(element=>element.name==ecoursename)).credits)
                              setmsg("")
                              }} onClick={e=>{seteCourse(e.target.value)
                               setetype((courses.find(element=>element.name==ecoursename)).type)
                               setinstructors((courses.find(element=>element.name==ecoursename)).Faculty)
                              setecredits((courses.find(element=>element.name==ecoursename)).credits)
                              setmsg("")
                              }}>
                <option value={ecoursename}>{ecoursename}</option>
                {(courses.length>0)?
                courses.map((val)=>(
                  (val.name==ecoursename?false:
                <option value={val.name}>{val.name.toString()}</option>)
                  )):<></>}
                </select>  :<select style={{marginLeft: '5px',marginBottom:'10px',marginRight:35}} onChange={e=>{setCourse(e.target.value)
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
}   
                         </div>

              <div style={{display:'flex',flexDirection:'row'}} >
                <label style={{marginRight:'10px',fontWeight:'bold'}}>Type</label>
                {decline?
                <label style={{marginTop:'1px',marginBottom:'14px'}} value={etype}>
                  {etype}
                </label>:
                <label style={{marginTop:'1px',marginBottom:'14px'}} value={type}>
                {type}
              </label>}
      </div>
            </div>

            <div class="rows" style={{display:'flex',flexDirection:'row'}}>
              <div style={{marginRight:125}}>
                <label style={{fontWeight:'bold'}}>GPA</label>
               {decline?<select style={{marginLeft: '10px',marginBottom:'10px'}} onClick={e=>{seteGPA(e.target.value)
                                            setmsg("")
                                          }}  >
                <option value={eGPA}>{eGPA}</option>

                  
                    
                    {eabsent?<option value={0}>0</option>:
                  
                  GPAs.map((val)=>(
                    (val==eGPA?false:

                  <option value={val} >{val.toString()}</option>)
                    ))}
                  </select> :
                  <select style={{marginLeft: '10px',marginBottom:'10px'}} onClick={e=>{setGPA(e.target.value)
                                            setmsg("")
                                          }}  >
                <option></option>

                  
                    
                    {absent?<option value={0}>0</option>:
                  
                  GPAs.map((val)=>(
                  <option value={val} >{val.toString()}</option>
                    ))}
                  </select>  }    
                </div>
                <div style={{marginLeft:50}}>
                <label style={{marginLeft:10,marginRight:10,fontWeight:'bold'}}>Credits</label>
                {decline?<label value={ecredits}>{ecredits}</label>:<label value={credits}>{credits}</label>}
             
                </div>
            </div>
              
            
            <div class="rows">
              <div style={{marginRight:95}}>
                <label style={{marginRight:'30px',fontWeight:'bold',marginTop:5}}>Instructor</label>
                
               {decline? <select style={{marginTop:'1px',marginBottom:'14px',width:'40%'}} onClick={e=>{seteinstructor(e.target.value)
               setmsg("")
               }} >
                <option value={einstructor}>{einstructor}</option>

                {(instructors.length)>0?
                
                instructors.map((val)=>(
                  (val==einstructor?false:

                  <option value={val}>{val.toString()}</option>)
                    ))
                  
                :
                  <></>}
                  
                </select>:<select style={{marginTop:'1px',marginBottom:'14px',width:'40%'}} onClick={e=>{setinstructor(e.target.value)
               setmsg("")
               }}
               >
                <option></option>

                {(instructors.length)>0?
                instructors.map((val)=>(
                  <option value={val}>{val.toString()}</option>
                    ))
                  
                :
                  <></>}
                  
                </select>}
             </div>
            </div>
  
           
            </Paper>

        </Modal.Body>
        <Modal.Footer >
          {decline?
          <>
          <Button variant="secondary" style={{backgroundColor:'black',padding:5}} onClick={()=>{
            setcourses(courses.filter(item=>item.name!=ecoursename))
            handleClose()
          }}>
            Cancel
          </Button>
          <Button variant="primary" style={{backgroundColor:'#572E74',padding:5}} onClick={()=>{
            
            if(ecoursename!="" && etype!="" && ecredits!="" && einstructor!="" && eGPA!=""){
              settotcredits(totcredits-parseInt(ecredits))
              if(totcredits!=max){
                setobj({'Subject':ecoursename,'Rank':etype,'Instructor':einstructor,'GPA':eGPA,'absent':eabsent})
                var objj= ({'Subject':ecoursename,'Rank':etype,'Instructor':einstructor,'GPA':eGPA,'absent':eabsent})

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
          </>:
            (edit?
              <>
          <Button variant="secondary" style={{backgroundColor:'black',padding:5}} onClick={()=>{
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

              updateSubjectt(objj);
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
          :
          <>
          <Button variant="secondary" style={{backgroundColor:'black',padding:5}} onClick={()=>{
            handleClose()
            setCourse("")
            settype("")
            setGPA("")
            setinstructor("")
            setcredits("")
            setabsent("")
          }}>
            Cancel
          </Button>
          <Button variant="primary" style={{backgroundColor:'#572E74',padding:5}} onClick={()=>{
            

            if(coursename!="" && type!="" && credits!="" && instructor!="" && GPA!=""){
              

              if(totcredits!=max){
                setobj({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})
                var objj= ({'Subject':coursename,'Rank':type,'Instructor':instructor,'GPA':GPA,'absent':absent})

              addSubject(objj);
              }
              else{
                setmsg("Maximum subject credit hours completed")
              }

            }
            else{
              setmsg("Please fill fields")
            }
            
          }}>
            Add
          </Button>
          </>
            )
}
        </Modal.Footer>
      </Modal>
      {objarr.length>0?
      <Button style={{backgroundColor:'darkblue',padding:4,paddingRight:6,paddingLeft:6}} onClick={()=>handleSend()}>Send for Verification</Button>
      :
      <></>}
    </div>

  );
};

export default HomeGo;
