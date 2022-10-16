import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { FormLabel, Radio, RadioGroup } from "@mui/material";
import { useFormik } from "formik";
import authSlice, { Signup } from "../../Store/authSlice";
import axios from "axios";

import * as yup from "yup";
import programsService from "../../API/programs";
import sessionsService from "../../API/sessions";
import studentService from "../../API/students";
import courseService from "../../API/course";
import adminService from "../../API/admin";
import { Autocomplete } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import BackdropModal from "../UI/BackdropModal";
import { ContactSupportOutlined } from "@material-ui/icons";

export default function AddStudent() {
  const { success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [users,setusers]=useState()
  const [studentType, setStudentType] = useState("MS");
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [faculty,setfaculty]=useState()
  const [cours,setCourse]=useState([]);
  const [coursphd,setCoursephd]=useState([]);
  const [gettoken, settoken] = useState("");

  const [error,seterror]=useState("");
  const msdValidationSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    credits: yup.string().required(),
    level: yup.string().required(),
  });
  const phdValidationSchema = yup.object({
    name: yup.string().required(),
    type: yup.string().required(),
    credits: yup.string().required(),
    level: yup.string().required(),
  });

  const [selectedSchema, setSelectedSchema] = useState(msdValidationSchema);


  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      credits: "",
      level: "",
    },
    enableReinitialize: true,
    validationSchema: selectedSchema,
    onSubmit: (values,{resetForm}) => {
      if((values.level=="MS" && cours.find(element=>(element.name.toLowerCase())==values.name.toLowerCase())) || (values.level=="PHD" && coursphd.find(element=>element.name.toLowerCase()==values.name.toLowerCase()))){
        seterror("Course already exists")
      }
      else{
        
        var a={...values,Faculty:faculty}
        console.log("data",a)
        adminService.AddCourses(a)
        setShowAddModal(true)
        resetForm({values:''})
        seterror("")
      }
      
    },
  });
 
  useEffect(() => {
    async function getData() {
      const user = JSON.parse(localStorage.getItem("user"));

      var { token } = user;
      settoken(token);
      axios
      .get(`${process.env.REACT_APP_URL}/admin/faculty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("testing new get data");
        console.log(response.data.facultylist);
        var arr=[]
        var newarr = response.data.facultylist.map((obj,index) => (
         arr[index]=obj.fullName
        ));
        console.log(arr);
        setusers(arr);
        
      })
      .catch((err) => console.log(err));
      const prog = await programsService.getPrograms();
      const sess = await sessionsService.getSessions();
      let data = await studentService.getSupervisors();
      const cours = await courseService.getMSCourses();
      const coursphd = await courseService.getPHDCourses();
      setCourse(cours.data.courses);
      setCoursephd(coursphd.data.courses);
      setSupervisors(data.supervisors);
      setSessions(sess);
      setPrograms(prog);


     
    }
    getData();
  }, [showAddModal]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <FormControl sx={{ mb: 1 }}>
        <FormLabel color="secondary">Student</FormLabel>
        <RadioGroup
          row
          name="level"
          value={formik.values.level}
          onChange={formik.handleChange}
          error={
            formik.touched.level && Boolean(formik.errors.level)
          }
          helperText={
            formik.touched.level && formik.errors.level
          }

        >
          <FormControlLabel
            value="MS"
            control={<Radio color="secondary" />}
            label="MS"
          />
          <FormControlLabel
            value="PHD"
            control={<Radio color="secondary" />}
            label="PhD"
          />
        </RadioGroup>
      </FormControl>
      <p style={{fontWeight:'bold',color:"maroon"}}>
        {error}
      </p>
      <TextField
        id="standard-basic"
        sx={{
          width: "100%",
          marginBottom: "15px",
        }}
        label="Course Name"
        color="secondary"
        variant="outlined"
        name="name"
        value={formik.values.name}
        onChange={
          formik.handleChange
        }
        error={
          formik.touched.name && Boolean(formik.errors.name)
        }
        helperText={
          formik.touched.name && formik.errors.name
        }
        
      />
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={
              formik.touched.type && Boolean(formik.errors.type)
            }
            helperText={
              formik.touched.type && formik.errors.type
            }
          >
            
              <MenuItem value={"Core"}>
                Core
              </MenuItem>
              <MenuItem value={"Minor"}>
                Minor
              </MenuItem><MenuItem value={"RM"}>
                RM
              </MenuItem>
          </Select>
        </FormControl>
      </Box> 
      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">Credit Hours</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Credit Hours"
            name="credits"
            value={formik.values.credits}
            onChange={formik.handleChange}
            error={
              formik.touched.credits && Boolean(formik.errors.credits)
            }
            helperText={
              formik.touched.credits && formik.errors.credits
            }
          >
            
              <MenuItem value={"2"}>
                2
              </MenuItem>
              <MenuItem value={"3"}>
                3
              </MenuItem>
              <MenuItem value={"4"}>
                4
              </MenuItem>
          </Select>
        </FormControl>
      </Box> 
      <Autocomplete
                  className="mt-4"
                  //multiple
                  id="multiple-limit-tags"
                  options={users}
                  getOptionLabel={(option) => option}
                  onChange={(value,newValue) => {
                    console.log("sad",newValue)
                    setfaculty(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Faculty Members"
                      placeholder="Faculty Members"
                      size="small"
                    />
                  )}
                  />
                    
      <Button type="submit" variant="contained" size="large" color="secondary">
        Add Course
      </Button>
      <BackdropModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        title={"Add!"}
      >
        Course has been Added.
      </BackdropModal>
    </Box>
  );
}
