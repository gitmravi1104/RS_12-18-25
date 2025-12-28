import React, { useEffect, useState } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useRef } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import apiService from '../../../apiService';
import { Table, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, ListItem, ListItemIcon, ListItemText, IconButton, Collapse, Divider, List, Grid, Card, CardContent, Badge, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import avatar2 from '../../images/avatar1.jpg';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#1b74a8',
  color: 'white',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette,
  },
}));

const CuratorStudentDetails = ({ candidateID }) => {

  const [studentData, setStudentData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const isIntern = candidateID.startsWith('RS');
  console.log(isIntern);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subTopics, setSubTopics] = useState([]);
  const [overallQuizCompleted, setOverallQuizCompleted] = useState(null);
  const [quizExistsOverall, setQuizExistsOverall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const MaterialItem = ({ material, completed }) => (
    <ListItem>
      <ListItemIcon>
        {completed ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={material.name}
        secondary={material.mimetype}
      />
    </ListItem>
  );

  const EnhancedModal = ({ subTopics, topicName, onClose }) => {
    const [expandedSubtopics, setExpandedSubtopics] = useState("close");

    const toggleExpand = (subtopicName) => {
      setExpandedSubtopics(prev => ({
        ...prev,
        [subtopicName]: !prev[subtopicName]
      }));
    };

    return (
      <Modal open={Boolean(topicName)} onClose={onClose}>
        <Box
          sx={{
            width: "80%",
            maxHeight: "80vh",
            overflow: "auto",
            margin: "auto",
            marginTop: "5%",
            backgroundColor: "#fff",
            borderRadius: "10px",
            p: 3,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              📘 {topicName} - Detailed Progress
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2} mt={2}>
            {subTopics.length > 0 ? (
              subTopics.map(([subTopicName, subTopicData], index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{
                      mb: 2,
                      borderLeft: '5px solid',
                      borderColor: Math.round((subTopicData.completedMaterials / subTopicData.totalMaterials) * 100) === 100 ? '#4caf50' : '#ff9800',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={() => toggleExpand(subTopicName)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                          {subTopicName}
                          <IconButton size="small" sx={{ ml: 1 }}>
                            {expandedSubtopics[subTopicName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Typography>

                        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Typography variant="body2">
                            <strong>Progress:</strong> {subTopicData.completedMaterials}/{subTopicData.totalMaterials} materials
                            ({Math.round((subTopicData.completedMaterials / subTopicData.totalMaterials) * 100)}%)
                          </Typography>

                          {subTopicData.quizExists ? (
                            <Badge
                              color={subTopicData.quizCompleted ? "success" : "error"}
                              badgeContent={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1 }}>
                                  <QuizIcon fontSize="small" sx={{ mr: 0.5 }} />
                                  {subTopicData.quizCompleted ? "Completed" : "Incomplete"}
                                </Box>
                              }
                            />
                          ) : (
                            <Badge
                              color="default"
                              badgeContent={
                                <Box sx={{ alignItems: 'center', width: "50px", marginTop: "3px", marginBottom: "3px" }}>
                                  <Typography variant="caption">No Quiz</Typography>
                                </Box>
                              }
                            />
                          )}
                        </Box>

                      </Box>

                      <Box sx={{ width: '100%', height: '10px', bgcolor: '#e0e0e0', borderRadius: '5px', mb: 2 }}>
                        <Box
                          sx={{
                            width: `${Math.round((subTopicData.completedMaterials / subTopicData.totalMaterials) * 100)}%`,
                            height: '10px',
                            bgcolor: '#4caf50',
                            borderRadius: '5px',
                            transition: 'width 0.3s ease-in-out'
                          }}
                        />
                      </Box>

                      <Collapse in={expandedSubtopics[subTopicName]}>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                            Materials
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <List dense>
                            {subTopicData.materials && subTopicData.materials.map((material, idx) => (
                              <MaterialItem
                                key={idx}
                                material={material}
                                completed={idx < subTopicData.completedMaterials}
                              />
                            ))}
                            {(!subTopicData.materials || subTopicData.materials.length === 0) && (
                              <Typography variant="body2" sx={{ p: 1 }}>
                                No materials available for this subtopic.
                              </Typography>
                            )}
                          </List>

                          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <QuizIcon fontSize="small" sx={{ mr: 1 }} />
                            Quiz Status
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ p: 1 }}>
                            {subTopicData.quizExists ? (
                              <Typography variant="body2">
                                Quiz: {subTopicData.quizCompleted ?
                                  "✅ Completed successfully" :
                                  "❌ Not completed yet"}
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                No quiz available for this subtopic.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No subtopics available for this topic.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>
    );
  };


  const fetchReport = async () => {
    if (!candidateID) {
      setError("Please enter an Intern ID.");
      return;
    }

    setLoading(true);
    setError("");
    setTopics([]);
    setSelectedTopic(null);
    setSubTopics([]);

    try {
      const response = await apiService.get(`/api/SA_course-progress/${candidateID}`);

      // If the response contains organized data
      if (response.data.organizedData && Object.keys(response.data.organizedData).length > 0) {
        parseData(response.data.organizedData, response.data.completedProgress);
      } else {
        setError("No course data found for this intern.");
        setTopics([]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(err.response.data.message); // Show specific error message
      } else {
        setError("Failed to fetch data. Please try again later.");
      }

      // Clear previous data
      setTopics([]);
      setSelectedTopic(null);
      setSubTopics([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchReport();
    fetchStudentData();
    fetchAppliedJobs();
  }, [candidateID]);

  const fetchStudentData = async () => {
    try {
      const response = await apiService.get(`/api/applicant-history/?candidateID=${candidateID}`);
      setStudentData(response.data);
      console.log("Stud", response.data);
    } catch (error) {
      console.error('Error fetching student data', error);
      setErrorMsg('No data found for the student.');
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await apiService.get(`/api/intern-job-applicant-history/?candidateId=${candidateID}`);
      setAppliedJobs(response.data);
      if (response.data.length > 0) {
        setErrorMsg('');
      } else {
        setErrorMsg('No job applications found for the student.');
      }
    } catch (error) {
      console.error('Error fetching applied jobs', error);
      setErrorMsg('No applied jobs found for the student.');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleResumeDownload = async (applicationId) => {
    try {
      const url = `/api/download-resume/${applicationId.applicationID}`;
      const response = await apiService.getWithResponseType(url, 'blob');
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      let extension = 'pdf';
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

  const parseData = (data, completedProgress) => {
    const topicsArray = [];
    let allTopicsQuizCompleted = true;
    let quizFound = false;

    Object.entries(data).forEach(([courseName, course]) => {
      Object.entries(course.topics).forEach(([topicName, topicData]) => {
        let totalMaterials = 0;
        let completedMaterials = 0;
        let topicQuizCompleted = true;
        let topicQuizExists = false;
        let parsedSubTopics = {};

        Object.entries(topicData.subTopics || {}).forEach(([subTopicName, subTopicData]) => {
          let subTopicCompleted = 0;
          const subTopicMaterials = subTopicData.materials || [];
          const totalSubTopicMaterials = subTopicMaterials.length;

          const courseProgress = completedProgress[courseName];
          const topicProgress = courseProgress?.topics[topicName];
          const subTopicProgress = topicProgress?.subTopics[subTopicName];

          if (subTopicProgress) {
            subTopicCompleted = Object.values(subTopicProgress.materials || {}).filter(Boolean).length;
          }

          const quizExists = subTopicProgress?.hasOwnProperty("quizCompleted") &&
            subTopicData.quiz !== null;

          const quizCompleted = quizExists ? subTopicProgress.quizCompleted : false;

          if (quizExists) {
            topicQuizExists = true;
            quizFound = true;
          }

          if (quizExists && !quizCompleted) {
            topicQuizCompleted = false;
          }

          parsedSubTopics[subTopicName] = {
            materials: subTopicMaterials,
            completedMaterials: subTopicCompleted,
            totalMaterials: totalSubTopicMaterials,
            quizCompleted: quizCompleted,
            quizExists: quizExists  // Added quizExists flag to each subtopic
          };

          totalMaterials += totalSubTopicMaterials;
          completedMaterials += subTopicCompleted;
        });

        const percentage = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

        topicsArray.push({
          name: topicName,
          percentage,
          subTopics: parsedSubTopics,
          quizCompleted: topicQuizExists ? topicQuizCompleted : null,
          quizExists: topicQuizExists
        });

        if (!topicQuizCompleted && topicQuizExists) {
          allTopicsQuizCompleted = false;
        }
      });
    });

    setTopics(topicsArray);
    setOverallQuizCompleted(quizFound ? allTopicsQuizCompleted : null);
    setQuizExistsOverall(quizFound);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic.name);
    setSubTopics(Object.entries(topic.subTopics));
  };

  const handleCloseModal = () => {
    setSelectedTopic(null);
    setSubTopics([]);
  };


  return (
    <div>
      {isIntern ?
        (
          <Link to='/curator/allInterns' className='text-decoration-none'>
            <Button variant="contained" color="primary" style={{ display: "flex", gap: "5px" }}>
              <i className="fa-solid fa-left-long"></i> Back
            </Button>
          </Link>) :
        (
          <Link to='/curator/allGuests' className='text-decoration-none'>
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
            {/* LEFT SECTION — TABLE */}
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
                    <TableCell sx={{ fontWeight: "bold" }}>Parent/Guardian Mobile</TableCell>
                    <TableCell>{studentData.altmobileno || studentData.altMobileNo}</TableCell>
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

                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Accepted Guidelines</TableCell>
                    <TableCell>  {Number(studentData.guidelines) === 1 ? "Accepted" : "Not Accepted"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Accepted On</TableCell>
                    <TableCell>{formatDate(studentData.dateAccepted)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Profile Status</TableCell>
                    <TableCell>
                      {studentData.blockProfile === 1 ? "Blocked" : "Active (Unblocked)"}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </Box>

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
              </div>
            </Box>

          </Box>

        ) : (
          errorMsg && <Alert variant="danger">{errorMsg}</Alert>
        )}

        <Divider sx={{ my: 1, mt: 5 }} />

        {isIntern && (
          <div>
            <h2>
              Course Progress Report
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <div>
              <Grid container spacing={2}>
                {topics.map((topic, index) => (
                  <Grid item xs={3} key={index}>
                    <Card
                      onClick={() => handleTopicSelect(topic)}
                      sx={{
                        background: `linear-gradient(90deg, #4caf50 ${topic.percentage}%, #e0e0e0 ${topic.percentage}%)`,
                        color: "#fff",
                        borderRadius: "10px",
                        p: 2,
                        height: "120px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.03)",
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">{topic.name}</Typography>
                        <Typography variant="body2">{topic.percentage}% Completed</Typography>
                        {topic.quizExists && (
                          <Badge
                            color={topic.quizCompleted ? "success" : "error"}
                            badgeContent={
                              topic.quizCompleted ? "Quiz ✅" : "Quiz ❌"
                            }
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        )}
        <Divider sx={{ my: 1, mt: 5 }} />
        <h2 style={{ marginBottom: "10px" }}>
          Job Applications
        </h2>
        {appliedJobs.length > 0 ? (
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Job ID</StyledTableCell>
                  <StyledTableCell>Job Title</StyledTableCell>
                  <StyledTableCell>Company</StyledTableCell>
                  <StyledTableCell>Application Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Comment</StyledTableCell>
                  <StyledTableCell>Resume</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {appliedJobs.map(job => (
                  <StyledTableRow key={job.jobID}>
                    <TableCell>{job.jobID}</TableCell>
                    <TableCell>{job.jobRole}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{formatDate(job.applied_on)}</TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>{job.comments ? job.comments : "NA"}</TableCell>

                    <TableCell
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleResumeDownload(job)}
                    >
                      <FaFilePdf color='#2a97eb' />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          errorMsg && <Alert variant="danger">{errorMsg}</Alert>
        )}

      </Container>
      {selectedTopic && (
        <EnhancedModal
          subTopics={subTopics}
          topicName={selectedTopic}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CuratorStudentDetails;