import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from 'axios'
import synopsisService from "../../API/thesis";
import Modal from "@mui/material/Modal";


import {
  Autocomplete,
  CircularProgress,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BackdropModal from "../UI/BackdropModal";
import { SignalWifiStatusbarConnectedNoInternet4Sharp } from "@mui/icons-material";
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
export default function EvaluateSynopsisMS({}) {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(true);
 
  const [selectedSynopsis, setSelectedSynopsis] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [data, setData] = useState({});
  const [scheduleLabels, setScheduleLabels] = useState([]);
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [evall,setevals]=useState();
    const {state}=useLocation()
    console.log("statets",state)
 
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
  

  useEffect(() => {
    async function fetchData() {
      // location.state.data.registrationNo
      const schd = await synopsisService.getThesisSchedules();
      // isme se student ka data chaiye humein
      console.log("schd",schd)
      const evaluations=await synopsisService.getThesisEvaluations();
      console.log("Evaluations",evaluations)
        //
      const alreadysubmittedSynopsis =
        await synopsisService.getSubmittedThesis();
        console.log("already submitted Thesis",alreadysubmittedSynopsis)

      const schedularData = schd.filter(
        (s) =>
          s.student_id.registrationNo === location.state.data.registrationNo
      );
      console.log("schedulerdata",schedularData)
      const synopsisData = alreadysubmittedSynopsis.filter(
        (s) =>
          s.student_id.registrationNo === location.state.data.registrationNo
      );

      const evals=evaluations.filter((item)=>item.schedule_id._id==schedularData[0]._id)
      console.log("evals",evals)
      setevals(evals)
      setSelectedSchedule(schedularData);
      console.log(schedularData);
      setSelectedSynopsis(synopsisData);
      setLoading(false);
      setData({ ...data, schedule_id: schedularData[0]._id });

    }

    fetchData();
  }, []);

  const onsubmit=()=>{
    navigate("/Dashboard/EvaluateThesis(MS)", {
        state: { data:state.data},
      })
  }
  return loading ? (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "4rem",
      }}
    >
      <CircularProgress size={60} thickness={4.5} color="secondary" />
    </Box>
  ) :(
    <>
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
        fontSize:24,
        fontWeight:'bold',
  }}
    >
      Evaluations
      </Box>
        <div style={{display:'flex',justifyContent:"space-between",margin:40}}>
      {evall?.map((item)=>(
        <Box
      style={{
        justifyContent: "center",
        marginTop: "4rem",
        borderWidth:2,
        borderColor:'black'
      }}
    ><div
    style={{
      width: "23rem",
      marginTop: "0",
      marginBottom: "0",
      display: "flex",
      alignItems: "center",
      borderWidth:2,
      borderColor:'black'
    }}
  >
    <h3
      style={{
        marginRight: "1rem",
        marginTop: "0",
        marginBottom: "0",
        fontSize: "1.1rem",
        fontWeight:"bold"
      }}
    >
      Evaluator:
    </h3>
    <p
      style={{
        marginTop: "0",
        marginBottom: "0",
        fontSize:17
      }}
    >
      {item.evaluator_id.username}
    </p>
  </div>
  <div
    style={{
      width: "23rem",
      marginTop: "0",
      marginBottom: "0",
      display: "flex",
      alignItems: "center",

    }}
  >
    <h3
      style={{
        marginRight: "1rem",
        marginTop: "0",
        marginBottom: "0",
        fontSize: "1.1rem",
        fontWeight:"bold"

      }}
    >
      Evaluation Status:
    </h3>
    <p
      style={{
        marginTop: "0",
        marginBottom: "0",
        fontSize:17

      }}
    >
      {item.evaluationStatus.evaluationStatus}
    </p>
  </div>
  <div
    style={{
      width: "23rem",
      marginTop: "0",
      marginBottom: "0",
      display: "flex",
      alignItems: "center",
    }}
  >
    <h3
      style={{
        marginRight: "1rem",
        marginTop: "0",
        marginBottom: "0",
        fontSize: "1.1rem",
        fontWeight:"bold"

      }}
    >
      Comments:
    </h3>
    <p
      style={{
        marginTop: "0",
        marginBottom: "0",
        fontSize:17

      }}
    >
      {item.comments}
    </p>
  </div>
    </Box>
    
      ))}
      </div>
      <Button
          type="downlaod"
          variant="contained"
          color="secondary"
          sx={{ mb: 2, mr: 2 }}
          onClick={onsubmit}
        >
            Next
        </Button>
    </>


  )
}
