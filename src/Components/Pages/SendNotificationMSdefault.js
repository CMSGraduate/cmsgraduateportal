import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import BackdropModal from "../UI/BackdropModal";
import {Notifications} from "../DummyData/DummyData"
export default function SendNotificationPhD() {
  const [notification, setnotification] = useState("");
  const [selected, setselected] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  console.log(selected);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let token = getToken();
    // alert("Submitted");
    try {
      const res = await axios.post(
        `http://localhost:3000/Notification/send-to-/${selected?.student_id?._id}`,
        {
          notification,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);

      if (res.status === 201) {
        setShowNotificationModal(true);
      }
    } catch (error) {
      if (error.response.status === 500) {
        setShowErrorModal(true);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const [Students, setStudent] = useState([]);
  const getData = async () => {
    let token = getToken();
    const res = await axios.get(
      "http://localhost:3000/Notification/studentMS",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.data;
    setStudent([...data]);
  };

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">
            Registration No.
          </InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="selected"
            value={selected}
            label="Registration No"
            onChange={(e) => setselected(e.target.value)}
          >
            {Students.map((student) => {
              return (
                <MenuItem value={student}>
                  {student.student_id.registrationNo}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">
            Notification
          </InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="notification"
            value={notification}
            label="Notification"
            onChange={(e) => setnotification(e.target.value)}
          >
            {Notifications.map((student) => {
              return (
                <MenuItem value={student}>
                  {student}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      

      <Button type="submit" variant="contained" size="large" color="secondary">
        Send Notification
      </Button>

      <BackdropModal
        showModal={showNotificationModal}
        setShowModal={setShowNotificationModal}
        title={"Notification!"}
      >
        Notification has been Sent.
      </BackdropModal>
      <BackdropModal
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
        title={"Error!"}
      >
        Something went wrong.
      </BackdropModal>
    </Box>
  );
}
