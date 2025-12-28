import React, { useEffect, useState } from "react";
import { Container, TextField, Checkbox, Button, Grid, Card, CardContent, CardActions, Typography, Box, Table, TableBody, TableRow, TableCell, Avatar } from "@mui/material";
import { toast } from "react-toastify";
import { FaCheck, FaTimes } from "react-icons/fa";
import apiService from "../../../apiService";
import avatar2 from '../../images/avatar1.jpg';

export default function RegistrationRequests() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await apiService.get("/api/intern-requests");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleAccept = async (acceptedCandidates) => {
    try {
      const response = await apiService.post("/api/accept-interns", acceptedCandidates);
      const { accepted, rejected } = response.data;

      if (accepted.length > 0 && rejected.length === 0) {
        toast.success("All interns accepted successfully!");
      } else if (rejected.length > 0 && accepted.length === 0) {
        toast.error("All interns rejected!");
        rejected.forEach((candidate) => {
          toast.error(`Candidate ${candidate.fullName} (${candidate.email}) already exists.`);
        });
      } else {
        accepted.forEach((candidate) => {
          toast.success(`Candidate ${candidate.fullName} (${candidate.email}) accepted successfully!`);
        });
        rejected.forEach((candidate) => {
          toast.error(`Candidate ${candidate.fullName} (${candidate.email}) already exists.`);
        });
      }

      fetchCandidates();
      setSelectedCandidates([]);
    } catch (error) {
      console.error("Error accepting candidate:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleReject = async (rejectedCandidates) => {
    try {
      await apiService
        .post("/api/reject-interns", rejectedCandidates)
        .then(() => {
          toast.success("Registration rejected successfully!");
          fetchCandidates();
          setSelectedCandidates([]);
        })
        .catch((error) => {
          toast.error(`Error rejecting registration: ${error}`);
        });
    } catch (error) {
      console.error("Error rejecting candidate:", error);
    }
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidates((prevSelected) => {
      if (prevSelected.includes(candidate)) {
        return prevSelected.filter((cand) => cand._id !== candidate._id);
      } else {
        return [...prevSelected, candidate];
      }
    });
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (candidate.mobileno || "").includes(searchTerm)
  );

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates);
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "40%" }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0} onChange={handleSelectAll} />
          <Typography>Select All</Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {filteredCandidates.map((candidate) => (
          <Grid item xs={12} md={6} key={candidate._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, position: "relative" }}>

              {/* Checkbox – Top Right */}
              <Checkbox
                sx={{ position: "absolute", top: 8, right: 8 }}
                checked={selectedCandidates.includes(candidate)}
                onChange={() => handleSelectCandidate(candidate)}
              />

              <CardContent>
                {/* MAIN ROW */}
                <Box sx={{ display: "flex", gap: 3 }}>

                  {/* LEFT: Student Data */}
                  <Box sx={{ flex: 1 }}>
                    <Table size="small">
                      <TableBody>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", width: 200 }}>Name</TableCell>
                          <TableCell>{candidate.fullName}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                          <TableCell>{candidate.email}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
                          <TableCell>{candidate.mobileNo || candidate.mobileno}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Alt Contact</TableCell>
                          <TableCell>{candidate.altmobileno || candidate.altMobileNo}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Domain</TableCell>
                          <TableCell>{candidate.domain}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Batch</TableCell>
                          <TableCell>{candidate.batchNo || candidate.batchno}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Vasavi Foundation</TableCell>
                          <TableCell>{candidate.belongedToVasaviFoundation}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>Mode</TableCell>
                          <TableCell>
                            {candidate.modeOfInternship || candidate.modeOfTraining}
                          </TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </Box>

                  {/* RIGHT: Profile Image */}
                  <Box
                    sx={{
                      width: 220,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={
                        candidate.profile_img
                          ? `https://backend.ramanasoft.com:5000/uploads/profiles/${candidate.profile_img}`
                          : avatar2
                      }
                      alt={candidate.fullName}
                      sx={{
                        width: 180,
                        height: 180,
                        borderRadius: 2,
                        border: "2px solid #ddd",
                      }}
                    />
                  </Box>

                </Box>
              </CardContent>

              {/* ACTIONS */}
              <CardActions sx={{ justifyContent: "flex-end", gap: 2 }}>
                <Button
                  size="small"
                  color="success"
                  onClick={() => handleAccept([candidate])}
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => handleReject([candidate])}
                >
                  Reject
                </Button>
              </CardActions>

            </Card>

          </Grid>
        ))}
      </Grid>

      {filteredCandidates.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 3 }}>No registration requests</Typography>
      )}

      {selectedCandidates.length > 0 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={() => handleAccept(selectedCandidates)}><FaCheck /> Accept Selected</Button>
          <Button onClick={() => handleReject(selectedCandidates)}><FaTimes /> Reject Selected</Button>
        </Box>
      )}
    </Container>
  );
}


// import React, { useEffect, useState } from 'react';
// import { Table, Container, Form, Button } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import { FaCheck, FaTimes } from 'react-icons/fa';
// import apiService from '../../../apiService';

