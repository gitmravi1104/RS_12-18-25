import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import apiService from "../../../apiService";
import avatar2 from '../images/avatar2.png';
import { Box, TextField, Container, Grid, Typography, Avatar, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { Trophy, Briefcase, DollarSign, Star } from 'lucide-react';
// import { useWindowSize } from 'react-use'


const Achievements = () => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  // Detect screen size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: document.body.scrollHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.get('/api/Placed_Students', {
        params: { year, month }
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const filtered = data.filter(d =>
      (d.jobTitle && d.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.fullName && d.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.domain && d.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.salary && d.salary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.source && d.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.companyName && d.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <>
      <Container className="my-4">

        <Grid container spacing={2} mb={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={fieldStyles}
              InputProps={{ style: { color: 'white' } }}
            />
          </Grid>

          {/* Year */}
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={labelStyles}>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
                sx={selectStyles}
                MenuProps={{ PaperProps: { sx: menuPaperStyles } }}
              >
                <MenuItem value="">All Years</MenuItem>
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Month */}
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={labelStyles}>Month</InputLabel>
              <Select
                value={month}
                label="Month"
                onChange={(e) => setMonth(e.target.value)}
                sx={selectStyles}
                MenuProps={{ PaperProps: { sx: menuPaperStyles } }}
              >
                <MenuItem value="">All Months</MenuItem>
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((m, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ minHeight: "100vh" }}>
          {data.length === 0 ? (
            <Typography variant="h5" color="white" align="center">
              No placed students yet.
            </Typography>
          ) : filteredData.length === 0 ? (
            <Typography variant="h5" color="white" align="center">
              No results found.
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {filteredData.map((student, index) => (
                // <Grid item key={index} md={6} xs={12}>
                <Grid item key={index} xs={12} sm={6} md={4}>
                  {/* Premium Card */}
                  <Box sx={cardContainerStyles}>
                    {/* Decorative Background Pattern */}
                    <Box sx={backgroundPatternStyles} />

                    {/* Decorative Corner Accents */}
                    <Box sx={topLeftCornerStyles} />
                    <Box sx={bottomRightCornerStyles} />

                    {/* Content */}
                    <Box sx={{ position: 'relative', zIndex: 10, p: 3 }}>
                      {/* Header with Trophy */}
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Box sx={trophyContainerStyles}>
                          <Trophy style={{ width: 24, height: 24, color: '#000' }} />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            background: 'linear-gradient(to right, #fbbf24, #fde047, #fbbf24)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5
                          }}
                        >
                          Congratulations!
                        </Typography>

                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Box sx={{ position: "relative", display: "inline-block", mb: 1 }}>
                          <Box
                            sx={{
                              position: "absolute",
                              inset: -6,
                              backgroundColor: "#5C4033",
                              borderRadius: "18px",
                              transform: "rotate(-6deg)",
                              zIndex: 0,
                            }}
                          />
                          <Avatar
                            src={
                              student.profile_img
                                ? `https://backend.ramanasoft.com:5000/uploads/profiles/${student.profile_img}`
                                : avatar2
                            }
                            sx={{
                              width: 110,
                              height: 110,
                              borderRadius: "18px",
                              border: "3px solid white",
                              position: "relative",
                              zIndex: 1,
                            }}
                          />
                        </Box>

                      </Box>

                      {/* Student Name */}
                      <Typography
                        sx={{
                          fontFamily: 'Georgia, serif',
                          // fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                          mb: 1,
                          fontSize: '1rem',
                          letterSpacing: '0.3px'
                        }}
                      >
                        {student.fullName}
                      </Typography>

                      {/* Divider */}
                      <Box sx={dividerStyles} />

                      {/* Achievement Text */}
                      <Typography
                        sx={{
                          fontFamily: 'Verdana, sans-serif',
                          color: '#d1d5db',
                          textAlign: 'center',
                          mb: 1.5,
                          fontSize: '0.75rem',
                          letterSpacing: '0.2px'
                        }}
                      >
                        Successfully secured the position of
                      </Typography>

                      {/* Job Title & Company */}
                      <Box sx={jobInfoBoxStyles}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                          <Briefcase style={{ width: 16, height: 16, color: '#fbbf24' }} />
                          <Typography
                            sx={{
                              fontFamily: 'Georgia, serif',
                              fontWeight: 'bold',
                              color: '#fbbf24',
                              textAlign: 'center',
                              fontSize: '0.9rem'
                            }}
                          >
                            {student.jobTitle}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: 'Verdana, sans-serif',
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          {student.companyName}
                        </Typography>
                      </Box>

                      {/* Salary Package */}
                      <Box sx={salaryBoxStyles}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              sx={{
                                color: '#d1d5db',
                                display: 'block',
                                mb: 0.3,
                                fontSize: '0.7rem'
                              }}
                            >
                              Annual Package
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: 'Georgia, serif',
                                fontWeight: 'bold',
                                color: '#34d399',
                                fontSize: '0.95rem'
                              }}
                            >
                              {formatSalary(student.salary)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Bottom Accent */}
                    <Box sx={bottomAccentStyles} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

const formatSalary = (salary) => {
  if (typeof salary === "string" && salary.toLowerCase().includes("lpa")) {
    return salary;
  } else if (!isNaN(Number(salary))) {
    const formatted = (Number(salary) / 100000).toFixed(2);
    return `${formatted} LPA`;
  }
  return salary;
};

// Styles
const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: '#FFD700' },
    '&.Mui-focused fieldset': { borderColor: '#FFD700' }
  }
};

const labelStyles = {
  color: 'white',
  '&.Mui-focused': { color: '#FFD700' },
  '&.MuiInputLabel-shrink': { color: '#FFD700' }
};

const selectStyles = {
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
  '& .MuiSvgIcon-root': { color: 'white' }
};

const menuPaperStyles = {
  bgcolor: '#1a1a1a',
  '& .MuiMenuItem-root': {
    color: 'white',
    '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' },
    '&.Mui-selected': { bgcolor: 'rgba(255, 215, 0, 0.2)', '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.3)' } }
  }
};

