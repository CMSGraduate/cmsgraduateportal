import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import studentService from "../../API/students";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import programsService from "../../API/programs";
import BackdropModal from "../UI/BackdropModal";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const [supervisors, setSupervisors] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [validationSchema, setValidationSchema] = useState(null);
  const [Name,setName]=useState(user.user.student.username)
  const [FatherName,setFather]=useState(user.user.student.fatherName)
  const [mobile,setmobile]=useState(user.user.student.mobile)
  const [program,setprogram]=useState(user.user.student.program_id);
  const [thesisReg,setthesisreg]=useState(user.user.student.thesisRegistration)
  const [thesisTrack,setThesisTrack]=useState(user.user.student.thesisTrack)
  const [totpub,setpub]=useState(user.user.student?.totalPublications)
  const [imfacpub,setimfacpub]=useState(user.user.student?.impactFactorPublications)
  const [pic,setpic]=useState(user.user.student?.profilePicture)
  const userProgram = user.user.student.program_id.programShortName;
  console.log("hello",user.user.student.profilePicture)
  const msdValidationSchema = yup.object({
    name: yup.string().required(),
    registrationNo: yup.string().required(),
    fatherName: yup.string().required(),
    email: yup.string().required(),
    mobile: yup.number().required(),
    program: yup.string().required(),
    thesisTrack: yup.string().required(),
    thesisRegistration: yup.string().required(),
  });
  const phdValidationSchema = yup.object({
    name: yup.string().required(),
    registrationNo: yup.string().required(),
    fatherName: yup.string().required(),
    email: yup.string().required(),
    mobile: yup.number().required(),
    program: yup.string().required(),
    thesisTrack: yup.string().required(),
    thesisRegistration: yup.string().required(),
    totalPublications: yup.number().required(),
    impactFactorPublications: yup.number().required(),
  });

  const formik = useFormik({
    initialValues: {
      name: Name,
      fatherName: FatherName,
      password: "dummy",
      mobile: mobile,
      program: program?._id,
      thesisTrack: thesisTrack,
      thesisRegistration: thesisReg,
      totalPublications: totpub,
      impactFactorPublications: imfacpub,
      profilePic: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {},
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = new FormData();

    formData.append("name", formik.values.name);
    formData.append("fatherName", formik.values.fatherName);
    formData.append("mobile", formik.values.mobile);

    // formData.append("synopsisTitle", formik.values.synopsisTitle);
    formData.append("program", formik.values?.program);
    formData.append("thesisRegistration", formik.values.thesisRegistration);
    formData.append("thesisTrack", formik.values.thesisTrack);
    
    if(formik.values.profilePic.length==0){
      formData.append("profilePic", pic);

    }
    else{
    formData.append("profilePic", formik.values.profilePic[0]);}

    if (userProgram.toLowerCase().includes("phd")) {
      formData.append("totalPublications", formik.values.totalPublications);
      formData.append(
        "impactFactorPublications",
        formik.values.impactFactorPublications
      );
    }

    /*   for (var value of formData.values()) {
      console.log(value);
    } */
    let res = await studentService.updateProfile(formData);
    if (res?.afterUpdate) {
      setShowUpdateModal(true);
      console.log(res);
    } else {
      setShowErrorModal(true);
      console.log(res);
    }
  };

  const getSupervisors = async () => {
    let data = await studentService.getSupervisors();

    console.table("SubmissionM", data?.supervisors);
    setSupervisors(data?.supervisors);
  };

  const getPrograms = async () => {
    let data = await programsService.getPrograms();
    setPrograms(data);
  };

  useEffect(() => {
    if (userProgram.toLowerCase().includes("ms")) {
      setValidationSchema(msdValidationSchema);
    } else {
      setValidationSchema(phdValidationSchema);
    }
    getPrograms();
    getSupervisors();
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Name"
        name="name"
        color="secondary"
        variant="outlined"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Father's Name"
        name="fatherName"
        color="secondary"
        variant="outlined"
        value={formik.values.fatherName}
        onChange={formik.handleChange}
        error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
        helperText={formik.touched.fatherName && formik.errors.fatherName}
      />

      <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Mobile"
        name="mobile"
        color="secondary"
        variant="outlined"
        value={formik.values.mobile}
        onChange={formik.handleChange}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile}
      />
     
        
      {/* <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Synopsis Title"
        color="secondary"
        name="synopsisTitle"
        variant="outlined"
        value={formik.values.synopsisTitle}
        onChange={formik.handleChange}
        error={
          formik.touched.synopsisTitle && Boolean(formik.errors.synopsisTitle)
        }
        helperText={formik.touched.synopsisTitle && formik.errors.synopsisTitle}
      /> */}

      <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">Program</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="program"
            label="Program"
            value={formik.values.program}
            onChange={formik.handleChange}
            error={formik.touched.program && Boolean(formik.errors.program)}
            helperText={formik.touched.program && formik.errors.program}
          >
            {programs.map((item) => {
              return (
                <MenuItem key={item._id} value={item._id}>
                  {item.programShortName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Thesis Registration"
        color="secondary"
        name="thesisRegistration"
        variant="outlined"
        value={formik.values.thesisRegistration}
        onChange={formik.handleChange}
        error={
          formik.touched.thesisRegistration &&
          Boolean(formik.errors.thesisRegistration)
        }
        helperText={
          formik.touched.thesisRegistration && formik.errors.thesisRegistration
        }
      />

      <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Thesis Track"
        name="thesisTrack"
        color="secondary"
        variant="outlined"
        value={formik.values.thesisTrack}
        onChange={formik.handleChange}
        error={formik.touched.thesisTrack && Boolean(formik.errors.thesisTrack)}
        helperText={formik.touched.thesisTrack && formik.errors.thesisTrack}
      />

      {/* <TextField
        id="standard-basic"
        sx={{ width: "100%", marginBottom: "15px" }}
        label="Area of Specialization"
        name="specialization"
        color="secondary"
        variant="outlined"
        value={formik.values.specialization}
        onChange={formik.handleChange}
      /> */}

      {/* <Box sx={{ minWidth: 120, marginBottom: "15px" }}>
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">
            Comprehensive Passing Semester
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="passingSemester"
            label="Comprehensive Passing Semester"
            value={formik.values.passingSemester}
            onChange={formik.handleChange}
          >
            <MenuItem value="" disabled>
              N/A
            </MenuItem>
            <MenuItem value="SP11">SP11</MenuItem>
            <MenuItem value="FA11">FA11</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      {userProgram.toLowerCase().includes("phd") && (
        <>
          <TextField
            sx={{ width: "100%", marginBottom: "15px" }}
            label="Total Publication (during PhD)"
            color="secondary"
            name="totalPublications"
            variant="outlined"
            value={formik.values.totalPublications}
            onChange={formik.handleChange}
            error={
              formik.touched.totalPublications &&
              Boolean(formik.errors.totalPublications)
            }
            helperText={
              formik.touched.totalPublications &&
              formik.errors.totalPublications
            }
          />
          <TextField
            sx={{ width: "100%", marginBottom: "15px" }}
            label="Impact Factor Publications (after synopsis approval)"
            name="impactFactorPublications"
            color="secondary"
            variant="outlined"
            value={formik.values.impactFactorPublications}
            onChange={formik.handleChange}
            error={
              formik.touched.impactFactorPublications &&
              Boolean(formik.errors.impactFactorPublications)
            }
            helperText={
              formik.touched.impactFactorPublications &&
              formik.errors.impactFactorPublications
            }
          />
        </>
      )}
      <label style={{ display: "flex", flexDirection: "column" }}>
        <div>Edit Profile Picture:</div>

        <input
          style={{ margin: ".5rem" }}
          type="file"
          min={1}
          name="profilePic"
          onChange={(e) => {
            formik.setFieldValue("profilePic", e.target.files);
          }}
        />
        {}
      </label>

      <Button type="submit" variant="contained" size="large" color="secondary">
        Update Profile
      </Button>

      <BackdropModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        title={"Update!"}
      >
        The Profile has been Updated.
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
