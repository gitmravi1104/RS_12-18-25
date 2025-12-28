// // StudentDetails.js
// import React, { useEffect, useState } from 'react';
// import { Container, Col, Table, Alert } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// import { FaFilePdf } from 'react-icons/fa';
// import Cookies from 'js-cookie'
// import apiService from '../../../../apiService';

// const StudentDetails = ({ candidateID }) => {

//   const [studentData, setStudentData] = useState(null);
//   const [appliedJobs, setAppliedJobs] = useState([]);
//   const [errorMsg, setErrorMsg] = useState('');

//   useEffect(() => {
//     fetchStudentData();
//     fetchAppliedJobs();
//   }, [candidateID]);

//   const HrId = Cookies.get('HRid')
//   const fetchStudentData = async () => {
//     try {


//       const response = await apiService.get(`/api/applicant-history/?candidateID=${candidateID}`);
//       setStudentData(response.data);
//       console.log("Stud", response.data)


//     } catch (error) {
//       console.error('Error fetching student data', error);
//       setErrorMsg('No data found for the student.');
//     }
//   };

//   const fetchAppliedJobs = async () => {
//     try {
//       const response = await apiService.get(`/api/hr-job-applicant-history/?candidateId=${candidateID}&hrId=${HrId}`);
//       setAppliedJobs(response.data);
//       if (response.data.length > 0) {
//         setErrorMsg('')
//       } else {
//         setErrorMsg('No job applications found for the student.');
//       }
//     } catch (error) {
//       console.error('Error fetching applied jobs', error);
//       setErrorMsg('No applied jobs found for the student.');
//     }
//   };
//   const formatDate = (date) => {
//     /*
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     console.log(new Date(date).toLocaleDateString(undefined, options))
//     return new Date(date).toLocaleDateString(undefined, options);*/
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   const handleResumeDownload = async (applicationId) => {
//     try {
//       console.log("Id:", applicationId);
//       const url = `/api/download-resume/${applicationId.applicationID}`;
//       console.log("Request URL:", url);
//       const response = await apiService.getWithResponseType(url, 'blob');
//       console.log("Resp", response);
//       const contentType = response.headers['content-type'] || 'application/octet-stream';
//       console.log("Content", contentType)
//       let extension = 'pdf'; // Default extension
//       if (contentType.includes('application/pdf')) {
//         extension = 'pdf';
//       } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
//         extension = 'docx';
//       } else if (contentType.includes('application/msword')) {
//         extension = 'doc';
//       }
//       const blob = new Blob([response.data], { type: contentType });
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = `resume-${applicationId.fullName}.${extension}`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl); // Clean up
//     } catch (error) {
//       console.error('Error downloading the file:', error);
//     }
//   };

//   console.log(errorMsg, appliedJobs)
//   return (
//     <>
//       <Container className='mt-4'>
//         <h2>Student data</h2>
//         {studentData ? (
//           <Col lg={10} sm={12} xs={12} className='mt-4'>
//             <Table responsive bordered className="table">
//               <thead style={{ backgroundColor: 'green' }}>
//                 <tr style={{ backgroundColor: 'blue' }}>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>CandidateID</th>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>Name</th>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>Email</th>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>Phone</th>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>Domain</th>
//                   <th style={{ backgroundColor: '#1b74a8', color: 'white' }}>Batch</th>
//                 </tr>
//               </thead>
//               <tbody>
//                               <tr>
//                   <td>{studentData.candidateID || studentData.guestID}</td>
//                   <td>{studentData.fullName}</td>
//                   <td>{studentData.email}</td>
//                   <td>{studentData.mobileNo || studentData.mobileno}</td>
//                   <td>{studentData.domain}</td>
//                   <td>{studentData.batchNo || studentData.batchno}</td>
//                 </tr>
// 		</tbody>
//             </Table>
//           </Col>
//         ) : (
//           errorMsg && <Alert variant="danger">{errorMsg}</Alert>
//         )}
//         <h3>Job Applications</h3>

