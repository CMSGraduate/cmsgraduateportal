import React,{useEffect, useState} from "react";
import ViewAnnouncement from "./ViewAnnouncement";
import ViewNotification from "./ViewNotification";
import { useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { supervisor } from "../DummyData/facultyData";
import { GPA } from "../DummyData/DummyData";
import { Row , Col,Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import studentService from "../../API/students";
import { useNavigate } from "react-router-dom";


const HomeGo = () => {
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.auth);
  
  

 

  
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome!</h1>
      <p>{`You are logged in as MS Student`}</p>
      <p>{`You are not verified yet`}</p>
      
          
  
     
    </div>
  );
};

export default HomeGo;
