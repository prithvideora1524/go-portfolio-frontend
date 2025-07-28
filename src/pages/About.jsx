// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, Alert } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useForm } from 'react-hook-form';
import ApiService from '../services/api';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const data = await ApiService.getProfile();
      console.log(data,"data")
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set default values if no profile exists
      setProfile({ name: 'Your Name', description: 'Add your description here...' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenDialog = () => {
    if (profile) {
      setValue('name', profile.name);
      setValue('description', profile.description);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    reset();
    setSubmitMessage('');
  };

  const onSubmit = async (data) => {
    try {
      await ApiService.updateProfile(data);
      setSubmitMessage('Profile updated successfully!');
      fetchProfile(); // Refresh the data
      setTimeout(() => {
        handleCloseDialog();
      }, 1000);
    } catch (error) {
      setSubmitMessage('Error updating profile. Please try again.');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Loading Profile...</h2>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "anticipate" }}
      style={{ position: 'relative' }}
    >
      <Box position="absolute" top="16px" right="16px">
        <IconButton
          onClick={handleOpenDialog}
          sx={{ 
            background: '#61dafb', 
            color: '#fff',
            '&:hover': { background: '#4fa8cc' }
          }}
        >
          <Edit />
        </IconButton>
      </Box>

      <h2>About Me</h2>
      <Box textAlign="center">
        <h3 style={{ color: "#61dafb", marginBottom: "1rem" }}>
          {profile?.name || 'Your Name'}
        </h3>
        <p style={{ maxWidth: 600, margin: "1.5rem auto", fontSize: "1.1rem" }}>
          {profile?.description || 'Add your description here...'}
        </p>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {submitMessage && (
            <Alert severity={submitMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
              {submitMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Description"
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 3 }}
            />
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                Update Profile
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
