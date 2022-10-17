import {
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import studentService from "../../API/students";
import synopsisService from "../../API/synopsis";
import BackdropModal from "../UI/BackdropModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
export const API_SYNOPSIS = axios.create({
  baseURL: process.env.REACT_APP_URL,
});
export default function SynopsisSubmission() {
  const {
    user: {
      user: {
        student: {
          program_id: { programShortName },
        },
      },
    },
  } = useSelector((state) => state.auth);
  const {
    user
  } = useSelector((state) => state.auth);
  const navigate=useNavigate();
  
  // console.log(programShortName);
  const [supervisors, setSupervisors] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState();
  const [isError, setIsError] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [pass, setpass] = useState(false);
const [synopsissub,setsub]=useState(false)
const [rebuttal,setreb]=useState(false)
const [clear,setclear]=useState(false)
  const [scheduleid,setsid]=useState();
  const [evaluationid,seteid]=useState();
  const [fileBase64String, setFileBase64String] = useState("");
  const [file,setFile]=useState("")
  const [deadline,setdeadline]=useState()
  const [rebflag,setflag]=useState(false)
  const getSupervisors = async () => {
    let data = await studentService.getSupervisors();
    console.table("SubmissionM", data?.supervisors);
    setSupervisors(data?.supervisors);
  };
  
  const getDeadlinesData = async () => {
    let res = await synopsisService.getDeadlines();
    console.log("sdsda",res);
    let filteredDeadlines = [];
    if (programShortName.toLowerCase().includes("ms")) {
      filteredDeadlines = res.filter((item) => item.program === "Masters");
    } else {
      filteredDeadlines = res.filter((item) => item.program === "PhD");
    }
    
      console.log("fsfs",filteredDeadlines[0].deadline)
      var s=new Date(filteredDeadlines[0].deadline)
      setdeadline(s.getDate()+"/"+s.getMonth()+"/"+s.getFullYear()+" "+s.getHours()+":"+s.getMinutes())
    
    setDeadlines(filteredDeadlines);
  };
  const getSubmission=async()=>{
    const res=await synopsisService.getRebuttal()
    console.log("tedf",res)
    const a=res.data.find((item)=>item.student_id._id==user.user.student._id && item.verified==false)
    console.log("asda",a)
    if(a!=undefined){
      setflag(true)
      console.log("heelo in flag",a)

    }
    await synopsisService.checkSubmission(user.user.student._id).then(res=>{
      
       console.log("hjeghjs",res.data)
    
      if(res.data.data!=null){
        if(res.data.message=="submitted"){
          setsub(true)
          console.log("ghekjks")
        }
        else{
        setsub(true)
        if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="Yes"){
          console.log("hello");
          seteid(res.data.data._id)
          setsid(res.data.data.Schedule[0]._id)
          setreb(true)
        }
        if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="No"){
          console.log("hello1234");

          setclear(true)
        }
      }
      }
      
     }).catch(err=>{
      console.log("ererwe",err)
     })
     console.log("synopsissub",synopsissub)
  }

  const getsubjectcount=()=>{
    var core=0;
    var rm=0;
    var tot=0;
    user.user.student.Result.map((item)=>{
      item.Result.map((value)=>{
        if((value.Rank).toLowerCase()=="core"){
          core++;
        }if((value.Rank).toLowerCase()=="rm"){
          rm++;
        }
        tot++;
      })
    })
    console.log("tot",tot);
    console.log("RM",rm);
    console.log("Crore",core);
    if(tot>=6 && rm>=1 && core>=3 ){
      setpass(true);
      console.log("hereforpass")
    }

  }
  useEffect(() => {
    getSupervisors();
    getDeadlinesData();
    getSubmission()
    getsubjectcount();
  }, [programShortName]);

  const validationSchema = yup.object({
    synopsisTitle: yup.string().required(),
    supervisor: yup.string().required(),
    coSupervisor: yup.string().required(),
    synopsisTrack: yup.string().required(),
    // synopsisDocument: yup.array(),
    // synopsisPresentation: yup.string(),
  });
  const encodeFileBase64 = (file,ty) => {
    
    var reader = new FileReader();
    console.log("\nfile",file)
    console.log("\nty",ty)

      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
       
          setFile(Base64);
        console.log("filebase64",Base64)
      }

      reader.onerror = (error) => {
        console.log("error: ", error);
    }
  };
  const [Decoded, setDecoded] = useState("");
