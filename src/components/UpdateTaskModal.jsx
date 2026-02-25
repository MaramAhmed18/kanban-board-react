import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api/tasksApi';

const style = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24,
};

export default function UpdateTaskModal({ open, handleClose, task }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', description: '', column: '', priority: '' });

  // Check state when a task is selected for editing 
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        column: task.column,
        priority: task.priority || 'LOW'
      });
    }
  }, [task]);

  // React Query mutation to update the data in db.json
  const mutation = useMutation({
    mutationFn: (updatedData) => updateTask({ ...task, ...updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']); 
      handleClose();
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Update Task</Typography>
        <TextField 
          fullWidth label="Title" sx={{ mb: 2 }} value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <TextField 
          fullWidth label="Description" multiline rows={3} sx={{ mb: 2 }} value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        <TextField 
          select fullWidth label="Priority" value={formData.priority} sx={{ mb: 3 }}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          {['LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <Button variant="contained" fullWidth onClick={() => mutation.mutate(formData)}>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
}