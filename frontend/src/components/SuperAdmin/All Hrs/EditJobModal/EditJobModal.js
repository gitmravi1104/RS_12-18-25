import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, InputLabel  } from '@mui/material';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import apiService from '../../../../apiService';

import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';


const validationSchema = Yup.object().shape({
  jobId: Yup.string().required('Job ID is required'),
  jobTitle: Yup.string()
  .required('Job Title is required'),
  // .matches(/^[A-Za-z\s]*$/, 'Job Title cannot contain numbers'),
  companyName: Yup.string().required('Company Name is required'),
  jobCategory: Yup.string().required('Job Category is required'),
  domains: Yup.array().min(1, 'At least one domain must be selected').required('Domains are required'),
  jobDescription: Yup.string().required('Job Description is required'),
  jobExperience: Yup.string().required('Job Experience is required'),
  jobQualification: Yup.string().required('Job Qualification is required'),
  jobType: Yup.string().required('Job Type is required'),
  salary: Yup.string().required('Salary is required'),
  requiredSkills: Yup.string().required('Required Skills are required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  Location: Yup.string().required('Location is required'),
  applicationUrl: Yup.string().url('Invalid URL').required('Application URL is required'),
  postedOn: Yup.date().required('Posted On date is required'),
  lastDate: Yup.date()
    .required('Last Date is required')
    .min(
      Yup.ref('postedOn'),
      'Last Date cannot be earlier than Posted On date'
    ),});


    const domainOptions = [
      { key: "Android Developer", value: "Android Developer" },
      { key: "Flutter", value: "Flutter" },
      { key: "UiUx", value: "UI/UX"},
	    { key: "SAP", value: "SAP"},
      { key: "Python Full Stack", value: "Python Full Stack" },
      { key: "Java Full Stack", value: "Java Full Stack" },
      { key: "Mern Full Stack", value: "Mern Full Stack" },
      { key: "Testing Tools", value: "Testing Tools" },
      { key: "Scrum Master", value: "Scrum Master" },
      { key: "Business Analyst", value: "Business Analyst" },
      { key: "Data Science", value: "Data Science" },
      { key: "Cyber Security", value: "Cyber Security" },
      { key: "Cloud Data Engineer", value: "Cloud Data Engineer" },
      { key: "Dot Net", value: "Dot Net" },
      { key: "DevOps & Cloud Computing", value: "DevOps & Cloud Computing" },
      { key: "Project Management & Agile", value: "Project Management & Agile" },
      { key: "SalesForce", value: "SalesForce" },
      { key: "Medical Coding", value: "Medical Coding" },
      { key: "Investment Banking", value: "Investment Banking" },
      { key: "Digital Marketing", value: "Digital Marketing" },
      { key: "BI Reporting Tools", value: "BI Reporting Tools" },
      { key: "Microsoft Dynamics", value: "Microsoft Dynamics" },
      { key: "Service Now", value: "Service Now" },
      { key: "GenAI", value: "GenAI" },
    ];

    
    const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;


const EditJobModal = ({ show, handleClose, job, handleSave }) => {
  const [companyNames, setCompanyNames] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  const today = new Date().toISOString().split('T')[0];

    const [hrList, setHrList] = useState([]);
    const [selectedHr, setSelectedHr] = useState({});


  const [initialValues, setInitialValues] = useState({
    jobId: '',
    jobTitle: '',
    postedBy: '',
    companyName: '',
    jobCategory: '',
    status: '',
    domains : [],
    jobDescription: '',
    jobExperience: '',
    jobQualification: '',
    jobType: '',
    salary: '',
    phone: '',
    email: '',
    Location: '',
    applicationUrl: '',
    postedOn: '',
    bond: '',
    lastDate: '',
  });

  useEffect(() => {
    if (job) {
      setInitialValues({
        jobId: job.jobId || '',
        jobTitle: job.jobTitle || '',
        companyName: job.companyName || '',
        jobCategory: job.jobCategory || '',
        status: job.status || '',
        domains: job.domains || '',
        jobDescription: job.jobDescription || '',
        jobExperience: job.jobExperience || '',
        jobQualification: job.jobQualification || '',
        jobType: job.jobType || '',
        salary: job.salary || '',
        requiredSkills: job?.requiredSkills || '',
        phone: job.phone || '',
        email: job.email || '',
        Location: job.Location || '',
        applicationUrl: job.applicationUrl || '',
        postedBy: job.postedBy || '',
        openings: job.openings || '',
        postedOn: job.postedOn ? formatDate(job.postedOn) : '',
        bond: job.bond || '',        
        lastDate: job.lastDate ? formatDate(job.lastDate) : '',
      });
    }
  }, [job]);

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };


    const fetchHrList = async () => {
      try {
        const response = await apiService.get('/api/hr-list');
        setHrList(response.data);
      } catch (error) {
        console.error('Error fetching HR list', error);
      }
    };


  const handleFormSubmit = (values, { setSubmitting }) => {
    const changedValues = {};
    Object.keys(values).forEach(key => {
      if (values[key] !== initialValues[key]) {
        changedValues[key] = values[key];
      }
    });

    const updatedValues = {
      ...changedValues,
      postedOn: changedValues.postedOn ? new Date(changedValues.postedOn).toISOString() : undefined,
      lastDate: changedValues.lastDate ? new Date(changedValues.lastDate).toISOString() : undefined,
    };

    console.log("Submitting values:", updatedValues);
    handleSave({ ...updatedValues, jobId: values.jobId });
    setSubmitting(false);
  };

  const fetchCompanyNames = async () => {
    try {
      const response = await apiService.get('/api/registered-companies');
      setCompanyNames(response.data);
      const details = response.data.reduce((acc, company) => {
        acc[company.companyName] = {
          email: company.email,
          phone: company.mobileNo,
          companyId: company.companyID,
          website: company.website
        };
        return acc;
      }, {});
      setCompanyDetails(details);
    } catch (error) {
      console.error('Error fetching company names', error);
    }
  };


  useEffect(() => {
    fetchCompanyNames();
    fetchHrList();
  }, []);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, handleChange, setFieldValue, touched, errors, isSubmitting }) => (
          <FormikForm>
            <DialogContent dividers>
              <Field type="hidden" name="jobId" />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={values.jobTitle}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Allow only letters (a-z, A-Z) and spaces
                  if (!/[a-zA-Z\s]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                error={touched.jobTitle && Boolean(errors.jobTitle)}
                helperText={touched.jobTitle && errors.jobTitle}
              />


                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={(e) => {
                      const selectedCompany = e.target.value;
                      handleChange(e);  // Call Formik's handleChange
                      if (selectedCompany !== 'Select Company Name' && companyDetails[selectedCompany]) {
                        setFieldValue('email', companyDetails[selectedCompany].email);
                        setFieldValue('phone', companyDetails[selectedCompany].phone);
                        setFieldValue('applicationUrl', companyDetails[selectedCompany].website);
                      } else {
                        setFieldValue('email', '');
                        setFieldValue('phone', '');
                        setFieldValue('applicationUrl', '');
                      }
                    }}
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  >
                    <MenuItem value="">Select Company Name</MenuItem>
                    {companyNames.map(company => (
                      <MenuItem key={company.companyID} value={company.companyName}>
                        {company.companyName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Posted On"
                    name="postedOn"
                    disabled
                    value={values.postedOn}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={touched.postedOn && Boolean(errors.postedOn)}
                    helperText={touched.postedOn && errors.postedOn}
                  />
                </Grid>
                
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Posted By"
                    name="HrId"
                    
                    value={values.postedBy}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={touched.postedBy && Boolean(errors.postedBy)}
                    helperText={touched.postedBy && errors.postedBy}
                  />
                </Grid>
                 */}
                <Grid item xs={12} sm={6}>
                    <InputLabel>
                      Posted By
                    </InputLabel>
                  <select
                    // name={`postedBy_${job.jobId}`}
                    className="form-control"
                    value={selectedHr[job.jobId] || job.postedBy}
                    onChange={(e) => {
                      const hrId = e.target.value;

                      // Formik update
                      setFieldValue(`postedBy`, hrId);

                      // Your local state update
                      setSelectedHr((prev) => ({
                        ...prev,
                        [job.jobId]: hrId,
                      }));
                    }}
                  >
                    <option value="">Select HR ID</option>
                    {hrList.map((hr) => (
                      <option key={hr.HRid} value={hr.HRid}>
                        {hr.HRid} - {hr.fullName}
                      </option>
                    ))}
                  </select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Current Status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    error={touched.status && Boolean(errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="jd-received">JD Received</MenuItem>
                    <MenuItem value="profiles-sent">Profiles sent</MenuItem>
                    <MenuItem value="drive-scheduled">Drive Scheduled</MenuItem>
                    <MenuItem value="drive-done">Drive Done</MenuItem>
                    <MenuItem value="offer-received">Offer Revieved</MenuItem>
                    <MenuItem value="not-interested">Not Interested</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Job Type"
                    name="jobType"
                    value={values.jobType}
                    onChange={handleChange}
                    error={touched.jobType && Boolean(errors.jobType)}
                    helperText={touched.jobType && errors.jobType}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    <MenuItem value="Part Time">Part Time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Job Category"
                    name="jobCategory"
                    value={values.jobCategory}
                    onChange={handleChange}
                    error={touched.jobCategory && Boolean(errors.jobCategory)}
                    helperText={touched.jobCategory && errors.jobCategory}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Non-Technical">Non-Technical</MenuItem>
                  </TextField>
                </Grid>
                  
                
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={domainOptions}
                    getOptionLabel={(option) => option.value}
                    disableCloseOnSelect
                    value={domainOptions.filter(option => values.domains.includes(option.key))}
                    onChange={(event, newValue) => {
                      const selectedKeys = newValue.map((option) => option.key);
                      setFieldValue("domains", selectedKeys);
                    }}
                    isOptionEqualToValue={(option, value) => option.key === value.key}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.value}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Domains"
                        placeholder="Select Domains"
                        error={touched.domains && !!errors.domains}
                        helperText={touched.domains && errors.domains}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="Location"
                    value={values.Location}
                    onChange={handleChange}
                    error={touched.Location && Boolean(errors.Location)}
                    helperText={touched.Location && errors.Location}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Job Experience"
                    name="jobExperience"
                    value={values.jobExperience}
                    onChange={handleChange}
                    error={touched.jobExperience && Boolean(errors.jobExperience)}
                    helperText={touched.jobExperience && errors.jobExperience}
                  >
                      <MenuItem value="">Select</MenuItem>
                    <MenuItem value="fresher">Fresher</MenuItem>
                    <MenuItem value="1-6">1-6 months</MenuItem>
                    <MenuItem value="1+">1 year +</MenuItem>
                    <MenuItem value="3-5">3 years - 5 years</MenuItem>
                    <MenuItem value="5+">5+ years</MenuItem>
                    
                  </TextField>
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Required Skills"
                    name="requiredSkills"
                    value={values.requiredSkills}
                    onChange={handleChange}
                    error={touched.requiredSkills && Boolean(errors.requiredSkills)}
                    helperText={touched.requiredSkills && errors.requiredSkills}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Qualification"
                    name="jobQualification"
                    value={values.jobQualification}
                    onChange={handleChange}
                    error={touched.jobQualification && Boolean(errors.jobQualification)}
                    helperText={touched.jobQualification && errors.jobQualification}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>



                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Last Date"
                    name="lastDate"
                    min={today}
                    value={values.lastDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: values.postedOn, // This will disable dates before the `postedOn` date
                    }}                    error={touched.lastDate && Boolean(errors.lastDate)}
                    helperText={touched.lastDate && errors.lastDate}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary Range"
                    name="salary"
                    value={values.salary}
                    onChange={handleChange}
                    error={touched.salary && Boolean(errors.salary)}
                    helperText={touched.salary && errors.salary}
                  />
                </Grid>


                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Application URL"
                    name="applicationUrl"
                    value={values.applicationUrl}
                    onChange={handleChange}
                    error={touched.applicationUrl && Boolean(errors.applicationUrl)}
                    helperText={touched.applicationUrl && errors.applicationUrl}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Job Description"
                    name="jobDescription"
                    value={values.jobDescription}
                    onChange={handleChange}
                    error={touched.jobDescription && Boolean(errors.jobDescription)}
                    helperText={touched.jobDescription && errors.jobDescription}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    inputProps={{ min: 1 }}
                    label="Number of Openings"
                    name="openings"
                    
                    value={values.openings}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={touched.openings && Boolean(errors.openings)}
                    helperText={touched.openings && errors.openings}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Bond"
                    name="bond"
                    value={values.bond}
                    onChange={handleChange}
                    error={touched.bond && Boolean(errors.bond)}
                    helperText={touched.bond && errors.bond}
                  >
                    <MenuItem value="">Select Bond Years</MenuItem>
                    <MenuItem value="No">No Bond</MenuItem>
                    <MenuItem value="1 year">1 Year</MenuItem>
                    <MenuItem value="2 years">2 years</MenuItem>
                    <MenuItem value="3 years">3 years</MenuItem>
                  </TextField>
                </Grid>



              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>Save</Button>
            </DialogActions>
          </FormikForm>
        )}
      </Formik>
    </Dialog>
  );
};

export default EditJobModal;



// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material';
// import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import apiService from '../../../../apiService';
// import { Domain } from '@mui/icons-material';
// import Autocomplete from '@mui/material/Autocomplete';
// import Checkbox from '@mui/material/Checkbox';
// import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';


// const validationSchema = Yup.object().shape({
//   jobId: Yup.string().required('Job ID is required'),
//   jobTitle: Yup.string()
//   .required('Job Title is required')
//   .matches(/^[A-Za-z\s]*$/, 'Job Title cannot contain numbers'),
//   companyName: Yup.string().required('Company Name is required'),
//   jobCategory: Yup.string().required('Job Category is required'),
//   domains: Yup.array().min(1, 'At least one domain must be selected').required('Domains are required'),
//   jobDescription: Yup.string().required('Job Description is required'),
//   jobExperience: Yup.string().required('Job Experience is required'),
//   jobQualification: Yup.string().required('Job Qualification is required'),
//   jobType: Yup.string().required('Job Type is required'),
//   salary: Yup.string().required('Salary is required'),
//   requiredSkills: Yup.string().required('Required Skills are required'),
//   phone: Yup.string().required('Phone is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   Location: Yup.string().required('Location is required'),
//   applicationUrl: Yup.string().url('Invalid URL').required('Application URL is required'),
//   postedOn: Yup.date().required('Posted On date is required'),
//   lastDate: Yup.date()
//     .required('Last Date is required')
//     .min(
//       Yup.ref('postedOn'),
//       'Last Date cannot be earlier than Posted On date'
//     ),});


    // const domainOptions = [
    //   { key: "Android Developer", value: "Android Developer" },
    //   { key: "Flutter", value: "Flutter" },
    //   { key: "UiUx", value: "UI/UX"},
	  //   { key: "SAP", value: "SAP"},
    //   { key: "Python Full Stack", value: "Python Full Stack" },
    //   { key: "Java Full Stack", value: "Java Full Stack" },
    //   { key: "Mern Full Stack", value: "Mern Full Stack" },
    //   { key: "Testing Tools", value: "Testing Tools" },
    //   { key: "Scrum Master", value: "Scrum Master" },
    //   { key: "Business Analyst", value: "Business Analyst" },
    //   { key: "Data Science", value: "Data Science" },
    //   { key: "Cyber Security", value: "Cyber Security" },
    //   { key: "Cloud Data Engineer", value: "Cloud Data Engineer" },
    //   { key: "Dot Net", value: "Dot Net" },
    //   { key: "DevOps & Cloud Computing", value: "DevOps & Cloud Computing" },
    //   { key: "Project Management & Agile", value: "Project Management & Agile" },
    //   { key: "SalesForce", value: "SalesForce" },
    //   { key: "Medical Coding", value: "Medical Coding" },
    //   { key: "Investment Banking", value: "Investment Banking" },
    //   { key: "Digital Marketing", value: "Digital Marketing" },
    //   { key: "BI Reporting Tools", value: "BI Reporting Tools" },
    //   { key: "Microsoft Dynamics", value: "Microsoft Dynamics" },
    //   { key: "Service Now", value: "Service Now" },
    //   { key: "GenAI", value: "GenAI" },
    // ];


    
//     const icon = <CheckBoxOutlineBlank fontSize="small" />;
// const checkedIcon = <CheckBox fontSize="small" />;


// const EditJobModal = ({ show, handleClose, job, handleSave }) => {
//   const [companyNames, setCompanyNames] = useState([]);
//   const [companyDetails, setCompanyDetails] = useState({});
//   const today = new Date().toISOString().split('T')[0];
//   const [initialValues, setInitialValues] = useState({
//     jobId: '',
//     jobTitle: '',
//     companyName: '',
//     jobCategory: '',
//     domains : [],
//     jobDescription: '',
//     jobExperience: '',
//     jobQualification: '',
//     jobType: '',
//     salary: '',
//     phone: '',
//     email: '',
//     Location: '',
//     applicationUrl: '',
//     postedOn: '',
//     lastDate: '',
//   });

//   useEffect(() => {
//     if (job) {
//       setInitialValues({
//         jobId: job.jobId || '',
//         jobTitle: job.jobTitle || '',
//         companyName: job.companyName || '',
//         jobCategory: job.jobCategory || '',
//         domains: job.domains || '',
//         jobDescription: job.jobDescription || '',
//         jobExperience: job.jobExperience || '',
//         jobQualification: job.jobQualification || '',
//         jobType: job.jobType || '',
//         salary: job.salary || '',
//         requiredSkills: job?.requiredSkills || '',
//         phone: job.phone || '',
//         email: job.email || '',
//         Location: job.Location || '',
//         applicationUrl: job.applicationUrl || '',
//         postedOn: job.postedOn ? formatDate(job.postedOn) : '',
//         lastDate: job.lastDate ? formatDate(job.lastDate) : '',
//       });
//     }
//   }, [job]);

//   const formatDate = (date) => {
//     return new Date(date).toISOString().split('T')[0];
//   };

//   const handleFormSubmit = (values, { setSubmitting }) => {
//     const changedValues = {};
//     Object.keys(values).forEach(key => {
//       if (values[key] !== initialValues[key]) {
//         changedValues[key] = values[key];
//       }
//     });

//     const updatedValues = {
//       ...changedValues,
//       postedOn: changedValues.postedOn ? new Date(changedValues.postedOn).toISOString() : undefined,
//       lastDate: changedValues.lastDate ? new Date(changedValues.lastDate).toISOString() : undefined,
//     };

//     console.log("Submitting values:", updatedValues);
//     handleSave({ ...updatedValues, jobId: values.jobId });
//     setSubmitting(false);
//   };

//   const fetchCompanyNames = async () => {
//     try {
//       const response = await apiService.get('/api/registered-companies');
//       setCompanyNames(response.data);
//       const details = response.data.reduce((acc, company) => {
//         acc[company.companyName] = {
//           email: company.email,
//           phone: company.mobileNo,
//           companyId: company.companyID,
//           website: company.website
//         };
//         return acc;
//       }, {});
//       setCompanyDetails(details);
//     } catch (error) {
//       console.error('Error fetching company names', error);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyNames();
//   }, []);

//   return (
//     <Dialog open={show} onClose={handleClose} maxWidth="lg" fullWidth>
//       <DialogTitle>Edit Job</DialogTitle>
//       <Formik
//         enableReinitialize
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleFormSubmit}
//       >
//         {({ values, handleChange, setFieldValue, touched, errors, isSubmitting }) => (
//           <FormikForm>
//             <DialogContent dividers>
//               <Field type="hidden" name="jobId" />

