import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Button} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import {
    Card,
    CardMedia,
    
  } from "@mui/material";
const Template = ({ report }) => {
  const navigate=useNavigate();
  const {state}=useLocation()
 console.log("report",state.report)
  const { currentRole } = useSelector((state) => state.userRoles);
  const [open,setOpen]=useState(false)
  const toggle = () => {
    setOpen(!open);
  };
  
  return (
    <Paper
      variant="outlined"
      elevation={3}
      style={{
        placeItems: "center",
        // placeContent: "center",
        marginBottom: "2rem",
      }}
    >
    {state.report==undefined?
    <div>No Submission Yet</div>
    
    :
    <Card sx={{ maxWidth: "100%", marginTop: 0 }}>
                      <h2
                        className="my-4 py-4"
                        style={{ textTransform: "uppercase" , marginLeft:"33%",
                    }}
                      >
                         Submitted Document
                      </h2>
                      <CardMedia
                        className="cardmedia"
                        component="iframe"
                        Height="1056px"
                        src={state?.report}
                      />
                    </Card>
}
    </Paper>
  );
};

export default Template;
