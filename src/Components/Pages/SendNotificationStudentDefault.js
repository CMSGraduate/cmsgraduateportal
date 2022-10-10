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
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { getDate } from "date-fns";
export default function SendNotificationPhD() {
  const [notification, setnotification] = useState([]);
  const [title,settitle]=useState("")
  const [datee,setDatee]=useState()
  const [selected, setselected] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [Data,setData]=useState([])
  const getData = async () => {
    let token = getToken();
    
    const res = await axios.get("http://localhost:3000/Notification/getNotifications",
    {headers: {
      Authorization: `Bearer ${token}`,
    }});
    const data = await res.data;
    console.log("notifcations",data)

    //setData(data);
    var row=[]; 
    data.map((val, id) => {
        
      row[id]={notification:val.notification,creationDate:val.creationDate}
      console.log("reoa",row[id])
    })
    setData(row)
    console.log("notifcations",row)
  };
  useEffect(() => {
    getData()
  },
  [])
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      var { token } = user;
      console.log(token);
      return token;
    }
  };
  console.log(selected);
  var date=new Date(Date.now())
  const Datee=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
const [selection,setselection]=useState()
  const encodeFileBase64 = (file,ty) => {
    var reader = new FileReader();
    console.log("\nfile",file)
    console.log("\nty",ty)

      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        
          
          setnotification(Base64)
        
      
      };
    
      reader.onerror = (error) => {
        console.log("error: ", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let token = getToken();
    // alert("Submitted");
    console.log("notififi",notification)
    
    try {
      const res = await axios.post(
        `http://localhost:3000/Notifications/send-to-/`,
        {
          notification:notification,
          title,
          notificationDate:datee
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

  const handleChangeDate = (newValue) => {
    setDatee(newValue);
  };

 

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Box sx={{ minWidth: 120, marginBottom: "15px" ,display:'flex',flexDirection:'row'}}>
      <InputLabel id="demo-simple-select-label">
            Date:   
          </InputLabel>
          <InputLabel id="demo-simple-select-label" style={{marginLeft:10,color:"black"}}>
            {Datee}
          </InputLabel>
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
            value={title}
            label="Notification"
            onChange={(e) => {settitle(e.target.value)
              console.log("title",e.target.value)
              setselection(e.target.value)
            }}
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
      <Box sx={{ minWidth: 120, marginBottom: "15px" ,display:'flex',flexDirection:'row'}}>
      <LocalizationProvider
              color="secondary"
              dateAdapter={AdapterDateFns}
            >
              <DateTimePicker
                color="secondary"
                name="Notification date"
                label="Notification Date"
                value={datee}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
      </Box>
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
         
          <input
              type="file"
              name="synopsisDocument"
              min={1}
              onChange={(e)=>{encodeFileBase64(e.target.files[0],"notification")}}
            />
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