//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                 <TextField
//   fullWidth
//   label="Job Title"
//   name="jobTitle"
//   value={values.jobTitle}
//   onChange={handleChange}
//   onKeyPress={(e) => {
//     // Allow only letters (a-z, A-Z) and spaces
//     if (!/[a-zA-Z\s]/.test(e.key)) {
//       e.preventDefault();
//     }
//   }}
//   error={touched.jobTitle && Boolean(errors.jobTitle)}
//   helperText={touched.jobTitle && errors.jobTitle}
// />


//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Company Name"
//                     name="companyName"
//                     value={values.companyName}
//                     onChange={(e) => {
//                       const selectedCompany = e.target.value;
//                       handleChange(e);  // Call Formik's handleChange
//                       if (selectedCompany !== 'Select Company Name' && companyDetails[selectedCompany]) {
//                         setFieldValue('email', companyDetails[selectedCompany].email);
//                         setFieldValue('phone', companyDetails[selectedCompany].phone);
//                         setFieldValue('applicationUrl', companyDetails[selectedCompany].website);
//                       } else {
//                         setFieldValue('email', '');
//                         setFieldValue('phone', '');
//                         setFieldValue('applicationUrl', '');
//                       }
//                     }}
//                     error={touched.companyName && Boolean(errors.companyName)}
//                     helperText={touched.companyName && errors.companyName}
//                   >
//                     <MenuItem value="">Select Company Name</MenuItem>
//                     {companyNames.map(company => (
//                       <MenuItem key={company.companyID} value={company.companyName}>
//                         {company.companyName}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Job Type"
//                     name="jobType"
//                     value={values.jobType}
//                     onChange={handleChange}
//                     error={touched.jobType && Boolean(errors.jobType)}
//                     helperText={touched.jobType && errors.jobType}
//                   >
//                     <MenuItem value="">Select Type</MenuItem>
//                     <MenuItem value="Full Time">Full Time</MenuItem>
//                     <MenuItem value="Part Time">Part Time</MenuItem>
//                     <MenuItem value="Contract">Contract</MenuItem>
//                     <MenuItem value="Internship">Internship</MenuItem>
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Job Category"
//                     name="jobCategory"
//                     value={values.jobCategory}
//                     onChange={handleChange}
//                     error={touched.jobCategory && Boolean(errors.jobCategory)}
//                     helperText={touched.jobCategory && errors.jobCategory}
//                   >
//                     <MenuItem value="">Select Category</MenuItem>
//                     <MenuItem value="Technical">Technical</MenuItem>
//                     <MenuItem value="Non-Technical">Non-Technical</MenuItem>
//                   </TextField>
//                 </Grid>
                  
                
//                 <Grid item xs={12} sm={6}>
//   <Autocomplete
//     multiple
//     options={domainOptions}
//     getOptionLabel={(option) => option.value}
//     disableCloseOnSelect
//     value={domainOptions.filter(option => values.domains.includes(option.key))}
//     onChange={(event, newValue) => {
//       const selectedKeys = newValue.map((option) => option.key);
//       setFieldValue("domains", selectedKeys);
//     }}
//     isOptionEqualToValue={(option, value) => option.key === value.key}
//     renderOption={(props, option, { selected }) => (
//       <li {...props}>
//         <Checkbox
//           icon={icon}
//           checkedIcon={checkedIcon}
//           style={{ marginRight: 8 }}
//           checked={selected}
//         />
//         {option.value}
//       </li>
//     )}
//     renderInput={(params) => (
//       <TextField
//         {...params}
//         label="Domains"
//         placeholder="Select Domains"
//         error={touched.domains && !!errors.domains}
//         helperText={touched.domains && errors.domains}
//       />
//     )}
//   />
// </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="City"
//                     name="Location"
//                     value={values.Location}
//                     onChange={handleChange}
//                     error={touched.Location && Boolean(errors.Location)}
//                     helperText={touched.Location && errors.Location}
//                   />
//                 </Grid>


