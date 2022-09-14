import React, { useState, useEffect } from "react";

import studentService from "../../API/students";
import DataTable from "../UI/TableUI";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { red } from "@mui/material/colors";
import adminService from "../../API/admin";
import BackdropModal from "../UI/BackdropModal";
import { useSelector } from "react-redux";

export default function AddSupervisoryCommitteeStudent() {
  const {
    user: {
      user: { student },
    },
  } = useSelector((state) => state.auth);

  console.log(student);

  const [showAddModal, setShowAddModal] = useState(false);

  const [supervisorsList, setSupervisorsList] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState([]);
  const [superviseData, setSuperviseData] = useState([]);
  const [error, setError] = useState(false);
  const [isIncomplete, setIsIncomplete] = useState(false);

  const committeeHeader = [
    {
      field: "facultyMember",
      headerName: "Faculty Member",
      width: 300,
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 300,
    },
  ];

  const superviseHeader = [
    {
      field: "facultyMember",
      headerName: "Faculty Member",
      width: 300,
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 300,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 300,
      renderCell: (props) => (
        <Button
          onClick={() => {
            var data = superviseData.filter((obj) => obj.id !== props.row.id);
            var list = supervisorsList.filter((id) => id !== props.row.id);

            setSupervisorsList(list);
            console.log(supervisorsList);
            setSuperviseData(data);
          }}
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginLeft: 0 }}
        >
          Delete
        </Button>
      ),
    },
  ];
  const getSupervisors = async () => {
    let data = await studentService.getSupervisors();

    console.table("SubmissionM", data?.supervisors);
    setSupervisors(data?.supervisors);
  };

  const getCommittee = async () => {
    const res = await adminService.getSupervisoryCommittee();

    let filteredCommittee = res?.data.filter(
      (item) => item.student_id._id === student._id
    );

    console.log(filteredCommittee[0].committee);

    const data = filteredCommittee[0].committee.map((item) => {
      return {
        facultyMember: item.faculty_id.fullName,
        designation: item.faculty_id.designation,
        id: item._id,
      };
    });
    console.log(data);

    setSelectedCommittee(data);
  };

  useEffect(() => {
    getSupervisors();
    getCommittee();
  }, []);

  console.log(selectedCommittee);

  const updateList = () => {
    console.log(error, supervisorsList.length);
    if (supervisorsList.length > 2) {
      setError(true);
    } else {
      setError(false);
      setSupervisorsList([...supervisorsList, selectedSupervisor._id]);
      setSuperviseData([
        ...superviseData,
        {
          id: selectedSupervisor._id,
          facultyMember: selectedSupervisor.username,
          designation: "supervisor",
        },
      ]);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(supervisorsList);
    setIsIncomplete(false);
    setError(false);
    if (supervisorsList.length !== 0 && supervisorsList.length === 3) {
      const res = await adminService.addSupervisoryCommittee(
        { committee: supervisorsList },
        student._id
      );
      setShowAddModal(true);

      if (res.status === 200) {
        setShowAddModal(true);
      }

      console.log("response", res);
    } else {
      setIsIncomplete(true);
    }
    getCommittee();
  };

  return (
    <>
      {!selectedCommittee[0] ? (
        <Box
          component="form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
          noValidate
          sx={{ minWidth: 120, marginBottom: "15px" }}
        >
          <FormControl fullWidth color="secondary">
            <InputLabel id="demo-simple-select-label">Supervisor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="supervisor"
              /* value={selectedSupervisor} */

              onChange={(e) => {
                setSelectedSupervisor(e.target.value);
                setError(false);
                setIsIncomplete(false);
              }}
              label="Supervisor"
            >
              {supervisors.map((item) => {
                return (
                  <MenuItem key={item._id} value={item}>
                    {item.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box
            sx={{ marginTop: "16px", display: "grid", placeItems: "center" }}
          >
            <Button
              onClick={() => {
                updateList();
                setIsIncomplete(false);
              }}
              variant="contained"
              color="secondary"
            >
              Add Supervisor
            </Button>
            <p style={{ marginBottom: "0px", color: red[400] }}>
              {error && "Maximun of 3 supervisors can be added"}
              {isIncomplete && "Committee must have exactly 3 members"}
            </p>
          </Box>
          <DataTable header={superviseHeader} data={superviseData} />

          <Box
            component={"div"}
            sx={{ marginTop: "24px", display: "grid", placeItems: "center" }}
          >
            <Button type="submit" variant="contained" color="secondary">
              Submit Supervisory Committee
            </Button>
          </Box>
        </Box>
      ) : (
        <DataTable header={committeeHeader} data={selectedCommittee} />
      )}

      <BackdropModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        title={"Submit!"}
      >
        Supervisory Committee submitted.
      </BackdropModal>
    </>
  );
}
