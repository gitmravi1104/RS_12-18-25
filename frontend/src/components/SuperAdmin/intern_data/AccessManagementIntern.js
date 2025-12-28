// import React, { useState, useEffect } from 'react';
// import { 
//   Box,
//   Button,
//   Checkbox,
//   FormControl,
//   FormGroup,
//   FormControlLabel,
//   Typography,
//   Paper,
//   CircularProgress,
//   Dialog
// } from '@mui/material';
// import { Close } from '@mui/icons-material';
// import { ToastContainer, toast } from 'react-toastify';
// import apiService from '../../../apiService';

// const AccessManagementIntern = ({ candidateId, onClose }) => {
//   const [selectedAccess, setSelectedAccess] = useState({});
//   const [loading, setLoading] = useState(true);

//   const menuItems = [
//     // { id: 'home', label: 'Home Dashboard' },
//     // { 
//     //   id: 'jobGallery', 
//     //   label: 'Jobs Gallery',
//     //   submenu: [
//     //     { id: 'postjob', label: 'Post a Job' },
//     //     { id: 'jobs', label: 'All Jobs' },
//     //     { id: 'companies', label: 'Companies' }
//     //   ]
//     // },
//     { id: 'lms', label: 'Learning Management' },
//     { id: 'quiz', label: 'Quiz Management' },
//     // { id: 'allInterns', label: 'All Interns Data' },
//     // { id: 'allGuests', label: 'All Guests Data' },
//     // { id: 'domainBatch', label: 'Domain & Batches' },
//     // { id: 'internRequests', label: 'Internship Requests' },
//     // { id: 'guestRequests', label: 'Guest Requests' },
//     // { id: 'internshipCertificate', label: 'Internship Certificates' },
//     { id: 'placementManagement', label: 'Placement Managements' },

//     // { 
//     //   id: 'bulkRegister', 
//     //   label: 'Bulk Registration',
//     //   submenu: [
//     //     { id: 'bulkIntern', label: 'Interns' },
//     //     { id: 'bulkGuest', label: 'Guests' }
//     //   ]
//     // },
//     // { id: 'profile', label: 'Profile Management' }
//   ];

//   // useEffect(() => {
//   //   const fetchCurrentAccess = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const response = await apiService.get(`/api/candidate_access/${candidateId}`);
       
//   //       const data = response.data.access;

//   //       // Initialize access with "home" and "profile" always enabled
//   //       const accessObject = { home: true, profile: true };
//   //       data.forEach(item => {
//   //         accessObject[item] = true;
//   //       });
//   //       setSelectedAccess(accessObject);
//   //     } catch (err) {
//   //       toast.error('No data found/Failed to load current candidate access settings');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchCurrentAccess();
//   // }, [candidateId]);
// useEffect(() => {
//   const fetchCurrentAccess = async () => {
//     try {
//       setLoading(true);
//       const response = await apiService.get(`/api/candidate_access/${candidateId}`);
      
//       // backend always returns { access: [] } safely
//       const data = Array.isArray(response.data.access) ? response.data.access : [];

//       // Initialize with "home" and "profile" always enabled
//       const accessObject = { home: true, profile: true };
//       data.forEach(item => {
//         accessObject[item] = true;
//       });

//       setSelectedAccess(accessObject);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to load candidate access settings');

//       // fallback: home & profile enabled, everything else off
//       setSelectedAccess({ home: true, profile: true });
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCurrentAccess();
// }, [candidateId]);

//   const handleToggleAccess = (menuId, menuItem) => {
//     setSelectedAccess(prev => {
//       // Prevent toggling "home" and "profile"
//       if (menuId === 'home' || menuId === 'profile') return prev;

//       const newAccess = { ...prev };
//       newAccess[menuId] = !prev[menuId];

//       if (menuItem.submenu) {
//         // Toggle all submenu items
//         menuItem.submenu.forEach(subItem => {
//           newAccess[subItem.id] = newAccess[menuId];
//         });
//       }

//       menuItems.forEach(item => {
//         if (item.submenu) {
//           const subMenuIds = item.submenu.map(sub => sub.id);
//           if (subMenuIds.includes(menuId)) {
//             const allSubMenuSelected = item.submenu.every(sub => newAccess[sub.id]);
//             newAccess[item.id] = allSubMenuSelected;
//           }
//         }
//       });

//       return newAccess;
//     });
//   };

//   const handleSaveAccess = async () => {
//     try {
//       setLoading(true);
//       const selectedItems = Object.entries(selectedAccess)
//         .filter(([key, value]) => value)
//         .map(([key]) => key);

//       await apiService.put(`/api/candidate_access/${candidateId}`, {
//         accessRights: selectedItems
//       });

//       toast.success('Candidate access rights updated successfully');
//       setTimeout(() => {
//         onClose();
//       }, 2000);
//     } catch (err) {
//       toast.error('Failed to update candidate access settings');
//       setLoading(false);
//     }
//   };

//   // const renderMenuItem = (item, level = 0) => (
//   //   <Box key={item.id} sx={{ ml: level * 3 }}>
//   //     <FormControlLabel
//   //       control={
//   //         <Checkbox
//   //           checked={!!selectedAccess[item.id]}
//   //           onChange={() => handleToggleAccess(item.id, item)}
//   //           disabled={loading || item.id === 'home' || item.id === 'profile'}
//   //         />
//   //       }
//   //       label={item.label}
//   //       sx={{ mb: 1 }}
//   //     />
//   //     {item.submenu && (
//   //       <Box sx={{ ml: 3 }}>
//   //         {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
//   //       </Box>
//   //     )}
//   //   </Box>
//   // );
// const renderMenuItem = (item, level = 0) => (
//   <Box sx={{ ml: level * 3 }}>
//     <FormControlLabel
//       control={
//         <Checkbox
//           checked={!!selectedAccess?.[item.id]}
//           onChange={() => handleToggleAccess(item.id, item)}
//           disabled={loading || item.id === 'home' || item.id === 'profile'}
//         />
//       }
//       label={item.label}
//       sx={{ mb: 1 }}
//     />
//     {Array.isArray(item.submenu) && item.submenu.length > 0 && (
//       <Box sx={{ ml: 3 }}>
//         {item.submenu.map(subItem => (
//           <React.Fragment key={subItem.id}>
//             {renderMenuItem(subItem, level + 1)}
//           </React.Fragment>
//         ))}
//       </Box>
//     )}
//   </Box>
// );

//   return (
//     <Dialog 
//       open={true} 
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//     >
//       <Paper sx={{ p: 3 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h6">
//             Manage Access Rights for Candidate {candidateId}
//           </Typography>
//           <Button 
//             onClick={onClose}
//             sx={{ minWidth: 'auto', p: 1 }}
//           >
//             <Close />
//           </Button>
//         </Box>

//         <FormControl component="fieldset" sx={{ width: '100%' }}>
//           <FormGroup>
//             {menuItems.map(item => renderMenuItem(item))}
//           </FormGroup>
//         </FormControl>

//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
//           <Button
//             variant="outlined"
//             onClick={onClose}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSaveAccess}
//             disabled={loading}
//             sx={{ 
//               backgroundColor: '#1f2c39',
//               '&:hover': {
//                 backgroundColor: '#2c3e50'
//               }
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Save Changes'
//             )}
//           </Button>
//         </Box>

//         <ToastContainer />
//       </Paper>
//     </Dialog>
//   );
// };

// export default AccessManagementIntern;