const cardContainerStyles = {
  position: 'relative',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
  borderRadius: 4,
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
  border: '1px solid rgba(251, 191, 36, 0.3)'
};

const backgroundPatternStyles = {
  position: 'absolute',
  inset: 0,
  opacity: 0.1,
  background: `
    radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)
  `
};

const topLeftCornerStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 96,
  height: 96,
  borderTop: '2px solid #fbbf24',
  borderLeft: '2px solid #fbbf24',
  borderTopLeftRadius: 16
};

const bottomRightCornerStyles = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 96,
  height: 96,
  borderBottom: '2px solid #fbbf24',
  borderRight: '2px solid #fbbf24',
  borderBottomRightRadius: 16
};

const trophyContainerStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #fbbf24 0%, #ca8a04 100%)',
  borderRadius: '50%',
  mb: 1,
  boxShadow: '0 4px 16px rgba(251, 191, 36, 0.5)'
};

const avatarGlowStyles = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(135deg, #fbbf24 0%, #fde047 100%)',
  borderRadius: '8px',
  filter: 'blur(10px)',
  opacity: 0.4
};

const avatarBorderStyles = {
  position: 'relative',
  width: 90,
  height: 90,
  background: 'linear-gradient(135deg, #fbbf24 0%, #fde047 100%)',
  borderRadius: '8px',
  padding: '3px'
};

const dividerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  mb: 1.5,
  '& > div:first-of-type': {
    height: '1px',
    width: 40,
    background: 'linear-gradient(to right, transparent, #fbbf24)'
  },
  '& > div:nth-of-type(2)': {
    width: 6,
    height: 6,
    bgcolor: '#fbbf24',
    borderRadius: '50%'
  },
  '& > div:last-of-type': {
    height: '1px',
    width: 40,
    background: 'linear-gradient(to left, transparent, #fbbf24)'
  }
};

