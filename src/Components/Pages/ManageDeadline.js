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

export default function ManageDeadline() {
  const [data, setData] = useState({
    type: "Synopsis",
    currentDeadline: new Date(),
    program: "Masters",
  });
  const [deadlines, setDeadlines] = useState([]);

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

  const handleChange = (event) => {
    console.log(event.target.value);
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleChangeDate = (newValue) => {
    setData({ ...data, newDeadline: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
    if (deadlines[0]) {
      const res = await synopsisService.updateDeadline(deadlines[0]._id, {
        type: data.type,
        deadline: data.newDeadline,
        expireAt: data.newDeadline,
        program: data.program,
        createdBy: user._id,
      });
      console.log("deadline updated" + res);
    } else {
      const res = await synopsisService.createDeadline({
        type: data.type,
        deadline: data.newDeadline,
        expireAt: data.newDeadline,
        program: data.program,
        createdBy: user._id,
      });
      console.log("deadline created" + res);
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
        <h1>Submission Deadline</h1>
      </div>
      {/* Form starts here */}
      <Box component="form" noValidate sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DateTimePicker
                disabled
                color="secondary"
                name="currentDeadline"
                label="Current Deadine"
                value={deadlines[0]?.deadline}
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} style={{ width: "100%" }}>
            <FormControl sx={{ mb: 1 }}>
              <FormLabel color="secondary">Type</FormLabel>
              <RadioGroup
                row
                name="type"
                value={data.type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Synopsis"
                  control={<Radio color="secondary" />}
                  label="Synopsis"
                />
                <FormControlLabel
                  value="Thesis"
                  control={<Radio color="secondary" />}
                  label="Thesis"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Program</InputLabel>
              <Select
                color="secondary"
                label="Program"
                name="program"
                value={data.program}
                onChange={handleChange}
              >
                <MenuItem key={data.program} value={data.program}>
                  {data.program}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DateTimePicker
                color="secondary"
                name="newDeadline"
                label="New Submission Deadine"
                value={data.newDeadline}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
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
          Submit
        </Button>
      </div>
    </>
  );
}
