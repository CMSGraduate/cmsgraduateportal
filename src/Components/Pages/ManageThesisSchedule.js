import React, { useEffect, useState } from "react";
import DataTable from "../UI/TableUI";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";

import { TextField } from "@mui/material";
import BackdropModal from "../UI/BackdropModal";

import { useFormik } from "formik";

import { useSelector } from "react-redux";
import thesisService from "../../API/thesis";

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

export default function ManageThesisSchedule() {
  const { currentRole } = useSelector((state) => state.userRoles);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [schedule, setSchedule] = useState([]);
  const [selectedSchedule, setselectedSchedule] = useState([]);
  const [selectedDate, setselectedDate] = useState(null);

  async function getData() {
    const res = await thesisService.getThesisSchedules();
    console.log(res);

    let filteredSchedules = [];
    if (currentRole.toLowerCase().includes("ms")) {
      filteredSchedules = res.filter((item) =>
        item.program_id?.programShortName.toLowerCase().includes("ms")
      );
    } else if (currentRole.toLowerCase().includes("phd")) {
      filteredSchedules = res.filter((item) =>
        item.program_id?.programShortName.toLowerCase().includes("phd")
      );
    } else {
      filteredSchedules = res;
    }

    console.log(filteredSchedules);

    let data = filteredSchedules?.map((sch) => ({
      id: sch?._id,
      Name: sch?.student_id?.username,
      RegistrationNo: sch?.student_id?.registrationNo,
      Email: sch?.student_id?.email,
      Program: sch?.program_id?.programShortName,
      Professor: sch?.scheduledBy?.username,
      data: sch,
    }));
    setSchedule(data);
  }

  useEffect(() => {
    getData();
  }, []);

  console.log(schedule);

  const programWiseHeader = [
    {
      field: "Name",
      headerName: "Name",
      width: 150,
    },
    { field: "RegistrationNo", headerName: "Registration No.", width: 150 },
    { field: "Email", headerName: "Email", width: 350 },
    { field: "Professor", headerName: "Professor", width: 300 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (props) => (
        <>
          <Button
            onClick={async () => {
              console.log(props.row);
              const res = await thesisService.deleteSchedule(props.row.id);

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
          </Button>

          <Button
            onClick={() => {
              setselectedSchedule(props.row);
              setselectedDate(new Date(props.row.data.defenseDate));
              handleOpen();
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

  console.log(typeof selectedDate);
  console.log(selectedDate);

  const formik = useFormik({
    initialValues: {
      username: selectedSchedule?.data?.student_id?.username,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      let res = await thesisService.updateSchedule(selectedSchedule.id, {
        defenseDate: selectedDate,
      });
      getData();
      if (res.status === 200) {
        setShowUpdateModal(true);

        console.log(res);
      } else {
      }
      console.log(res);
    },
  });

  console.log(selectedSchedule);

  const handleChangeDate = (newValue) => {
    // setselectedDate({ ...data, date: newValue });
    setselectedDate(newValue);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Box sx={{ width: "50%" }}>
              <TextField
                disabled
                sx={{ width: "100%", marginBottom: "5px" }}
                label="Name"
                name="username"
                color="secondary"
                variant="standard"
                value={formik.values.username}
                onChange={formik.handleChange}
              />

              <Box
                sx={{ minWidth: 120, marginBottom: "5px", marginTop: "10px" }}
              ></Box>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                color="secondary"
              >
                <DateTimePicker
                  color="secondary"
                  name="defenseDate"
                  label="New Submission Deadine"
                  value={selectedDate && selectedDate}
                  onChange={handleChangeDate}
                  renderInput={(params) => (
                    <TextField {...params} color="secondary" />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 1.5 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataTable header={programWiseHeader} data={schedule} />
      </div>
      <BackdropModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        title={"Delete!"}
      >
        Schedule has been Deleted.
      </BackdropModal>
      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Update!"}
      >
        Schedule has been Updated.
      </BackdropModal>
    </>
  );
}
