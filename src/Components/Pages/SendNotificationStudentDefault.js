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
  const [notification, setnotification] = useState([]);
  const [title,settitle]=useState("")
  const [selected, setselected] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fileBase64String, setFileBase64String] = useState("");
  const [Decoded, setDecoded] = useState("");
  console.log("\nDecoded",Decoded)
  
    const base64toData = () => {
      const base64WithoutPrefix = fileBase64String.substring(fileBase64String.indexOf(",") + 1)
      // const base64WithoutPrefix = fileBase64String.substr('data:application/pdf;base64,'.length);
  
      const bytes = atob(base64WithoutPrefix)
      console.log("atob",bytes)
      let length = bytes.length;
      let out = new Uint8Array(length);
  
      while (length--) {
          out[length] = bytes.charCodeAt(length);
      }
  
      return new Blob([out], { type: 'application/pdf' });
      // return(ecodeURIComponent(bytes.split("")
      // .map((c)=> {
      //   return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      // })
      // .join("")
      // ))
    };
  console.log(selected);
  var date=new Date(Date.now())
  const Datee=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
  console.log("date",Datee)

  const encodeFileBase64 = (file,ty) => {
    var reader = new FileReader();
    console.log("\nfile",file)
    console.log("\nty",ty)

      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        
          
          setnotification(Base64)
        
      
        setFileBase64String(Base64);
      };
      var a =base64toData()
      const url = URL.createObjectURL(a);
      console.log("\nurl",url)
      const pdf =url.substring(url.indexOf(":") + 1)
      setDecoded(pdf)

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
          title
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
            onChange={(e) => settitle(e.target.value)}
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
