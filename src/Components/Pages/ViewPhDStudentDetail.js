import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import synopsisService from "../../API/synopsis";
import studentService from "../../API/students";
import progressReportService from "../../API/progressReports";
import ReportTemplate from "../UI/ReportTemplate";
import ReportTemplateVerify from "../UI/ReportTemplateVerify";
import { useSelector, useDispatch } from "react-redux";

import thesisService from "../../API/thesis";
import "../../Components/UI/ActiveTab.css";

export default function ViewPhDStudentDetails() {
  const [loading, setLoading] = useState(true);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const { currentRole } = useSelector((state) => state.userRoles);
  useEffect(() => {
    async function fetchData() {
      const students = await studentService.getStudents();
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();
      const { data: progressReport } = await progressReportService.getReports();

      console.log(students);
      console.log(progressReport);
      console.log(submittedSynopsis);
      console.log(submittedThesis);

      let selectedStudents = [];

      students.forEach((student) => {
        if (student.program_id.programShortName.toLowerCase().includes("phd")) {
          let filteredSynopsis = submittedSynopsis.filter(
            (synopsis) => synopsis.student_id._id === student._id
          );
          let filteredThesis = submittedThesis.filter(
            (thesis) => thesis.student_id._id === student._id
          );
          let filteredProgress = progressReport.filter(
            (report) => report.student_id._id === student._id
          );

          console.log(filteredSynopsis);
          console.log(filteredThesis);

          selectedStudents.push({
            student_id: student,
            ...(filteredProgress.length > 0 && {
              progressReport: filteredProgress[0],
            }),
            ...(filteredSynopsis.length > 0 && {
              synopsisStatus: filteredSynopsis[0].synopsisStatus,
              synopsisTitle: filteredSynopsis[0].synopsisTitle,
            }),
            ...(filteredThesis.length > 0 && {
              thesisStatus: filteredThesis[0].thesisStatus,
              thesisTitle: filteredThesis[0].thesisTitle,
            }),
          });
        }
      });

      const stds = students.filter((student) =>
        student.program_id.programShortName.toLowerCase().includes("phd")
      );
      setStudents(stds);
      console.log(selectedStudents);
      setSelectedReport(selectedStudents);
      setFilteredReport(selectedStudents);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleRegistrationNo = (selectedStudent) => {
    console.log(selectedStudent);

    if (selectedStudent) {
      let report = selectedReport.filter(
        (report) => report.student_id.registrationNo === selectedStudent
      );
      setFilteredReport(report);
    } else {
      setFilteredReport(selectedReport);
    }
  };

  const defaultProps = {
    options: students,
    getOptionLabel: (student) => student.registrationNo || "",
  };

  return (
    <>
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultProps}
            id="controlled-demo"
            value={autocompleteValue}
            onChange={(value, newValue) => {
              let registrationNo = newValue?.registrationNo;
              setAutocompleteValue(newValue);
              handleRegistrationNo(registrationNo);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Registration No."
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box>

      <div>
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "4rem",
            }}
          >
            <CircularProgress size={60} thickness={4.5} color="secondary" />
          </Box>
        ) : (
          <>
            {filteredReport.map((report) => {
              return (
                <div className="supervisorWiseReport">
                  {(currentRole=="ADMIN" || currentRole=="PHD_COR")?
                  <ReportTemplateVerify report={report}/>
                  :
                  <ReportTemplate report={report} />
              }
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