//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Job Experience"
//                     name="jobExperience"
//                     value={values.jobExperience}
//                     onChange={handleChange}
//                     error={touched.jobExperience && Boolean(errors.jobExperience)}
//                     helperText={touched.jobExperience && errors.jobExperience}
//                   >
//                     <MenuItem value="">Select Type</MenuItem>
//                     <MenuItem value="0-1">0-1</MenuItem>
//                     <MenuItem value="1-3">1-3</MenuItem>
//                     <MenuItem value="3-5">3-5</MenuItem>
//                     <MenuItem value="5+">5+</MenuItem>
//                   </TextField>
//                 </Grid>


//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Required Skills"
//                     name="requiredSkills"
//                     value={values.requiredSkills}
//                     onChange={handleChange}
//                     error={touched.requiredSkills && Boolean(errors.requiredSkills)}
//                     helperText={touched.requiredSkills && errors.requiredSkills}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Job Qualification"
//                     name="jobQualification"
//                     value={values.jobQualification}
//                     onChange={handleChange}
//                     error={touched.jobQualification && Boolean(errors.jobQualification)}
//                     helperText={touched.jobQualification && errors.jobQualification}
//                   />
//                 </Grid>


//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     name="email"
//                     value={values.email}
//                     onChange={handleChange}
//                     error={touched.email && Boolean(errors.email)}
//                     helperText={touched.email && errors.email}
//                   />
//                 </Grid>