console.log("\nDecoded",Decoded)

  
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
  const formik = useFormik({
    initialValues: {
      synopsisTitle: "",
      supervisor: "",
      coSupervisor: "",
      synopsisTrack: "",
      synopsisDocument: [],
      synopsisPresentation: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      getDeadlinesData();
      console.log(values.synopsisDocument[0]);
      
      console.log("filess",file)
      let formData = new FormData();
      const token=getToken()
      formData.append("synopsisTitle", values.synopsisTitle);
      formData.append("supervisor", values.supervisor);
      
      //form.append("supervisor", values.supervisor)
    //form.append("coSupervisor", values.coSupervisor);
      formData.append("coSupervisor", values.coSupervisor);
      formData.append("synopsisTrack", values.synopsisTrack);
      formData.append("synopsisDocument", values.synopsisDocument[0]);
      formData.append("synopsisPresentation", values.synopsisPresentation[0]);
      formData.append("synopsisFile", file);

      if(rebuttal==true){
        console.log("iamsbahaat")
      formData.append("schedule_id",scheduleid);
      formData.append("evaluation_id",evaluationid)

     // formData.append("synopsisFile", file);
      const res = await API_SYNOPSIS.post("synopsis/submit-rebuttal", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status === 500) {
        setShowErrorModal(true);
        console.log(res);
      } else {
        setShowSubmitModal(true);
      }
      console.log(res);
      }

      // console.log(values);
      else{
        let token = getToken();
        var response;
  try {
    console.log(formData + "apisubmit");
    const res = await API_SYNOPSIS.post("synopsis/submit-synopsis", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    response=res
    //return res;
  } catch (error) {
    console.log(error.response);
    //return error.response;
  }

  //const ress = await API_SYNOPSIS.post("synopsis/submit-synopsisfile", {_id:response.data.data._id,file:file}, {
    //headers: {
    //  Authorization: `Bearer ${token}`,
    //},
  //});
  //console.log(ress);
      let form={"supervisor": values.supervisor,"coSupervisor": values.coSupervisor}

  let res = await studentService.updatesup(form);
  if (res?.afterUpdate) {
    console.log(res);
  } else {
    console.log(res);
  }

  //return res;
  setShowSubmitModal(true);


      
    }
    },
  });

  return (
    
    
    <>
    {rebflag?<div
      style={{
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "500",
      }}
    >
      Rebuttle Declined
      <div
    style={{
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "500",
    }}
  >
          You cannot submit rebuttal Now. Contact Front Desk for more Details
  </div>
    </div>
    

    :
    (user.user.student.Semester<=2?<div
      style={{
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "500",
      }}
    >
      No Submission Required Yet
    </div>:
    
    (pass?


      (deadlines[0]? (!synopsissub?(
        

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <div>
    <label style={{fontWeight:'bold',marginRight:5}}>Deadline:
</label>
    <label style={{fontWeight:'bold',color:'maroon'}}>{deadline}
</label>
    </div>
          <TextField
            sx={{
              width: "100%",
              marginBottom: "15px",
            }}
            name="synopsisTitle"
            label="Synopsis Title"
            color="secondary"
            variant="outlined"
            value={formik.values.synopsisTitle}
            onChange={formik.handleChange}
            error={
              formik.touched.synopsisTitle &&
              Boolean(formik.errors.synopsisTitle)
            }
            helperText={
              formik.touched.synopsisTitle && formik.errors.synopsisTitle
            }
          />
          <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
            <FormControl fullWidth color="secondary">
              <InputLabel>Supervisor</InputLabel>
              <Select
                name="supervisor"
                label="Supervisor"
                value={formik.values.supervisor}
                onChange={formik.handleChange}
                error={
                  formik.touched.supervisor && Boolean(formik.errors.supervisor)
                }
                helperText={
                  formik.touched.supervisor && formik.errors.supervisor
                }
              >
                {supervisors?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
            <FormControl fullWidth color="secondary">
              <InputLabel>Co-Supervisor</InputLabel>
              <Select
                name="coSupervisor"
                value={formik.values.coSupervisor}
                onChange={formik.handleChange}
                error={
                  formik.touched.coSupervisor &&
                  Boolean(formik.errors.coSupervisor)
                }
                helperText={
                  formik.touched.coSupervisor && formik.errors.coSupervisor
                }
                label="Co-Supervisor"
              >
                {supervisors?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <TextField
            sx={{ width: "100%", marginBottom: "15px" }}
            name="synopsisTrack"
            label="Synopsis Track"
            color="secondary"
            variant="outlined"
            value={formik.values.synopsisTrack}
            onChange={formik.handleChange}
            error={
              formik.touched.synopsisTrack &&
              Boolean(formik.errors.synopsisTrack)
            }
            helperText={
              formik.touched.synopsisTrack && formik.errors.synopsisTrack
            }
          />

          <div>
            <div>Synopsis Document:</div>
            <input
              type="file"
              name="synopsisDocument"
              min={1}
              onChange={(event) => {
                formik.setFieldValue(
                  "synopsisDocument",
                  event.currentTarget.files
                );
                encodeFileBase64(event.currentTarget.files[0], "synopsisFile")
              }}
            />
            <div>Synopsis Presentation :</div>
            <input
              type="file"
              min={1}
              name="synopsisPresentation"
              onChange={(event) => {
                formik.setFieldValue(
                  "synopsisPresentation",
                  event.target.files
                );
              }}
            />
            <span style={{ color: "red" }}>{isError && error}</span>
            <Button
              type="submit"
              sx={{ ml: "80%", mt: "20px" }}
              variant="contained"
              size="large"
              color="secondary"
            >
              Submit
            </Button>
          </div>

          <BackdropModal
            showModal={showSubmitModal}
            setShowModal={setShowSubmitModal}
            title={"Submit!"}
          >
            Synopsis has been submitted.
          </BackdropModal>
          <BackdropModal
            showModal={showErrorModal}
            setShowModal={setShowErrorModal}
            title={"Error!"}
          >
            Something went wrong.
          </BackdropModal>
        </Box>
      ) : (
        
        (rebuttal?
          
          <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <Box>
          <InputLabel style={{color:'red'}}>You need to re Submit Synopsis</InputLabel>
          </Box>
          <TextField
            sx={{
              width: "100%",
              marginBottom: "15px",
            }}
            name="synopsisTitle"
            label="Synopsis Title"
            color="secondary"
            variant="outlined"
            value={formik.values.synopsisTitle}
            onChange={formik.handleChange}
            error={
              formik.touched.synopsisTitle &&
              Boolean(formik.errors.synopsisTitle)
            }
            helperText={
              formik.touched.synopsisTitle && formik.errors.synopsisTitle
            }
          />
          <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
            <FormControl fullWidth color="secondary">
              <InputLabel>Supervisor</InputLabel>
              <Select
                name="supervisor"
                label="Supervisor"
                value={formik.values.supervisor}
                onChange={formik.handleChange}
                error={
                  formik.touched.supervisor && Boolean(formik.errors.supervisor)
                }
                helperText={
                  formik.touched.supervisor && formik.errors.supervisor
                }
              >
                {supervisors?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
            <FormControl fullWidth color="secondary">
              <InputLabel>Co-Supervisor</InputLabel>
              <Select
                name="coSupervisor"
                value={formik.values.coSupervisor}
                onChange={formik.handleChange}
                error={
                  formik.touched.coSupervisor &&
                  Boolean(formik.errors.coSupervisor)
                }
                helperText={
                  formik.touched.coSupervisor && formik.errors.coSupervisor
                }
                label="Co-Supervisor"
              >
                {supervisors?.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.username}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <TextField
            sx={{ width: "100%", marginBottom: "15px" }}
            name="synopsisTrack"
            label="Synopsis Track"
            color="secondary"
            variant="outlined"
            value={formik.values.synopsisTrack}
            onChange={formik.handleChange}
            error={
              formik.touched.synopsisTrack &&
              Boolean(formik.errors.synopsisTrack)
            }
            helperText={
              formik.touched.synopsisTrack && formik.errors.synopsisTrack
            }
          />

          <div>
            <div>Synopsis Document:</div>
            <input
              type="file"
              name="synopsisDocument"
              min={1}
              onChange={(event) => {
                formik.setFieldValue(
                  "synopsisDocument",
                  event.currentTarget.files
                );
                encodeFileBase64(event.currentTarget.files[0], "synopsisFile")

              }}
            />
            <div>Synopsis Presentation :</div>
            <input
              type="file"
              min={1}
              name="synopsisPresentation"
              onChange={(event) => {
                formik.setFieldValue(
                  "synopsisPresentation",
                  event.target.files
                );
              }}
            />
            <span style={{ color: "red" }}>{isError && error}</span>
            <Button
              type="submit"
              sx={{ ml: "80%", mt: "20px" }}
              variant="contained"
              size="large"
              color="secondary"
            >
              Submit
            </Button>
          </div>

          <BackdropModal
            showModal={showSubmitModal}
            setShowModal={setShowSubmitModal}
            title={"Submit!"}
          >
            Synopsis has been submitted.
          </BackdropModal>
          <BackdropModal
            showModal={showErrorModal}
            setShowModal={setShowErrorModal}
            title={"Error!"}
          >
            Something went wrong.
          </BackdropModal>
        </Box>:
        (clear?
          <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "500",
          color:"maroon"
        }}
      >
        Synopsis Cleared!!
      </div>:<div
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "500",
          color:"maroon"
        }}
      >
        Already Submitted
      </div>
          )
        )
      )):
      <div
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "500",
          color:"maroon"
        }}
      >
        Nothing To Submit!!
      </div>):
      <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          Cannot Submit Synopsis
          <div
      style={{
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "500",
        color:"maroon"
      }}
    >
      Not Enough Subject cleared!!
    </div>
        </div>
      
      )
    )
    }
    </>
  );
}
