// src/pages/Experience.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, Alert } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useForm } from 'react-hook-form';
import ApiService from '../services/api';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // Fetch experiences from backend
  const fetchExperiences = async () => {
    try {
      const data = await ApiService.getExperiences();
      console.log(data,"experience")
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]); // Fallback to empty array
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

    useEffect(() => {
      console.log("Updated experiences after setExperiences:", experiences);
    }, [experiences]);

  const handleOpenDialog = (experience = null) => {
    setEditingExperience(experience);
    if (experience) {
      setValue('company', experience.company);
      setValue('role', experience.role);
      setValue('description', experience.description);
      setValue('start_date', experience.start_date);
      setValue('end_date', experience.end_date);
      setValue('id', experience.ID)
    } else {
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExperience(null);
    reset();
    setSubmitMessage('');
  };

  const onSubmit = async (data) => {
    try {
      if (editingExperience) {
        await ApiService.updateExperience(editingExperience.ID, data);
        setSubmitMessage('Experience updated successfully!');
      } else {
        await ApiService.createExperience(data);
        setSubmitMessage('Experience added successfully!');
      }
      fetchExperiences(); // Refresh the list
      setTimeout(() => {
        handleCloseDialog();
      }, 1000);
    } catch (error) {
      setSubmitMessage('Error saving experience. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await ApiService.deleteExperience(experienceId);
        fetchExperiences(); // Refresh the list
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  if (loading) {
    return (
      <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2>Loading Experiences...</h2>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2>Experience</h2>
        <IconButton 
          onClick={() => handleOpenDialog()} 
          sx={{ 
            background: '#61dafb', 
            color: '#fff',
            '&:hover': { background: '#4fa8cc' }
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {experiences.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          No experiences added yet. Click the + button to add your first experience!
        </motion.p>
      ) : (
        experiences.map((exp, i) => (
          <motion.div
            className="card"
            key={exp.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.7, type: "spring" }}
            style={{ position: 'relative' }}
          >
            <h3 style={{ color: "#61dafb" }}>
              {exp.role} <small style={{ color: "#ccc" }}>@ {exp.company}</small>
            </h3>
            <p style={{ fontStyle: "italic" }}>{exp.start_date} - {exp.end_date}</p>
            <p>{exp.description}</p>
            
            <Box position="absolute" top="16px" right="16px" display="flex" gap="8px">
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(exp)}
                sx={{ 
                  background: '#4caf50', 
                  color: '#fff',
                  '&:hover': { background: '#45a049' }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteExperience(exp.ID)}
                sx={{ 
                  background: '#f44336', 
                  color: '#fff',
                  '&:hover': { background: '#d32f2f' }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </motion.div>
        ))
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingExperience ? 'Edit Experience' : 'Add New Experience'}
        </DialogTitle>
        <DialogContent>
          {submitMessage && (
            <Alert severity={submitMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
              {submitMessage}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Company"
              {...register('company', { required: 'Company is required' })}
              error={!!errors.company}
              helperText={errors.company?.message}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Role/Position"
              {...register('role', { required: 'Role is required' })}
              error={!!errors.role}
              helperText={errors.role?.message}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
            />
            
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Start Date"
                placeholder="e.g., Jan 2022"
                {...register('start_date', { required: 'Start date is required' })}
                error={!!errors.start_date}
                helperText={errors.start_date?.message}
              />
              
              <TextField
                fullWidth
                label="End Date"
                placeholder="e.g., Present or Dec 2023"
                {...register('end_date', { required: 'End date is required' })}
                error={!!errors.end_date}
                helperText={errors.end_date?.message}
              />
            </Box>
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingExperience ? 'Update' : 'Add'} Experience
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
