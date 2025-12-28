import React, { useState } from "react";
import apiService from "../../../apiService";
import { 
  TextField, Button, Card, CardContent, Typography, CircularProgress, Box, 
  Grid, Badge, Modal, IconButton, List, ListItem, ListItemIcon, ListItemText, 
  Divider, Tooltip, Collapse
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  const [expandedSubtopics, setExpandedSubtopics] = useState({});

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
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          <strong>Progress:</strong> {subTopicData.completedMaterials}/{subTopicData.totalMaterials} materials ({Math.round((subTopicData.completedMaterials / subTopicData.totalMaterials) * 100)}%)
                        </Typography>
                        
                        {subTopicData.quizExists ? (
                          <Badge
                            color={subTopicData.quizCompleted ? "success" : "error"}
                            badgeContent={
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                                <QuizIcon fontSize="small" sx={{ mr: 0.5 }} />
                                {subTopicData.quizCompleted ? "Completed" : "Incomplete"}
                              </Box>
                            }
                            sx={{ mr: 1 }}
                          />
                        ) : (
                          <Badge
                            color="default"
                            badgeContent={
                              <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                                <Typography variant="caption">No Quiz</Typography>
                              </Box>
                            }
                            sx={{ mr: 1 }}
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

const Report = () => {
  const [internID, setInternID] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [subTopics, setSubTopics] = useState([]);
  const [overallQuizCompleted, setOverallQuizCompleted] = useState(null);
  const [quizExistsOverall, setQuizExistsOverall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!internID) {
      setError("Please enter an Intern ID.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiService.get(`/api/SA_course-progress/${internID}`);
      console.log(response);

      parseData(response.data.organizedData, response.data.completedProgress);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data.");
      setTopics([]);
      setSelectedTopic(null);
      setSubTopics([]);
    } finally {
      setLoading(false);
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

          // Fixed: Check that quizCompleted property exists AND there's an actual quiz
          // The quiz object in organizedData should not be null
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
      <Typography variant="h4" gutterBottom>
        Course Progress Report
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Enter Intern ID"
          value={internID}
          onChange={(e) => setInternID(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={fetchReport}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

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

        {selectedTopic && (
          <EnhancedModal
            subTopics={subTopics}
            topicName={selectedTopic}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Report;