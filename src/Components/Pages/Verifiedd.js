import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Button} from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Verify = ({ route,navigation }) => {
  

  return (
    
    <Paper
      variant="outlined"
      elevation={7}
      //key={""}
      style={{
        display: "grid",
        placeItems: "center",
        // placeContent: "center",
        marginBottom: "2rem",
      }}
    >
      <div style={{display:'flex',flexDirection:'row'}}>
        <label>Student Verified</label>
        </div>

    </Paper>
  );
};


export default Verify;