//         {appliedJobs.length > 0 ? (
//           <Col lg={10} sm={12} xs={12} className='mt-4'>
//             <Table responsive bordered style={{ borderCollapse: 'collapse', width: '100%' }}>
//               <thead>
//                 <tr>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Job ID</th>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Job Title</th>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Company</th>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Application Date</th>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Status</th>
//                   <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Resume</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appliedJobs.map(job => (
//                   <tr key={job.jobID}>
//                     <td>{job.jobID}</td>
//                     <td><Link to={`/hr_dash/job_desc/${job.jobID}`}>{job.jobRole}</Link></td>
//                     <td>{job.companyName}</td>
//                     <td>{formatDate(job.applied_on)}</td>
//                     <td>{job.status}</td>
//                     <td
//                       style={{ border: '1px solid black', padding: '8px', cursor: 'pointer', backgroundColor: '#ffffff' }}
//                       onClick={() => handleResumeDownload(job)}
//                     >
//                       <div className='text-align-center d-flex flex-row justify-content-center'>
//                         <FaFilePdf color='#2a97eb' />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Col>
//         ) : (
//           errorMsg && <Alert variant="danger">{errorMsg}</Alert>
//         )}
//       </Container>
//     </>

//   );
// };

// export default StudentDetails;

// StudentDetails.js


import Cookies from 'js-cookie'
import apiService from '../../../../apiService';