const jobInfoBoxStyles = {
  background: 'linear-gradient(to right, rgba(251, 146, 60, 0.2), rgba(251, 191, 36, 0.3), rgba(251, 146, 60, 0.2))',
  borderRadius: 2,
  p: 1.5,
  mb: 1.5,
  border: '1px solid rgba(251, 191, 36, 0.3)'
};

const salaryBoxStyles = {
  background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
  borderRadius: 2,
  p: 1.5,
  border: '1px solid rgba(16, 185, 129, 0.3)'
};

const bottomAccentStyles = {
  height: 6,
  background: 'linear-gradient(to right, #d97706 0%, #fbbf24 50%, #d97706 100%)'
};

export default Achievements;


// import React, { useEffect, useState } from "react";
// import Confetti from "react-confetti";
// import apiService from "../../../apiService";
// import avatar2 from '../images/avatar2.png';
// import { Box, TextField, Container, Grid, Typography, Avatar, useTheme, FormControl, Select, InputLabel, MenuItem } from "@mui/material";


// const Achievements = () => {
//   const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
//   const [data, setData] = useState([]);

//   const [searchQuery, setSearchQuery] = useState('');

//   const [filteredData, setFilteredData] = useState([]);
//   const [year, setYear] = useState('');
//   const [month, setMonth] = useState('');


//   const fieldStyles = {
//     '& .MuiOutlinedInput-root': {
//       color: 'white',
//       backgroundColor: 'black',
//       '& fieldset': {
//         borderColor: 'white',
//       },
//       '&:hover fieldset': {
//         borderColor: '#FFD700',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#FFD700',
//       },
//     },
//     '& .MuiInputLabel-root': {
//       color: 'white',
//     },
//     '& .MuiInputLabel-root.Mui-focused': {
//       color: '#FFD700',
//     },
//     '& option': {
//       backgroundColor: 'black',
//       color: 'white',
//     },
//   };

//   const selectStyles = {
//     backgroundColor: 'black',
//     color: 'white',
//     '& .MuiOutlinedInput-notchedOutline': {
//       borderColor: 'white',
//     },
//     '&:hover .MuiOutlinedInput-notchedOutline': {
//       borderColor: '#FFD700',
//     },
//     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//       borderColor: '#FFD700',
//     },
//   };

//   const menuPaperStyles = {
//     backgroundColor: 'black',
//     color: 'white',
//     '& .MuiMenuItem-root': {
//       color: 'white',
//     },
//     '& .MuiMenuItem-root:hover': {
//       backgroundColor: '#222',
//     },
//     '& .MuiMenuItem-root.Mui-selected': {
//       backgroundColor: '#FFD700',
//       color: 'black',
//     },
//   };




