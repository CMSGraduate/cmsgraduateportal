import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import announcementService from "../../API/announcements";
import DataTable from "../UI/TableUI";
import { useSelector } from "react-redux";

export default function ManageNotification() {
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [Data, setData] = useState([]);
  const [notiData, setNotiData] = useState([]);
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };

  const getData = async () => {
    let token = getToken();
    const res = await axios.get(
      "http://localhost:3000/Notification/getAllNotification",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    var filteredNoti;
    if (currentRole.toLowerCase().includes("ms")) {
      filteredNoti = await res?.data?.filter((item) =>
        item.sentTo?.student_id?.program_id?.programShortName
          .toLowerCase()
          .includes("ms")
      );
      console.log("mnoti", filteredNoti);
    } else {
      filteredNoti = await res?.data?.filter((item) =>
        item.sentTo?.student_id?.program_id?.programShortName
          .toLowerCase()
          .includes("phd")
      );
      console.log("pnoti", filteredNoti);
    }
    const notifications = filteredNoti.map((item) => {
      return {
        id: item._id,
        notification: item.notification,
        creationDate: item.creationDate,
      };
    });
    console.log("noti", notifications);
    setData(notifications);
  };

  useEffect(() => {
    getData();
  }, []);

  const viewNotificationHeader = [
    {
      field: "notification",
      headerName: "Notification",
      width: 400,
    },

    { field: "creationDate", headerName: "Date", width: 400 },

    {
      field: "Action",
      headerName: "Action",
      width: 150,

      renderCell: (props) => (
        <>
          {/* <Button
            onClick={async () => {
              let token = getToken();
              await axios.delete(
                `http://localhost:3000/Notification/Markasread/${props.row._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              getData();
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 0 }}
          >
            Edit
          </Button> */}
          <Button
            onClick={async () => {
              let token = getToken();
              await axios.delete(
                `http://localhost:3000/Notification/Markasread/${props.row._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              getData();
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <DataTable header={viewNotificationHeader} data={Data} />
    </>
  );
}
