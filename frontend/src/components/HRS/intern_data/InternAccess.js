import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Paper,
  CircularProgress,
  Dialog
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import apiService from '../../../apiService';

const AccessManagement = ({ candidateID, onClose }) => {
  console.log(candidateID, onClose);
  const [selectedAccess, setSelectedAccess] = useState({});
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'Dashboard', label: 'Home Dashboard' },
    { id: 'LMS', label: 'Learning Management' },
    { id: 'Quiz', label: 'Quiz Management' },
    { id: 'Jobs', label: 'Available Jobs' },
    { id: 'Applied', label: 'Applied Jobs' },
    { id: 'Profile', label: 'Profile Management' }
  ];

  
  useEffect(() => {
    const fetchCurrentAccess = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/api/intern_access/${candidateID}`);
        const data = response.data.access;

        // Initialize access with "home" and "profile" always enabled
        const accessObject = { Dashboard: true, Profile: true };
        data.forEach(item => {
          accessObject[item] = true;
        });
        setSelectedAccess(accessObject);
      } catch (err) {
        toast.error('No data found/Failed to load current access settings');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAccess();
  }, [candidateID]);

  const handleToggleAccess = (menuId, menuItem) => {
    setSelectedAccess(prev => {
      // Prevent toggling "home" and "profile"
      if (menuId === 'home' || menuId === 'profile') return prev;

      const newAccess = { ...prev };
      newAccess[menuId] = !prev[menuId];

      if (menuItem.submenu) {
        // Toggle all submenu items
        menuItem.submenu.forEach(subItem => {
          newAccess[subItem.id] = newAccess[menuId];
        });
      }

      menuItems.forEach(item => {
        if (item.submenu) {
          const subMenuIds = item.submenu.map(sub => sub.id);
          if (subMenuIds.includes(menuId)) {
            const allSubMenuSelected = item.submenu.every(sub => newAccess[sub.id]);
            newAccess[item.id] = allSubMenuSelected;
          }
        }
      });

      return newAccess;
    });
  };

  const handleSaveAccess = async () => {
    try {
      setLoading(true);
      const selectedItems = Object.entries(selectedAccess)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      await apiService.put(`/api/intern_access/${candidateID}`, {
        accessRights: selectedItems
      });

      toast.success('Access rights updated successfully');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error('Failed to update access settings');
      setLoading(false);
    }
  };

  const renderMenuItem = (item, level = 0) => (
    <Box key={item.id} sx={{ ml: level * 3 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!selectedAccess[item.id]}
            onChange={() => handleToggleAccess(item.id, item)}
            disabled={loading || item.id === 'Dashboard' || item.id === 'Profile'}
          />
        }
        label={item.label}
        sx={{ mb: 1 }}
      />
      {item.submenu && (
        <Box sx={{ ml: 3 }}>
          {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
        </Box>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Manage Access Rights for {candidateID}
          </Typography>
          <Button 
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            {menuItems.map(item => renderMenuItem(item))}
          </FormGroup>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAccess}
            disabled={loading}
            sx={{ 
              backgroundColor: '#1f2c39',
              '&:hover': {
                backgroundColor: '#2c3e50'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Box>

        <ToastContainer />
      </Paper>
    </Dialog>
  );
};

export default AccessManagement;