//   // Detect screen size for confetti
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({ width: window.innerWidth, height: document.body.scrollHeight });
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await apiService.get('/api/Placed_Students', {
//         params: {
//           year,
//           month
//         }
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching data: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [year, month]);   // ✅ REQUIRED

//   useEffect(() => {
//     setFilteredData(data);
//   }, [data]);


//   useEffect(() => {
//     const filtered = data.filter(d =>
//       (d.jobTitle && d.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (d.fullName && d.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (d.domain && d.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (d.salary && d.salary.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (d.source && d.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (d.companyName && d.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     setFilteredData(filtered);
//   }, [searchQuery, data]);


//   return (
//     <Container className="my-4">

//       <Grid container spacing={2} mb={3} alignItems="center">
//         {/* Search */}
//         <Grid item xs={16} md={6}>
//           <TextField
//             fullWidth
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={fieldStyles}
//             InputProps={{ style: { color: 'white' } }}
//           />
//         </Grid>

//         {/* Year */}
//         <Grid item xs={4} md={3}>
//           <FormControl fullWidth>
//             <InputLabel sx={{
//               color: 'white',
//               '&.Mui-focused': {
//                 color: '#FFD700', // gold on focus
//               },
//               '&.MuiInputLabel-shrink': {
//                 color: '#FFD700', // gold when dropdown is open or value selected
//               },
//             }}>Year</InputLabel>
//             <Select
//               value={year}
//               label="Year"
//               onChange={(e) => setYear(e.target.value)}
//               sx={selectStyles}
//               MenuProps={{
//                 PaperProps: {
//                   sx: menuPaperStyles,
//                 },
//               }}
//             >
//               <MenuItem value="">All Years</MenuItem>
//               {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(y => (
//                 <MenuItem key={y} value={y}>{y}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//         </Grid>

//         {/* Month */}
//         <Grid item xs={4} md={3}>
//           <FormControl fullWidth>
//             <InputLabel sx={{
//               color: 'white',
//               '&.Mui-focused': {
//                 color: '#FFD700', // gold on focus
//               },
//               '&.MuiInputLabel-shrink': {
//                 color: '#FFD700', // gold when dropdown is open or value selected
//               },
//             }}>Month</InputLabel>
//             <Select
//               value={month}
//               label="Month"
//               onChange={(e) => setMonth(e.target.value)}
//               sx={selectStyles}
//               MenuProps={{
//                 PaperProps: {
//                   sx: menuPaperStyles,
//                 },
//               }}
//             >
//               <MenuItem value="">All Months</MenuItem>
//               {[
//                 "January", "February", "March", "April", "May", "June",
//                 "July", "August", "September", "October", "November", "December"
//               ].map((m, i) => (
//                 <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//         </Grid>
//       </Grid>

//       <Box sx={{ minHeight: "100vh" }}>



//         {data.length === 0 ? (
//           <Typography variant="h5" color="white" align="center">
//             No placed students yet.
//           </Typography>
//         ) : filteredData.length === 0 ? (
//           <Typography variant="h5" color="white" align="center">
//             No results found.
//           </Typography>
//         ) : (
//           <Grid container spacing={4} justifyContent="center">
//             {filteredData.map((student, index) => (
//               <Grid item key={index} xs={12} sm={6} md={4}>
//                 <Box
//                   sx={{
//                     backgroundColor: "#000",
//                     border: "1px solid white",
//                     color: "white",
//                     textAlign: "center",
//                     p: 3,
//                     borderRadius: 2,
//                     fontFamily: "Arial, sans-serif",
//                     boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.3)",
//                   }}
//                 >
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontFamily: "cursive",
//                       fontWeight: "bold",
//                       color: "#FFD700",
//                       mb: 2,
//                     }}
//                   >
//                     🎉 Congratulations 🎉
//                   </Typography>

//                   <Avatar
//                     src={
//                       student.profile_img
//                         ? `https://backend.ramanasoft.com:5000/uploads/profiles/${student.profile_img}`
//                         : avatar2
//                     }
//                     alt={student.fullName}
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       margin: "0 auto",
//                       border: "3px solid white",
//                     }}
//                   />

//                   <Typography variant="h6" mt={2} fontWeight="bold">
//                     {student.fullName}
//                   </Typography>
//                   <Typography variant="body2" mt={1}>
//                     On Getting a Job as a
//                   </Typography>
//                   <Typography variant="h6" color="#FFD700" fontWeight="bold">
//                     {student.jobTitle}
//                   </Typography>
//                   <Typography variant="subtitle1" fontWeight="bold" mt={1}>
//                     {student.companyName}
//                   </Typography>
//                   <Typography variant="body2" color="#32CD32" mt={1}>
//                     💰 Package: {formatSalary(student.salary)}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         )}

//       </Box>
//     </Container>
//   );
// };


// const formatSalary = (salary) => {
//   if (typeof salary === "string" && salary.toLowerCase().includes("lpa")) {
//     return salary;
//   } else if (!isNaN(Number(salary))) {
//     const formatted = (Number(salary) / 100000).toFixed(2);
//     return `${formatted} LPA`;
//   }
//   return salary;
// };

// export default Achievements;
