import React, { useEffect, useState } from "react";
import { studentData } from "../DummyData/DummyData";
import DataTable from "../UI/TableUI";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GPAs } from "../DummyData/DummyData";

import courseService from "../../API/course";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import BackdropModal from "../UI/BackdropModal";
import studentService from "../../API/students";
import { useFormik } from "formik";
import sessionsService from "../../API/sessions";
import programsService from "../../API/programs";
import adminService from "../../API/admin";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUseProxies } from "immer";
const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  /* gap: ".5rem", */
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",

  /* border: "2px solid #000", */
  boxShadow: 24,
  p: 4,
};

export default function ManageStudent() {
  const {
    user
  } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedStudent, setselectedStudent] = useState({});

  const getSupervisors = async () => {
    let data = await studentService.getSupervisors();

    console.table("SubmissionM", data?.supervisors);
    setSupervisors(data?.supervisors);
  };

  const getPrograms = async () => {
    let data = await programsService.getPrograms();
    console.log(data);
    setPrograms(data);
  };

  async function getData() {
    const res = await studentService.getStudents();
    console.log("studentsata",res);
    console.log("usedi",user);
    const array=res;
    console.log("array",array)
    let data = array.map((stud) => ({
      Name: stud?.username,
      RegistrationNo: stud?.registrationNo,
      Email: stud?.email,
      id: stud?._id,
      Program: stud?.program_id?.programShortName,
      data: stud,
    }));
    setStudents(data);
  }
  const navigate=useNavigate()

  useEffect(() => {
    getData();
    getSupervisors();
    getPrograms();
  }, []);
const [User,setuser]=useState()
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

          <Button
            onClick={() => {
              setuser(props.row)
              console.log("tows",props.row)
              setselectedStudent(props.row);
              handleOpen1();
              navigate('/Dashboard/ManageStudentResultDetail',{state:{User:props.row}})
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];
  

  return (
    <>
      
      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataTable header={studentHeader} data={students} />
      </div>
      
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
