import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button, Box } from "@mui/material";
import axios from "axios";
import BackdropModal from "../UI/BackdropModal";

export default function SendNotificationAll() {
  const [notification, setnotification] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let token = getToken();
    // alert("Submitted");
    try {
      const res = await axios.post(
        "http://localhost:3000/Notification/send-All",
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
      <TextField
        fullWidth
        sx={{ mb: 2, mt: 1 }}
        multiline
        rows={4}
        label="Notification"
        color="secondary"
        name="notification"
        variant="outlined"
        value={notification}
        onChange={(e) => setnotification(e.target.value)}
      />
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
