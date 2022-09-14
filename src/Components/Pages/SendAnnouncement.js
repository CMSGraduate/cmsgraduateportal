import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Button, Box } from "@mui/material";
import axios from "axios";
import BackdropModal from "../UI/BackdropModal";
import announcementService from "../../API/announcements";

export default function SendAnnouncement() {
  const [announcement, setannouncement] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await announcementService.sendAnnouncements({
      announcement: announcement,
    });

    if (res.status === 201) {
      setShowAnnouncementModal(true);
    } else {
      setShowErrorModal(true);
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
        label="Announcement"
        color="secondary"
        name="announcement"
        variant="outlined"
        value={announcement}
        onChange={(e) => setannouncement(e.target.value)}
      />
      <Button type="submit" variant="contained" size="large" color="secondary">
        Send Announcement
      </Button>

      <BackdropModal
        showModal={showAnnouncementModal}
        setShowModal={setShowAnnouncementModal}
        title={"Announcement!"}
      >
        Announcement has been Sent.
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
