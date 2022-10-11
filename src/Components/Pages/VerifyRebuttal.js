import React, { useEffect, useState } from "react";
import DataTable from "../UI/TableUI";
import axios from "axios";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import progressReportService from "../../API/progressReports";
import BackdropModal from "../UI/BackdropModal";
import { useFormik } from "formik";
import studentService from "../../API/students";
import sessionsService from "../../API/sessions";
import { Paper, Typography } from "@mui/material";
import synopsisService from "../../API/synopsis";
import { Verified } from "@mui/icons-material";

export default function ManageProgressReport() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [progressReportId, setProgressReportId] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [Id,setId]=useState()
  const [token, setToken] = useState("");
  const [reports, setReports] = useState([]);
  const [extradata, setextradata] = useState([]);
  const navigate=useNavigate()
  const [verified,setverified]=useState(true)
  const [rid,setrid]=useState()
  const [synopsisFile,setfile]=useState("")
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  async function fetchData() {
   
    const res= await synopsisService.getRebuttal();
    console.log("synopsis",res)
    

    const extradataa=res?.data?.map((item)=>({
        goIsRequiredAgain:"No",
        goComment:item.evaluation_id.goEvaluation.goComment,
        finalRecommendation:item.evaluation_id.goEvaluation.finalRecommendation,
        isEvaluated:item.evaluation_id.goEvaluation.isEvaluated
    }));
    setextradata(extradataa)
    const data = res?.data?.map((res) => ({
      
      Student: res.student_id?.username,
      Student_id:res.student_id?._id,
      Synopsis: res?.synopsisTitle,
      SynopsisFile:res?.synopsisFile,
      Status: res?.evaluation_id.goEvaluation.goIsRequiredAgain,
      Comment: res?.evaluation_id.goEvaluation.goComment,
      id: res?.evaluation_id._id,
      _id:res?._id
    }));

   
    const dataa=data.filter(item=>item.Status=="Yes")
    setReports(dataa)
    data.map((item) => {
      console.log("res",item.Status)
      if(item.Status=="Yes"){
        console.log("i am right")
      }
  })
    console.log("Progress Report data", dataa);
  }
  useEffect(() => {
    fetchData();
    const user = JSON.parse(localStorage.getItem("user"));

    var { token } = user;
    console.log(token);
    setToken(token);
  }, []);

  

  const progressHeader = [
    {
      field: "Student",
      headerName: "Student",
      width: 150,
    },
    { field: "Synopsis", headerName: "Synopsis", width: 100 },
    { field: "Status", headerName: "isRequired", width: 150 },
    { field: "Comment", headerName: "Comment", width: 300 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (props) => (
        <>
          
          <Button
            onClick={() => {
              handleOpen();
              setverified(true)
              setId(props.row?.Student_id)
              setrid(props.row._id)
              setfile(props.row.SynopsisFile)
              setProgressReportId(props.row.id);
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Verify
          </Button>
          <Button
            onClick={() => {
              handleOpen1();
              setverified(false)
              setId(props.row?.Student_id)
              setrid(props.row._id)
              setfile(props.row?.SynopsisFile)
              setProgressReportId(props.row?.id);
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Decline
          </Button>
        </>
      ),
    },
    
  ];

  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",

    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Paper style={{marginBottom:20}}>
         <label style={{margin:20,fontWeight:'bold',marginLeft:"25%"}}> Are you sure you want to Verify?? </label>

          </Paper>
          <Box>
            

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              style={{marginLeft:"45%"}}
              onClick={async () => {
                try {
                  let res = await synopsisService.verifyRebuttal(
                    progressReportId,extradata,verified,synopsisFile,Id,rid
                  );
                  console.log(res);
                  fetchData();
                  if (res.status === 200) {
                    setShowUpdateModal(true);

                    console.log(res);
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={open1} onClose={handleClose1}>
        <Box sx={style}>
          <Paper style={{marginBottom:20}}>
         <label style={{margin:20,fontWeight:'bold',marginLeft:"25%"}}> Are you sure you want to decline?? </label>

          </Paper>
          <Box>
            

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              style={{marginLeft:"45%"}}
              onClick={async () => {
                try {
                  let res = await synopsisService.verifyRebuttal(
                    progressReportId,extradata,verified,synopsisFile,Id,rid
                  );
                  console.log(res);
                  fetchData();
                  if (res.status === 200) {
                    setShowNotificationModal(true);

                    console.log(res);
                  }
                } catch (error) {
                  setShowErrorModal(true);
                }
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataTable header={progressHeader}  data={reports} />
      </div>
      
      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Verified!"}
      >
        Synopsis has been Verified     
         </BackdropModal>

         <BackdropModal
        showModal={showNotificationModal}
        setShowModal={setShowNotificationModal}
        title={"Notification!"}
      >
        Notification has been Sent.
      </BackdropModal>
      <BackdropModal
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
        title={"Error!"}
      >
        Something went wrong.
      </BackdropModal>
    </>
  );
}
