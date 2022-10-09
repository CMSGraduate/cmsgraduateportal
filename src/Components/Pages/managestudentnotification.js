import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import announcementService from "../../API/announcements";
import DataTable from "../UI/TableUI";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function ManageNotification() {
  const navigate=useNavigate()
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
      "http://localhost:3000/Notifications/getAllNotification",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("resss",res)
    
    const notifications = res.data.map((item) => {
      return {
        id: item._id,
        notification: item.notificationtitle,
        creationDate: item.creationDate,
        notificationfile:item.notification
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
          
          <Button
            onClick={()=>{
              navigate('/Dashboard/Display',{state:{report:props.row?.notificationfile}})
            }}
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
          >
            View
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
