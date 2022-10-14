import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button, Box } from "@mui/material";
import sessionsService from "../../API/sessions";
import BackdropModal from "../UI/BackdropModal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

import * as yup from "yup";
import { useFormik } from "formik";
export default function AddSession() {
  const [showAddModal, setShowAddModal] = useState(false);
  const yearr = (new Date()).getFullYear();
  const years = Array.from(new Array(10),(val, index) => index + yearr);
  const validationSchema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    status: yup.boolean().required(),
    year:yup.string().required()
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: false,
      year:""
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values",values)
      values.title=values.title+values.year
      console.log("values",values)

      const res = await sessionsService.addSession(values);

      if (res.status === 200) {
        setShowAddModal(true);
      }

      console.log("response", res);
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ mt: 1 }}
    >
      <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">Title</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
          >
            
              <MenuItem value={"SP"}>
                SP
              </MenuItem>
              <MenuItem value={"FA"}>
                FA
              </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth color="secondary" style={{marginTop:15 }}>
          <InputLabel id="demo-simple-select-label" >Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Year"
            name="year"
            value={formik.values.year}
            onChange={formik.handleChange}
            error={formik.touched.year && Boolean(formik.errors.year)}
        helperText={formik.touched.year && formik.errors.year}
          >
            
            {years?.map((i)=>{
              var item=i+""
              return(              
              <MenuItem value={item[2]+item[3]}>
                {item}
              </MenuItem>
              )
})}
          </Select>
        </FormControl>

      <TextField
        id="desc"
        sx={{ width: "100%", marginBottom: "15px",marginTop:3 }}
        label="Description"
        name="description"
        color="secondary"
        variant="outlined"
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
      />

      <FormGroup sx={{ marginBottom: "15px" }}>
        <FormControlLabel
          name="status"
          checked={formik.values.status}
          control={<Checkbox color="secondary" />}
          label="Status"
          onChange={formik.handleChange}
        />
      </FormGroup>

      <Button type="submit" variant="contained" size="large" color="secondary">
        Add Session
      </Button>
      <BackdropModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        title={"Add!"}
      >
        The Session has been Added.
      </BackdropModal>
    </Box>
  );
}
