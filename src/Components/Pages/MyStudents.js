import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import DataTable from "../UI/TableUI";
import BackdropModal from "../UI/BackdropModal";
import studentService from "../../API/students";
import ReportTemplate from "../UI/ReportTemplate";
import synopsisService from "../../API/synopsis";
import thesisService from "../../API/thesis";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function MyStudents() {
  const {
    user: { faculty: currentUser },
  } = JSON.parse(localStorage.getItem("user"));
  console.log(currentUser);

  // const [reportType, setReportType] = useState("Synopsis");
  const [filteredReport, setFilteredReport] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setselectedStudent] = useState({});

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    async function fetchData() {
      const students = await studentService.getStudents();
      const submittedSynopsis = await synopsisService.getSubmittedSynopsis();
      const submittedThesis = await thesisService.getSubmittedThesis();

      console.log(students);
      console.log(submittedSynopsis);
      console.log(submittedThesis);

      let selectedStudents = [];
      let studentsArray = [];

      students.forEach((student) => {
        if (student.supervisor_id.username === currentUser.fullName) {
          let filteredSynopsis = submittedSynopsis.filter(
            (synopsis) => synopsis.student_id._id === student._id
          );
          let filteredThesis = submittedThesis.filter(
            (thesis) => thesis.student_id._id === student._id
          );

          console.log(filteredSynopsis);
          console.log(filteredThesis);
          selectedStudents.push({
            student_id: student,
            ...(filteredSynopsis.length > 0 && {
              synopsisStatus: filteredSynopsis[0].synopsisStatus,
              synopsisTitle: filteredSynopsis[0].synopsisTitle,
            }),
            ...(filteredThesis.length > 0 && {
              thesisStatus: filteredThesis[0].thesisStatus,
              thesisTitle: filteredThesis[0].thesisTitle,
            }),
          });

          studentsArray.push({
            Name: student.username,
            RegistrationNo: student.registrationNo,
            Email: student.email,
            id: student._id,
            Program: student.program_id.programShortName,
          });
        }
      });
      console.log(selectedStudents);
      setFilteredReport(selectedStudents);
      setStudents(studentsArray);
    }
    fetchData();
  }, []);

  console.log(students);

  const studentHeader = [
    {
      field: "Name",
      headerName: "Name",
      width: 150,
    },
    { field: "RegistrationNo", headerName: "Registration No.", width: 150 },
    { field: "Email", headerName: "Email", width: 350 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (props) => (
        <>
          {/* <Button
            onClick={async () => {
              console.log(props.row);
              const res = await studentService.deleteStudent(props.row.id);

              getData();
              if (res.status === 200) {
                setShowDeleteModal(true);
              }
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 0 }}
          >
            Delete
          </Button> */}

          <Button
            onClick={() => {
              setselectedStudent(props.row.id);
              handleOpen();
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            View Details
          </Button>
        </>
      ),
    },
  ];

  console.log(selectedStudent);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {/*  <FormControl sx={{ mb: 1 }}>
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
          </FormControl> */}

          {filteredReport.map((report) => {
            return (
              <div>
                {report.student_id._id === selectedStudent && (
                  <ReportTemplate report={report} />
                )}
              </div>
            );
          })}
          <Button
            type="button"
            onClick={handleClose}
            variant="contained"
            color="secondary"
            sx={{ mt: 1.5 }}
          >
            Back
          </Button>
        </Box>
      </Modal>
      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataTable header={studentHeader} data={students} />
      </div>
      <BackdropModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        title={"Delete!"}
      >
        Student has been Deleted.
      </BackdropModal>
      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Update!"}
      >
        Student has been Updated.
      </BackdropModal>
    </>
  );
}
