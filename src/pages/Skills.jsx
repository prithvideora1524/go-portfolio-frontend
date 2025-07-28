// src/pages/Skills.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import ApiService from "../services/api";

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getSkills();
      console.log("Fetched from backend:", data);
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    console.log("Updated skills after setSkills:", skills);
  }, [skills]);

  const handleOpenDialog = (skill) => {
    setEditingSkill(skill);
    if (skill) {
      setValue("name", skill.name);
      setValue("level", skill.level);
    } else {
      reset();
    }
    setSubmitMessage("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSkill(null);
    reset();
    setSubmitMessage("");
  };

  const onSubmit = async (data) => {
    try {
      if (editingSkill) {
        await ApiService.updateSkill(editingSkill.ID, data);
        setSubmitMessage("Skill updated successfully!");
      } else {
        await ApiService.createSkill(data);
        setSubmitMessage("Skill added successfully!");
      }
      await fetchSkills();
      setTimeout(() => {
        handleCloseDialog();
      }, 700);
    } catch (error) {
      setSubmitMessage("Error saving skill. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await ApiService.deleteSkill(skillId);
        await fetchSkills();
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  if (loading) {
    return (
      <section className="section">
        <h2>Loading Skills...</h2>
      </section>
    );
  }

  return (
    <section className="section">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2>Skills</h2>
        <IconButton
          onClick={() => handleOpenDialog()}
          sx={{
            background: "#61dafb",
            color: "#fff",
            "&:hover": { background: "#4fa8cc" }
          }}
        >
          <Add />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mt: 2
        }}
      >
        {Array.isArray(skills) && skills.length > 0 ? (
          skills.map((skill) => (
            <Box key={skill.ID} position="relative" display="inline-block">
              <Chip
                label={
                  <span>
                    <strong>{skill.name}</strong>
                    <span style={{ color: "#61dafb", marginLeft: 8 }}>{skill.level}</span>
                  </span>
                }
                sx={{
                  fontSize: "1rem",
                  px: 2,
                  py: 1,
                  borderRadius: "24px",
                  background: "rgba(18,22,40,0.93)",
                  color: "#fff",
                  boxShadow: "0 2px 12px #2246"
                }}
              />
              <Box position="absolute" top="-8px" right="-8px" display="flex" gap="4px">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(skill)}
                  sx={{
                    background: "#4caf50",
                    color: "#fff",
                    width: 24,
                    height: 24,
                    "&:hover": { background: "#45a049" }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteSkill(skill.ID)}
                  sx={{
                    background: "#f44336",
                    color: "#fff",
                    width: 24,
                    height: 24,
                    "&:hover": { background: "#d32f2f" }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <p>No skills found. Click + to add one!</p>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
        <DialogContent>
          {submitMessage && (
            <Alert
              severity={submitMessage.includes("Error") ? "error" : "success"}
              sx={{ mb: 2 }}
            >
              {submitMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Skill Name"
              {...register("name", { required: "Skill name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Skill Level"
              {...register("level", { required: "Skill level is required" })}
              error={!!errors.level}
              helperText={errors.level?.message}
              sx={{ mb: 3 }}
              SelectProps={{ native: true }}
            >
              <option value="">Select Level</option>
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </TextField>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingSkill ? "Update" : "Add"} Skill
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </section>
  );
}