import React, { useEffect, useState } from 'react';
import { Container, Form, Alert, Col } from 'react-bootstrap';
import { useRef } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import { Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, ListItem, ListItemIcon, ListItemText, IconButton, Collapse, Divider, List, Grid, Card, CardContent, Badge, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import avatar2 from '../../../images/avatar1.jpg';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentDetails = ({ candidateID }) => {

  const [studentData, setStudentData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(avatar2);
  const isIntern = candidateID.startsWith('RS');


  useEffect(() => {
    fetchStudentData();
    fetchAppliedJobs();
  }, [candidateID]);

  const HrId = Cookies.get('HRid')
  const fetchStudentData = async () => {
    try {
      const response = await apiService.get(`/api/applicant-history/?candidateID=${candidateID}`);
      setStudentData(response.data);
      console.log("Stud", response.data)


    } catch (error) {
      console.error('Error fetching student data', error);
      setErrorMsg('No data found for the student.');
    }
  };


  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Preview the image
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);

  //     // Prepare for upload
  //     const formDataWithImage = new FormData();
  //     formDataWithImage.append('profile_image', file);

  //     // Upload the image
  //     apiService.post(`/api/upload-profile-image/${candidateID}`, formDataWithImage)
  //       .then(response => {
  //         setStudentData(prev => ({ ...prev, profile_img: response.data.filename }));
  //         toast.success('Profile image uploaded successfully!');
  //       })
  //       .catch(error => {
  //         console.error('Error uploading image:', error);
  //         toast.error('Failed to upload profile image');
  //         // Revert to previous image if upload fails
  //         if (studentData.profile_img) {
  //           setProfileImage(`https://backend.ramanasoft.com:5000/uploads/profiles/${studentData.profile_img}`);
  //         } else {
  //           setProfileImage(avatar2);
  //         }
  //       });
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Prepare for upload
      const formDataWithImage = new FormData();
      formDataWithImage.append('profile_image', file);

      // 🔹 Decide API endpoint based on candidateID
      const uploadEndpoint = candidateID.startsWith("QT")
        ? `/api/upload-guest-profile-image/${candidateID}`
        : `/api/upload-profile-image/${candidateID}`;

      // Upload the image
      apiService.post(uploadEndpoint, formDataWithImage)
        .then(response => {
          setStudentData(prev => ({
            ...prev,
            profile_img: response.data.filename
          }));
          toast.success('Profile image uploaded successfully!');
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload profile image');

          // Revert to previous image if upload fails
          if (studentData.profile_img) {
            setProfileImage(
              `https://backend.ramanasoft.com:5000/uploads/profiles/${studentData.profile_img}`
            );
          } else {
            setProfileImage(avatar2);
          }
        });
    }
  };


  const fetchAppliedJobs = async () => {
    try {
      const response = await apiService.get(`/api/hr-job-applicant-history/?candidateId=${candidateID}&hrId=${HrId}`);
      setAppliedJobs(response.data);
      if (response.data.length > 0) {
        setErrorMsg('')
      } else {
        setErrorMsg('No job applications found for the student.');
      }
    } catch (error) {
      console.error('Error fetching applied jobs', error);
      setErrorMsg('No applied jobs found for the student.');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleResumeDownload = async (applicationId) => {
    try {
      console.log("Id:", applicationId);
      const url = `/api/download-resume/${applicationId.applicationID}`;
      console.log("Request URL:", url);
      const response = await apiService.getWithResponseType(url, 'blob');
      console.log("Resp", response);
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      console.log("Content", contentType)
      let extension = 'pdf'; // Default extension
      if (contentType.includes('application/pdf')) {
        extension = 'pdf';
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        extension = 'docx';
      } else if (contentType.includes('application/msword')) {
        extension = 'doc';
      }
      const blob = new Blob([response.data], { type: contentType });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `resume-${applicationId.fullName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  console.log(errorMsg, appliedJobs)
  return (
    <>
      <div>
        {isIntern ?
          (
            <Link to='/HR_dash/allInterns' className='text-decoration-none'>
              <Button variant="contained" color="primary" style={{ display: "flex", gap: "5px" }}>
                <i className="fa-solid fa-left-long"></i> Back
              </Button>
            </Link>) :
          (
            <Link to='/HR_dash/allGuests' className='text-decoration-none'>
              <Button variant="contained" color="primary" style={{ display: "flex", gap: "5px" }}>
                <i className="fa-solid fa-left-long"></i> Back
              </Button>
            </Link>
          )}

        <Container className='mt-4'>
          <span style={{ display: 'inline', marginTop: '10px' }}>
            <h2>Student data</h2>
          </span>
          {studentData ? (
            <Box sx={{ display: "flex", gap: 4, p: 3 }}>

              <Box sx={{ flex: 2 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>CandidateID</TableCell>
                      <TableCell>{studentData.candidateID || studentData.guestID}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell>{studentData.fullName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell>{studentData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                      <TableCell>{studentData.mobileNo || studentData.mobileno}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Domain</TableCell>
                      <TableCell>{studentData.domain}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Vasavi Foundation</TableCell>
                      <TableCell>
                        {studentData.belongedToVasaviFoundation ||
                          studentData.BelongedToVasaviFoundation}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                      <TableCell>{studentData.address}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Batch No</TableCell>
                      <TableCell>{studentData.batchNo || studentData.batchno}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Mode of Internship</TableCell>
                      <TableCell>
                        {studentData.modeOfInternship || studentData.modeOfTraining}
                      </TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </Box>

              {/* RIGHT SECTION — IMAGE */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "left" }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>

                  <Avatar
                    src={
                      studentData.profile_img
                        ? `https://backend.ramanasoft.com:5000/uploads/profiles/${studentData.profile_img}`
                        : avatar2
                    }
                    alt={studentData.fullName}
                    sx={{
                      width: 300,
                      height: 300,
                      border: "3px solid black",
                    }}
                  />

                  {/* Camera Button BELOW the image */}
                  <button
                    style={{
                      marginTop: "15px",    // ⬅ spacing below avatar
                      backgroundColor: "#000000ff",
                      border: "1px solid white",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Camera size={22} />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </Box>

            </Box>

          ) : (
            errorMsg && <Alert variant="danger">{errorMsg}</Alert>
          )}

          <Divider sx={{ my: 1, mt: 5 }} />


          <Divider sx={{ my: 1, mt: 5 }} />
          <h2 style={{ marginBottom: "10px" }}>
            Job Applications
          </h2>
          {appliedJobs.length > 0 ? (
            <Col lg={10} sm={12} xs={12} className='mt-4'>
              <Table responsive bordered style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Job ID</th>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Job Title</th>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Company</th>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Application Date</th>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Status</th>
                    <th style={{ backgroundColor: '#416cb0', color: '#ffffff', border: '1px solid black', padding: '8px' }}>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedJobs.map(job => (
                    <tr key={job.jobID}>
                      <td>{job.jobID}</td>
                      <td><Link to={`/hr_dash/job_desc/${job.jobID}`}>{job.jobRole}</Link></td>
                      <td>{job.companyName}</td>
                      <td>{formatDate(job.applied_on)}</td>
                      <td>{job.status}</td>
                      <td
                        style={{ border: '1px solid black', padding: '8px', cursor: 'pointer', backgroundColor: '#ffffff' }}
                        onClick={() => handleResumeDownload(job)}
                      >
                        <div className='text-align-center d-flex flex-row justify-content-center'>
                          <FaFilePdf color='#2a97eb' />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          ) : (
            errorMsg && <Alert variant="danger">{errorMsg}</Alert>
          )}

        </Container>
      </div>
    </>

  );
};

export default StudentDetails;
