import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import studentService from "../../API/students";
import synopsisService from "../../API/synopsis";
import programsService from "../../API/programs";
import thesisService from "../../API/thesis";

export default function UpdateThesisStatus() {
  const [submittedSynopsis, setSubmittedSynopsis] = useState([]);
  const [submittedThesis, setSubmittedThesis] = useState([]);
  const [submittedReport, setSubmittedReport] = useState([]);
  const [selectedReport, setselectedReport] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [statusType, setStatusType] = useState("Synopsis");

  const [data, setData] = React.useState({
    status: "",
    student_id: "",
  });

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });

    console.log(data);
  };

  useEffect(() => {
    async function fetchData() {
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();

      setSubmittedSynopsis(submittedSynopsis);
      setSubmittedThesis(submittedThesis);
      if (statusType === "Synopsis") {
        setSubmittedReport(submittedSynopsis);
      } else {
        setSubmittedReport(submittedThesis);
      }
    }

    fetchData();
  }, []);

  // console.log(submittedSynopsis);
  // console.log(submittedThesis);
  console.log(submittedReport);
  console.log(selectedReport);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);
    if (statusType === "Synopsis") {
      synopsisService.updateSynopsisStatus(data);
    } else {
      thesisService.updateThesisStatus(data);
    }
  };

  console.log(data);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <h1>Thesis/Synopsis Status</h1>
      </div>
      {/* Form starts here */}
      <Box component="form" noValidate sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid container style={{ marginLeft: "1.25rem" }}>
            <FormControl sx={{ mb: 1 }}>
              <FormLabel color="secondary">Status</FormLabel>
              <RadioGroup
                row
                name="studentType"
                value={statusType}
                onChange={(e) => {
                  setStatusType(e.target.value);
                  if (e.target.value === "Synopsis") {
                    setSubmittedReport(submittedSynopsis);
                  } else {
                    setSubmittedReport(submittedThesis);
                  }
                }}
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
            <Box
              style={{
                marginTop: "1rem",
                marginLeft: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <h3>Current Status: &nbsp;</h3>
              </div>
              <div>
                <p>
                  {selectedReport?.synopsisStatus ||
                    selectedReport?.thesisStatus ||
                    "N/A"}
                </p>
              </div>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel color="secondary">
                Update Thesis/Synopsis Status
              </InputLabel>
              <Select
                color="secondary"
                name="status"
                value={data.status || " "}
                label="Update Thesis/Synopsis Status"
                onChange={handleChange}
              >
                <MenuItem value={"Synopsis Evaluation"}>
                  Synopsis Evaluation
                </MenuItem>
                <MenuItem value={"Internal Evaluation"}>
                  Internal Evaluation
                </MenuItem>
                <MenuItem value={"External Evaluation"}>
                  External Evaluation
                </MenuItem>
                <MenuItem value={"Pass Out"}>Pass Out</MenuItem>
                <MenuItem value={"Dismissed"}>Dismissed</MenuItem>
                <MenuItem value={"Synopsis Not Submitted for GAC"}>
                  Synopsis Not Submitted for GAC
                </MenuItem>
                <MenuItem value={"Unscheduled"}>Unscheduled</MenuItem>
                <MenuItem value={"Scheduled"}>Scheduled</MenuItem>
                <MenuItem value={"Conducted"}>Conducted</MenuItem>
                <MenuItem value={"Approved By GAC"}>Approved By GAC</MenuItem>
                <MenuItem value={"Minor Changes"}>Minor Changes</MenuItem>
                <MenuItem value={"Synopsis Not Submitted for DEAN office"}>
                  Synopsis Not Submitted for DEAN office
                </MenuItem>
                <MenuItem value={"Synopsis Submitted for DEAN office"}>
                  Synopsis Submitted for DEAN office
                </MenuItem>
                <MenuItem value={"Forwarded to DEAN Office "}>
                  Forwarded to DEAN Office
                </MenuItem>
                <MenuItem value={"Changes suggested by DEAN office"}>
                  Changes suggested by DEAN office
                </MenuItem>
                <MenuItem value={"Approved By DEAN"}>Approved By DEAN</MenuItem>
                <MenuItem value={"Thesis Not Submitted for Internal"}>
                  Thesis Not Submitted for Internal
                </MenuItem>
                <MenuItem value={"Thesis Submitted for Internal"}>
                  Thesis Submitted for Internal
                </MenuItem>
                <MenuItem value={"Accepted by Internal"}>
                  Accepted by Internal
                </MenuItem>
                <MenuItem value={"Thesis not Submitted for Internal"}>
                  Thesis not Submitted for Internal
                </MenuItem>
                <MenuItem value={"Thesis Submitted for Internal"}>
                  Thesis Submitted for Internal
                </MenuItem>
                <MenuItem value={"Deffered"}>Deffered</MenuItem>
                <MenuItem value={"Accepted"}>Accepted</MenuItem>
                <MenuItem value={"Major Changes"}>Major Changes</MenuItem>
                <MenuItem value={"Rejected"}>Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel color="secondary">Registration No.</InputLabel>
              <Select
                color="secondary"
                label="Registration No."
                name="student_id"
                value={selectedReport?.student_id?._id || " "}
                onChange={(event) => {
                  console.log(submittedReport);
                  const currentReport = submittedReport.filter(
                    (report) => report?.student_id?._id === event.target.value
                  );
                  setselectedReport(currentReport[0]);
                  handleChange(event);
                }}
              >
                {submittedReport.map((oneSynopsis) => (
                  <MenuItem
                    selected="selected"
                    value={oneSynopsis?.student_id?._id}
                  >
                    {oneSynopsis?.student_id?.registrationNo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Pinitial-body start */}
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
    </>
  );
}
