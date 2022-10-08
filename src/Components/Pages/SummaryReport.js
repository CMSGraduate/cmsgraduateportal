import React, { useState, useEffect, useRef } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import studentService from "../../API/students";
import profile from "../../../src/avatar-1.jpg";
import synopsisService from "../../API/synopsis";
import "../../Components/UI/ActiveTab.css";

import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import thesisService from "../../API/thesis";
import { useReactToPrint } from "react-to-print";
import sessionsService from "../../API/sessions";
import ReportTemplate from "../UI/ReportTemplate";

const statuses = [
  "Scheduled",
  "Unscheduled",
  "Pass Out",
  "Synopsis Evaluation",
  "Internal Evaluation",
  "External Evaluation",
  "Dismissed",
  "Synopsis Not Submitted for GAC",
  "Conducted",
  "Approved By GAC",
  "Minor Changes",
  "Synopsis Not Submitted for DEAN office",
  "Synopsis Submitted for DEAN office",
  "Forwarded to DEAN Office",
  "Changes suggested by DEAN office",
  "Approved By DEAN",
  "Thesis Not Submitted for Internal",
  "Thesis Submitted for Internal",
  "Accepted by Internal",
  "Thesis not Submitted for Internal",
  "Thesis Submitted for Internal",
  "Deffered",
  "Accepted",
  "Major Changes",
  "Rejected",
];

