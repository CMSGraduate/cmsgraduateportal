import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from 'axios'
import { useFormik } from "formik";
import * as yup from "yup";
import { useState,useEffect } from "react";

export default function DialogSelect(props) {
  const [open, setOpen] = React.useState(false);
  	const date=new Date(Date.now())
    const [session,setsession]=useState()
    const [year,setyear]=useState()
    const [programs,setPrograms]=useState()
    
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const validationSchema = yup.object({
    year: yup
      .string()
      .matches(/^[2][2-9]$/, "The year should be between 22-29")
      .required("Year is required"),
    rollNo: yup
      .string()
      .matches(/^[0-9][0-9][0-9]$/, "Roll Number cannot exceed three digits")
      .required("Roll No. is required"),
  });

  const formik = useFormik({
    initialValues: {
      session: session,
      year:year,
      discipline: "",
      rollNo: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values, reason) => {
      console.log("values",values)
      values.session=session
      values.year=year
      console.log("values",values)

      props.onRegNum(values);
      if (reason !== "backdropClick") {
        setOpen(false);
      }
      // console.log(values);
    },
  });
  useEffect(() => {
    
  const month=date.getMonth()+1
    if(month>1 && month<7){
      setsession("SP")
    }else{
      setsession("FA")
    }
    const yearr=date.getFullYear()+""
    console.log("erys",yearr[3])
    setyear(yearr[2]+yearr[3])
    console.log("erys",year)

  },[])
 
  useEffect(async() => {

    

    await axios
      .get(`${process.env.REACT_APP_URL}/programs/getprogram`)
      .then((response) => {
        console.log("testing new get data");
        console.log(response.data.programlist);
        var newarr = response.data.programlist.map((obj) => ({
          ...obj,
          id: obj._id,
        }));
        const a=newarr.map((item)=>{
          if(item.programShortName?.startsWith("MS")){
            var abc=item.programShortName?.split("(")
            var b=abc[1]
            var c=b[0]+b[1]
            return{
              program:"R"+c
            }
          }
          if(item.programShortName?.startsWith("PhD")){
            var abc=item.programShortName?.split("(")
            var b=abc[1]
            var c=b[0]+b[1]
            return{
              program:"P"+c
            }
          }
        })
        console.log("progarsmna",a)

        setPrograms(a);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <Button fullWidth variant="outlined" onClick={handleClickOpen}>
        Enter Registration Number Here
      </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Enter registration Number</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Session</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="session"
                name="session"
                variant="standard"
                defaultValue=""
                label="session"
                value={session}
                onChange={formik.handleChange}
              >
                {/* <MenuItem value="">
                  <em>-</em>
                </MenuItem> */}
                <MenuItem value={session}>{session}</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <TextField
                type="text"
                sx={{ m: 1, maxWidth: 120 }}
                autoComplete="given-name"
                variant="standard"
                placeholder="00"
                id="year"
                name="year"
                label="Year"
                value={year}
                onChange={formik.handleChange}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: 120 }}>
              <InputLabel id="demo-simple-select-label">Discipline</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="discipline"
                name="discipline"
                variant="standard"
                label="Discipline"
                value={formik.values.discipline}
                onChange={formik.handleChange}
              >
                {programs?.map((item)=>(
                <MenuItem value={item.program}>{item.program}</MenuItem>
              ))}
              </Select>
            </FormControl>
            <FormControl>
              <TextField
                sx={{ m: 1, width: 120 }}
                autoComplete="given-name"
                type="text"
                variant="standard"
                placeholder="000"
                id="rollNo"
                label="Roll No."
                name="rollNo"
                value={formik.values.rollNo}
                onChange={formik.handleChange}
                error={formik.touched.rollNo && Boolean(formik.errors.rollNo)}
                helperText={formik.touched.rollNo && formik.errors.rollNo}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit}>Ok</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
