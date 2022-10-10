import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "../UI/TableUI";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import "../../Components/UI/ActiveTab.css";
export default function ManageNotification() {
  const [autocompleteValue, setAutocompleteValue] = useState(null);
 
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedreg,setreg]=useState(null)

  const [students, setStudents] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedReport, setSelectedReport] = useState([]);

  const navigate=useNavigate()
  const { currentRole } = useSelector((state) => state.userRoles);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [Data, setData] = useState([]);
  const [Datas, setDatas] = useState([]);

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
        notificationfile:item.notification,
        createdBy:item.createdBy
      };
    });
    console.log("noti", notifications);
    var array=[]
    const notifi = notifications.map((item) => {
      return {
       regno:item.createdBy.registrationNo
      };
    });
    notifi.forEach((c) => {
      if (!array.includes(c.regno)) {
          array.push(c.regno);
      }
  });
    console.log("sdgchj",notifi)
    console.log("arrat",array)
    setStudents(array)
    setData(notifications);
    setDatas(notifications)
  };

  useEffect(() => {
    getData();
  }, []);
  const handleRegistrationNo = (selectedStudent) => {

      console.log("sha",selectedStudent)
      console.log("shhgjha",Datas)

    if (selectedStudent) {
      let report = Datas.filter(
        (report) => report.createdBy.registrationNo === selectedStudent
      );
      setData(report);
      
    } else {
      setData(Datas);
      setAutocompleteValue(null)
      

      
    }
  };
  const defaultProps = {

    options: students,
    getOptionLabel: (student) => student|| "",
  };
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
    <Box sx={{ minWidth: 180, marginBottom: "15px" }}>
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            {...defaultProps}
            id="controlled-demo"
            value={autocompleteValue}
            onChange={(value, newValue) => {
              let registrationNo = newValue;
              setAutocompleteValue(newValue);
              handleRegistrationNo(registrationNo);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Registration No."
                variant="outlined"
                color="secondary"
              />
            )}
          />
        </Box>
      </Box>
      <DataTable header={viewNotificationHeader} data={Data} />
    </>
  );
}