export default function SummaryReport() {
  const componentRef = useRef();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);

  const [reportType, setReportType] = useState("Synopsis");
  const [selectedReport, setSelectedReport] = useState([]);
  const [submittedSynopsis, setSubmittedSynopsis] = useState([]);
  const [submittedThesis, setSubmittedThesis] = useState([]);
  const [submittedReport, setSubmittedReport] = useState([]);
  const [filteredSynopsis, setFilteredSynopsis] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    async function fetchData() {
      const sessions = await sessionsService.getSessions();
      const students = await studentService.getStudents();
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();

      console.log(submittedSynopsis);
      console.log(submittedThesis);

      let selectedStudents = [];

      students.forEach((student) => {
        let filteredSynopsis = submittedSynopsis.filter(
          (synopsis) => synopsis.student_id._id === student._id
        );
        let filteredThesis = submittedThesis.filter(
          (synopsis) => synopsis.student_id._id === student._id
        );

        if (filteredSynopsis.length > 0 && filteredThesis.length > 0) {
          selectedStudents.push({
            student_id: filteredSynopsis[0]?.student_id,
            sessionTitle: filteredSynopsis[0]?.student_id?.session_id?.title,
            synopsisStatus: filteredSynopsis[0]?.synopsisStatus,
            synopsisTitle: filteredSynopsis[0]?.synopsisTitle,
            thesisStatus: filteredThesis[0]?.thesisStatus,
            thesisTitle: filteredThesis[0]?.thesisTitle,
          });
        } else if (filteredThesis.length > 0) {
          selectedStudents.push({
            student_id: filteredThesis[0]?.student_id,
            sessionTitle: filteredThesis[0]?.student_id?.session_id?.title,
            thesisStatus: filteredThesis[0]?.thesisStatus,
            thesisTitle: filteredThesis[0]?.thesisTitle,
          });
        } else if (filteredSynopsis.length > 0) {
          selectedStudents.push({
            student_id: filteredSynopsis[0].student_id,
            sessionTitle: filteredSynopsis[0].student_id.session_id.title,
            synopsisStatus: filteredSynopsis[0].synopsisStatus,
            synopsisTitle: filteredSynopsis[0].synopsisTitle,
          });
        }
      });
      setSelectedReport(selectedStudents);
      setFilteredReport(selectedStudents);
      setSessions(sessions);
      setLoading(false);
    }
    fetchData();
  }, []);

  console.log(selectedReport);

  useEffect(() => {
    console.log(selectedStatus);

    if (selectedSession) {
      let std = [];

      selectedReport.forEach((student) => {
        if (selectedStatus) {
          if (reportType === "Synopsis") {
            if (
              student.sessionTitle === selectedSession.title &&
              student.synopsisStatus === selectedStatus
            ) {
              std.push(student);
            }
          } else {
            if (
              student.sessionTitle === selectedSession.title &&
              student.thesisStatus === selectedStatus
            ) {
              std.push(student);
            }
          }
        } else {
          if (student.sessionTitle === selectedSession.title) {
            std.push(student);
          } else {
            setFilteredReport(selectedReport);
          }
        }
      });
      setFilteredReport(std);
    } else {
      setFilteredReport(selectedReport);
    }
  }, [selectedSession, selectedStatus, reportType]);

  useEffect(() => {
    let std = [];
    if (selectedStatus) {
      selectedReport.forEach((student) => {
        if (selectedSession) {
          if (reportType === "Synopsis") {
            if (
              student.synopsisStatus === selectedStatus &&
              student.sessionTitle === selectedSession.title
            ) {
              std.push(student);
            }
          } else {
            if (
              student.thesisStatus === selectedStatus &&
              student.sessionTitle === selectedSession.title
            ) {
              std.push(student);
            }
          }
        } else {
          if (reportType === "Synopsis") {
            if (student.synopsisStatus === selectedStatus) {
              std.push(student);
            }
          } else {
            if (student.thesisStatus === selectedStatus) {
              std.push(student);
            }
          }
        }
      });
      setFilteredReport(std);
    }
  }, [selectedStatus, selectedSession, reportType]);

  console.log(filteredReport);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const defaultProps = {
    options: sessions,
    getOptionLabel: (session) => session?.title || "",
  };
  const statusProps = {
    options: statuses,
    getOptionLabel: (status) => status || "",
  };

  return (
    <>
      <Box sx={{ minWidth: 120, mb: 6 }}>
        <Typography
          sx={{ mb: 4, color: "#572E74", fontWeight: "500" }}
          textAlign={"center"}
          variant="h5"
        >
          Summary Report
        </Typography>
        <FormControl sx={{ mb: 1 }}>
          <FormLabel color="secondary">Student</FormLabel>
          <RadioGroup
            row
            name="studentType"
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
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

        <Box style={{ display: "flex", gap: "1%" }}>
          <Box width={"49%"} sx={{ mb: 4 }}>
            <Autocomplete
              fullWidth
              {...defaultProps}
              id="controlled-demo"
              value={selectedSession}
              onChange={(value, newValue) => {
                let session = newValue;
                console.log(session);
                setSelectedSession(session);
                if (session === null) {
                  setSelectedStatus(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label="Select Session"
                  variant="outlined"
                  color="secondary"
                />
              )}
            />
          </Box>
          <Box width={"49%"} sx={{ mb: 4 }}>
            <Autocomplete
              fullWidth
              {...statusProps}
              id="controlled-demo"
              value={selectedStatus}
              onChange={(value, newValue) => {
                let status = newValue;
                console.log(status);
                setSelectedStatus(status);
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  label="Select Status"
                  variant="outlined"
                  color="secondary"
                />
              )}
            />
          </Box>
        </Box>
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "4rem",
            }}
          >
            <CircularProgress size={60} thickness={4.5} color="secondary" />
          </Box>
        ) : (
          <>
            <div ref={componentRef} className="supervisorWiseReport">
              <Box
                sx={{
                  marginTop: 2,
                  marginBottom: 4,
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #f2f2f2",
                }}
              >
                <div style={{ display: "flex" }}>
                  <img
                    style={{
                      width: "350px",
                    }}
                    alt="Remy Sharp"
                    src="../assets/images/cui.png"
                  />
                  <Typography
                    style={{ marginLeft: "-13rem", marginTop: "3px" }}
                    component="h1"
                    variant="h4"
                  >
                    COMSATS UNIVERSITY ISLAMABD
                  </Typography>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    style={{ marginTop: "-2rem" }}
                    component="h1"
                    variant="h5"
                  >
                    GRADUATE OFFICE
                  </Typography>
                </div>
              </Box>
              {filteredReport.map((report) => {
                return (
                  <div>
                    {reportType === "Synopsis" && report.synopsisStatus && (
                      <ReportTemplate report={report} reportType={reportType} />
                    )}
                    {reportType === "Thesis" && report.thesisStatus && (
                      <ReportTemplate report={report} reportType={reportType} />
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              sx={{ mb: 2 }}
              onClick={handlePrint}
            >
              Print PDF
            </Button>
          </>
        )}
      </Box>
    </>
  );
}
