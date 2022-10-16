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
  const [supervisors, setSupervisors] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [error, setError] = useState();
  const [isError, setIsError] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [synopsissub,setsub]=useState(false)
  const [thesissub,settsub]=useState(false)

  const [file,setFile]=useState("")
  const [rebuttal,setreb]=useState(false)
const [clear,setclear]=useState(false)
  const [scheduleid,setsid]=useState();
  const [evaluationid,seteid]=useState();
  const [deadline,setdeadline]=useState()
  const getSupervisors = async () => {
    let data = await studentService.getSupervisors();
    console.table("SubmissionM", data?.supervisors);
    setSupervisors(data?.supervisors);
  };
  const getDeadlinesData = async () => {
    let res = await synopsisService.getDeadlines();
    console.log(res);
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

  const getSynopsisSubmission = async () => {
    await synopsisService.checkSubmission(user.user.student._id).then(res=>{
      
      console.log("hjeghjs",res)
     if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="No"){
      setsub(true)
      return(<div
    style={{
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "500",
    }}
  >
    You need to Pass Synopsis!!
  </div>)
     }
     
    }).catch(err=>{
     console.log("ererwe",err)
    })
    /*let filteredDeadlines = [];
    if (programShortName.toLowerCase().includes("ms")) {
      filteredDeadlines = res.filter((item) => item.program === "Masters");
    } else {
      filteredDeadlines = res.filter((item) => item.program === "PhD");
    }
    setDeadlines(filteredDeadlines);*/
  };

  const getSubmission=async()=>{
    console.log("hjeghjsjdjs")
    const token=getToken()
    try {
      const res = await API_SYNOPSIS.get(`synopsis/student-thesis-submission/${user.user.student._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("incheckthesissubmission",res)
      if(res.data.data!=null){
        if(res.data.message=="submitted"){
          settsub(true)
          console.log("ghekjks")
        }
        else{
        settsub(true)
        console.log("ghekjkspart2")

        if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="Yes"){
          console.log("hello");
          seteid(res.data.data._id)
          setsid(res.data.data.Schedule[0]._id)
          //setreb(true)
        }
       /* if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="No"){
          console.log("hello1234");

          setclear(true)
        }*/
      }
      }
      
      //return res;
    } catch (error) {
      return error.response;
    }
     //synopsisService.checkThesisSubmission(user.user.student._id).then(res=>{
      
       //console.log("hjeghjsjdjs",res.data)
    
      /*if(res.data.data!=null){
        if(res.data.message=="submitted"){
          settsub(true)
          console.log("ghekjks")
        }
        else{
        settsub(true)
        console.log("ghekjkspart2")

        if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="Yes"){
          console.log("hello");
          seteid(res.data.data._id)
          setsid(res.data.data.Schedule[0]._id)
          //setreb(true)
        }
       /* if(res.data.data!=null && res.data.data.goEvaluation.goIsRequiredAgain=="No"){
          console.log("hello1234");

          setclear(true)
        }
      }
      }*/
      
    // }).catch(err=>{
    //  console.log("ererwe",err)
    // })
     //console.log("synopsissub",synopsissub)
  }

  useEffect(() => {
    
    getSupervisors();
    getDeadlinesData()

    getSynopsisSubmission()
    getSubmission()

  }, [programShortName]);

  const validationSchema = yup.object({
    thesisTitle: yup.string().required(),
    supervisor: yup.string().required(),
    coSupervisor: yup.string().required(),
    thesisTrack: yup.string().required(),
    // thesisDocument: yup.string(),
    // synopsisNotification: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      thesisTitle: "",
      supervisor: "",
      coSupervisor: "",
      thesisTrack: "",
      thesisDocument: [],
      synopsisNotification: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("thesisTitle", values.thesisTitle);
      formData.append("supervisor", values.supervisor);
      formData.append("coSupervisor", values.coSupervisor);
      formData.append("thesisTrack", values.thesisTrack);
      formData.append("thesisDocument", values.thesisDocument[0]);
      formData.append("synopsisNotification", values.synopsisNotification[0]);
      formData.append("thesisFile",file)
      console.log(values);
      let token = getToken();
        var response;
        try {
          console.log(formData + "apisubmit");
          const res = await API_SYNOPSIS.post("synopsis/submit-thesis", formData, {
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

      
  const ress = await API_SYNOPSIS.post("synopsis/submit-thesisfile", {_id:response.data.data._id,file:file}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(ress);
  //return res;
  setShowSubmitModal(true);
    },
  });
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
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
  return (
    <>
    {!synopsissub?(
    <div
    style={{
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "500",
    }}
  >
    You need to Pass Synopsis!!
  </div>)
    :
      (deadlines[0] ?(

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
            name="thesisTitle"
            label="Thesis Title"
            color="secondary"
            variant="outlined"
            value={formik.values.thesisTitle}
            onChange={formik.handleChange}
            error={
              formik.touched.thesisTitle && Boolean(formik.errors.thesisTitle)
            }
            helperText={formik.touched.thesisTitle && formik.errors.thesisTitle}
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
            name="thesisTrack"
            label="Thesis Track"
            color="secondary"
            variant="outlined"
            value={formik.values.thesisTrack}
            onChange={formik.handleChange}
            error={
              formik.touched.thesisTrack && Boolean(formik.errors.thesisTrack)
            }
            helperText={formik.touched.thesisTrack && formik.errors.thesisTrack}
          />
          <div>
            <div>Synopsis Approval Notification:</div>
            <input
              type="file"
              name="synopsisNotification"
              min={1}
              onChange={(event) => {
                formik.setFieldValue(
                  "synopsisNotification",
                  event.currentTarget.files
                );
              }}
            />
            <div>Thesis Document :</div>
            <input
              type="file"
              min={1}
              name="thesisDocument"
              onChange={(event) => {
                formik.setFieldValue("thesisDocument", event.target.files);
                encodeFileBase64(event.currentTarget.files[0], "thesisFile")

              }}
            />
          </div>
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
              
          <BackdropModal
            showModal={showSubmitModal}
            setShowModal={setShowSubmitModal}
            title={"Submit!"}
          >
            Thesis has been submitted.
          </BackdropModal>
          <BackdropModal
            showModal={showErrorModal}
            setShowModal={setShowErrorModal}
            title={"Error!"}
          >
            Something went wrong.
          </BackdropModal>
        </Box>
      )
      
      
      :(
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          Nothing to submit right now
        </div>
      ))}
    </>
  );
}
