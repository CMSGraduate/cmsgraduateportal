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
import { setDayOfYear } from "date-fns";

export default function DialogSelect(props) {
  const [open, setOpen] = React.useState(false);
  	const date=new Date(Date.now())
    const [session,setsession]=useState()
    const [programs,setPrograms]=useState()
    const yearr = ((new Date()).getFullYear());
    const [getyear,setyear]=useState()
    const [filyear,setfilyear]=useState([])
   const years = Array.from(new Array(20),( val, index) => index + yearr);
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
      //.matches(/^[2][2-9]$/, "The year should be between 22-29")
      .required("Year is required"),
    rollNo: yup
      .string()
      .matches(/^[0-9][0-9][0-9]$/, "Roll Number cannot exceed three digits")
      .required("Roll No. is required"),
    discipline:yup
    .string()
    .required("Discipline is required"),
    session:yup
    .string()
    .required("Session is required")
  });

  const formik = useFormik({
    initialValues: {
      session:"",
      year:"",
      discipline: "",
      rollNo: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, reason) => {
      console.log("values",values)
      //values.session=session
      //values.year=year
      console.log("values",values)

      props.onRegNum(values);
      if (reason !== "backdropClick") {
        setOpen(false);
      }
      // console.log(values);
    },
  });

 
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



      await axios
      .get(`${process.env.REACT_APP_URL}/sessions/`)
      .then((response) => {
        
        var newarr = response.data?.map((obj) => ({
          title: obj.title,
        }));
         var array=[]
         newarr.forEach((c) => {
          if (!array.includes(c.title)) {
              array.push(c.title);}
        })
        setyear(array);

      })
      
      .catch((err) => console.log(err));
  }, []);
  useEffect(()=>{
    var row=[]
    console.log("before",getyear)

    row=getyear?.filter((item)=>item[0]+item[1]==formik.values.session[0]+formik.values.session[1])
    setfilyear(row);
    console.log("after",row)
  },[formik.values.session])
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
                value={formik.values.session}
                
                onChange={formik.handleChange}
                error={formik.touched.session && Boolean(formik.errors.session)}
                helperText={formik.touched.session && formik.errors.session}
              >
                {/* <MenuItem value="">
                  <em>-</em>
                </MenuItem> */}
                <MenuItem value={"SP"}>{"SP"}</MenuItem>
                <MenuItem value={"FA"}>{"FA"}</MenuItem>

              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="year"
                name="year"
                variant="standard"
                defaultValue=""
                label="Year"
                value={formik.values.year}
                onChange={formik.handleChange}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
              >
                {/* <MenuItem value="">
                  <em>-</em>
                </MenuItem> */}
                {filyear?.map((item)=>{
                  return(
                <MenuItem value={item[2]+item[3]}>{item[2]+item[3]}</MenuItem>
              )})}
              </Select>
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
                error={formik.touched.discipline && Boolean(formik.errors.discipline)}
                helperText={formik.touched.discipline && formik.errors.discipline}
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