//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Phone"
//                     name="phone"
//                     value={values.phone}
//                     onChange={handleChange}
//                     error={touched.phone && Boolean(errors.phone)}
//                     helperText={touched.phone && errors.phone}
//                   />
//                 </Grid>


//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     type="date"
//                     label="Last Date"
//                     name="lastDate"
//                     min={today}
//                     value={values.lastDate}
//                     onChange={handleChange}
//                     InputLabelProps={{ shrink: true }}
//                     inputProps={{
//                       min: values.postedOn, // This will disable dates before the `postedOn` date
//                     }}                    error={touched.lastDate && Boolean(errors.lastDate)}
//                     helperText={touched.lastDate && errors.lastDate}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Salary Range"
//                     name="salary"
//                     value={values.salary}
//                     onChange={handleChange}
//                     error={touched.salary && Boolean(errors.salary)}
//                     helperText={touched.salary && errors.salary}
//                   />
//                 </Grid>


//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Application URL"
//                     name="applicationUrl"
//                     value={values.applicationUrl}
//                     onChange={handleChange}
//                     error={touched.applicationUrl && Boolean(errors.applicationUrl)}
//                     helperText={touched.applicationUrl && errors.applicationUrl}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     multiline
//                     minRows={4}
//                     label="Job Description"
//                     name="jobDescription"
//                     value={values.jobDescription}
//                     onChange={handleChange}
//                     error={touched.jobDescription && Boolean(errors.jobDescription)}
//                     helperText={touched.jobDescription && errors.jobDescription}
//                   />
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     type="date"
//                     label="Posted On"
//                     name="postedOn"
//                     disabled
//                     value={values.postedOn}
//                     onChange={handleChange}
//                     InputLabelProps={{ shrink: true }}
//                     error={touched.postedOn && Boolean(errors.postedOn)}
//                     helperText={touched.postedOn && errors.postedOn}
//                   />
//                 </Grid>


//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleClose} color="secondary">Cancel</Button>
//               <Button type="submit" color="primary" disabled={isSubmitting}>Save</Button>
//             </DialogActions>
//           </FormikForm>
//         )}
//       </Formik>
//     </Dialog>
//   );
// };

// export default EditJobModal;
