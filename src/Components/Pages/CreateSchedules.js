import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import synopsisService from "../../API/synopsis";
import { useSelector } from "react-redux";
import announcementService from "../../API/announcements";

export default function ManageDeadline() {
  const [data, setData] = useState({
    type: "Synopsis",
    currentDeadline: new Date(),
    program: "Masters",
  });
  const [deadlines, setDeadlines] = useState([]);
  const [startdate,setstart]=useState()
  const [enddate,setend]=useState()
  const [timeslot,settimeslot]=useState()
  const [program,setprogram]=useState()
  const {
    user: { user },
  } = useSelector((state) => state.auth);

  const { currentRole } = useSelector((state) => state.userRoles);
  console.log(currentRole);

  useEffect(() => {
    async function getPrograms() {
      let filteredPrograms = [];
      if (currentRole.toLowerCase().includes("ms")) {
        data.program = "Masters";
      } else if (currentRole.toLowerCase().includes("phd")) {
        data.program = "PhD";
      }
      console.log(filteredPrograms);
    }
    const getData = async () => {
      const res = await synopsisService.getDeadlines();
      console.log(res);
      let filteredDeadlines = [];

      if (currentRole.toLowerCase().includes("ms")) {
        filteredDeadlines = res.filter(
          (item) => item.program === "Masters" && item.type === data.type
        );
      } else if (currentRole.toLowerCase().includes("phd")) {
        filteredDeadlines = res.filter(
          (item) => item.program === "PhD" && item.type === data.type
        );
      }
      console.log(filteredDeadlines);
      setDeadlines(filteredDeadlines);
    };
    getPrograms();
    getData();
  }, [currentRole, data]);

 

  const handleSubmit = async (event) => {
    var timeslots=[]
    var a=new Date(startdate)
    var b=new Date(enddate)
    if(timeslot=="15 min"){
      timeslots=["9:00-9:15","9:15-9:30"]
    }
    console.log("program",program)
    console.log("start",a.getDate()+"-"+a.getMonth()+"-"+a.getFullYear()+" ")

    console.log("end",enddate)
    console.log("time",timeslot)



  };
  const handleChangeDate = (newValue) => {
    setstart(newValue);
  };  const handleChangeDate1 = (newValue) => {
    setend(newValue);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <h1>Schedule</h1>
      </div>
      {/* Form starts here */}
      <Box component="form" noValidate sx={{ flexGrow: 1 }}>
      <Grid item xs={2} style={{margin:15}}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Program</InputLabel>
              <Select
                color="secondary"
                label="Program"
                name="program"
                value={program}
                onChange={(e)=>setprogram(e.target.value)}
              >
                <MenuItem key={"MS"} value={"MS"}>
                  {'MS'}
                </MenuItem>
                <MenuItem key={"PhD"} value={"PhD"}>
                  {'PhD'}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        <Grid container spacing={1} style={{margin:0}}>
          <Grid item xs={4}>
            <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DatePicker
                color="secondary"
                name="startdate"
                label="Start Date"
                value={startdate}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DatePicker
                color="secondary"
                name="enddate"
                label="End Date"
                value={enddate}
                onChange={handleChangeDate1}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Time Slot</InputLabel>
              <Select
                color="secondary"
                label="Time Slot"
                name="time slot"
                value={timeslot}
               onChange={(e)=>settimeslot(e.target.value)}
              >
                <MenuItem key={"15 min"} value={"15 min"}>
                  {"15 min"}
                </MenuItem>
                <MenuItem key={"30 min"} value={"30 min"}>
                  {"30 min"}
                </MenuItem>
                <MenuItem key={"45 min"} value={"45 min"}>
                  {"45 min"}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
      </Box>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          sx={{ mt: 4, mb: 2 }}
          onClick={handleSubmit}
        >
          Generate
        </Button>
      </div>
    </>
  );
}
