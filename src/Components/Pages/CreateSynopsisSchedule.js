import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import synopsisService from "../../API/synopsis";
import programsService from "../../API/programs";
import BackdropModal from "../UI/BackdropModal";
import { useSelector } from "react-redux";

export default function CreateSynopsisSchedule() {
  const { currentRole } = useSelector((state) => state.userRoles);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [submittedSynopsis, setSubmittedSynopsis] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [data, setData] = React.useState({
    student_id: "",
    // session_id: "",
    program_id: "",
    defenseDate: new Date(),
  });

  const handleChange = (event) => {
    console.log(event.target.value);
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleChangeDate = (newValue) => {
    console.log(newValue);
    setData({ ...data, defenseDate: newValue });
  };
  useEffect(() => {
    async function fetchData() {
      const stds = await synopsisService.getSubmittedSynopsis();
      console.log(stds);

      if (currentRole.toLowerCase().includes("ms")) {
        let msStudents = stds.filter((std) =>
          std.student_id.program_id.programShortName
            .toLowerCase()
            .includes("ms")
        );
        setSubmittedSynopsis(msStudents);
      } else {
        let phdStudents = stds.filter((std) =>
          std.student_id.program_id.programShortName
            .toLowerCase()
            .includes("phd")
        );
        setSubmittedSynopsis(phdStudents);
      }
      const prog = await programsService.getPrograms();
      setPrograms(prog);
    }

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(data);
      const res = await synopsisService.createSchedule(data);

      if (res.status === 200) {
        setShowSubmitModal(true);
      }
    } catch (error) {
      if (error.response.status === 500) {
        setShowErrorModal(true);
      }
    }
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
        <h1>Synopsis Schedule</h1>
      </div>
      {/* Form starts here */}
      <Box component="form" noValidate sx={{ flexGrow: 1 }}>
        <Grid container spacing={6}>
          {/* <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Session</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="session_id"
                value={data.session_id}
                label="Session"
                // onChange={handleChange}
              >
                 {submittedSynopsis.map((oneSubmission) => (
                  <MenuItem
                    selected="selected"
                    value={oneSubmission.student_id.synopsisSession_id._id}
                  >
                    {oneSubmission.student_id.synopsisSession_id.title}
                  </MenuItem>
                ))} 
                <MenuItem value={10}>SP22</MenuItem>
                <MenuItem value={20}>FA22</MenuItem>
                <MenuItem value={30}>FA23</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={4}>
            <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DateTimePicker
                autoOk={true}
                color="secondary"
                fullWidth
                name="defenseDate"
                label="Defense Date"
                value={data.defenseDate || ""}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Student</InputLabel>
              <Select
                color="secondary"
                value={data.student_id}
                label="Student"
                name="student_id"
                onChange={handleChange}
              >
                {submittedSynopsis.map((oneSubmission) => (
                  <MenuItem
                    selected="selected"
                    value={oneSubmission?.student_id?._id}
                  >
                    {oneSubmission?.student_id?.registrationNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Program</InputLabel>
              <Select
                color="secondary"
                name="program_id"
                value={data.program_id}
                label="Program"
                onChange={handleChange}
              >
                {programs.map((program) => (
                  <MenuItem selected="selected" value={program._id}>
                    {program.programShortName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          style={{ marginTop: "2%", width: "20%" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>

      <BackdropModal
        showModal={showSubmitModal}
        setShowModal={setShowSubmitModal}
        title={"Schedule!"}
      >
        Thesis has been scheduled.
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