// const RegistrationRequests = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCandidates, setSelectedCandidates] = useState([]);

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   const fetchCandidates = async () => {
//     try {
//       const response = await apiService.get("/api/intern-requests");
//       setCandidates(response.data);
//       console.log(response.data)
//     } catch (error) {
//       console.error('Error fetching candidates:', error);
//     }
//   };

//   const handleAccept = async (acceptedCandidates) => {
//     try {
//       const response = await apiService.post("/api/accept-interns", acceptedCandidates);
//       const { accepted, rejected } = response.data;
  
//       if (accepted.length > 0 && rejected.length === 0) {
//         toast.success("All interns accepted successfully!", {
//           autoClose: 5000
//         });
//       } else if (rejected.length > 0 && accepted.length === 0) {
//         toast.error("All interns rejected!", {
//           autoClose: 5000
//         });
//         rejected.forEach(candidate => {
//           toast.error(`Candidate ${candidate.fullName} (${candidate.email}) was not accepted because they already exist in the database.`, {
//             autoClose: 5000
//           });
//         });
//       } else {
//         accepted.forEach(candidate => {
//           toast.success(`Candidate ${candidate.fullName} (${candidate.email}) accepted successfully!`, {
//             autoClose: 5000
//           });
//         });
//         rejected.forEach(candidate => {
//           toast.error(`Candidate ${candidate.fullName} (${candidate.email}) was rejected because they already exist in the database.`, {
//             autoClose: 5000
//           });
//         });
//       }
  
//       fetchCandidates();
//       setSelectedCandidates([]);
//     } catch (error) {
//       console.error('Error accepting candidate:', error);
//       toast.error(`There was an error accepting the registration: ${error.message}`, {
//         autoClose: 5000
//       });
//     }
//   };
  
//   const handleReject = async (rejectedCandidates) => {
//     try {
//       await apiService.post("/api/reject-interns", rejectedCandidates)
//       .then(response => {
//         toast.success("Registration Rejected successfully!", {
//           autoClose: 5000
//         });
//         fetchCandidates();
//         setSelectedCandidates([]);
//       })
//       .catch(error => {
//         toast.error(`There was an error rejecting the registration ${error}`, {
//           autoClose: 5000
//         });
//       });
//     } catch (error) {
//       console.error('Error rejecting candidate:', error);
//     }
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSelectCandidate = (candidate) => {
//     setSelectedCandidates(prevSelected => {
//       if (prevSelected.includes(candidate)) {
//         return prevSelected.filter(cand => cand._id !== candidate._id);
//       } else {
//         return [...prevSelected, candidate];
//       }
//     });
//   };

//   const handleSelectAllCandidates = () => {
//     if (selectedCandidates.length === filteredCandidates.length) {
//       setSelectedCandidates([]);
//     } else {
//       setSelectedCandidates(filteredCandidates.map(candidate => candidate));
//     }
//   };
//   candidates.map(user=>console.log(user))
//   const filteredCandidates = candidates.filter(candidate =>
    
//     candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.mobileno.includes(searchTerm)
//   );
//   console.log(candidates)
//   return (
//     <div style={{ overflow: 'hidden' }}>
//       {/* Navbar */}
//       {/* <HrNavbar /> */}

//       {/* Search input */}
//       {/* <Container className="my-4">
//         <h1 style={{ color: '#888888', fontWeight: 'bold', fontSize: '25px' }}>Intern Requests</h1>
//         <Form.Control
//           type="text"
//           placeholder="Search by name, email, or phone"
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//       </Container> */}

//       {/* Candidates list */}
//       <Container  className="px-0 ml-auto mr-auto mb-3" style={{ width: '100%' }}>
//         <div className="table-responsive">
//           <Table responsive bordered className="table"  >
//             <thead style={{backgroundColor:'black'}}>
//               <tr style={{backgroundColor:'#1f2c39'}}>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>
//                   <Form.Check 
//                     type="checkbox" 
//                     checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length!==0}
//                     onChange={handleSelectAllCandidates}
//                   />
//                 </th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Name</th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Email</th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Phone</th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Domain</th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Batch</th>
//                 <th style={{backgroundColor:'#1b74a8',color:'white'}}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCandidates.map(candidate => (
//                 <tr key={candidate._id}>
//                   <td>
//                     <Form.Check 
//                       type="checkbox"
//                       checked={selectedCandidates.includes(candidate)}
//                       onChange={() => handleSelectCandidate(candidate)}
//                     />
//                   </td>
//                   <td>{candidate.fullName}</td>
//                   <td>{candidate.email}</td>
//                   <td>{candidate.mobileNo}</td>
//                   <td>{candidate.domain}</td>
//                   <td>{candidate.batchNo}</td>
//                   <td>
//                     <Button 
//                        style={{background:'transparent',border:'none',color:'green'}} 
//                       onClick={() => handleAccept([candidate])}
//                     >
//                       <FaCheck className="me-1" /> Accept
//                     </Button>
//                     <Button 
//                       style={{background:'transparent',border:'none',color:'red'}}
//                       onClick={() => handleReject([candidate])}
//                     >
//                       <FaTimes className="me-1" /> Reject
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
            
//           </Table>
//           {(filteredCandidates.length===0) &&<p style={{textAlign:'center'}}>No registration requests</p>}
//         </div>
//         {selectedCandidates.length > 0 && 
//           <div className="d-flex justify-content-end">
//             <Button 
//               style={{background:'transparent',border:'none',color:'green'}} 
//               onClick={() => handleAccept(selectedCandidates)}
//               disabled={selectedCandidates.length === 0}
//             >
//               <FaCheck className="me-1" /> Accept Selected
//             </Button>
//             <Button 
//               style={{background:'transparent',border:'none',color:'red'}}
//               onClick={() => handleReject(selectedCandidates)}
//               disabled={selectedCandidates.length === 0}
//             >
//               <FaTimes className="me-1" /> Reject Selected
//             </Button>
//           </div>
//         }
//       </Container>
//     </div>
//   );
// };

// export default RegistrationRequests;
