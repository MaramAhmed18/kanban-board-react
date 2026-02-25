import { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTask } from '../api/tasksApi';

export default function AddTaskModal({ open, handleClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ title: '', description: '', column: 'backlog', priority: 'LOW' });

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      handleClose();
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>Add New Task</Typography>
        <TextField fullWidth label="Title" sx={{ mb: 2 }} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        <TextField fullWidth label="Description" multiline rows={3} sx={{ mb: 2 }} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <TextField select fullWidth label="Priority" value={formData.priority} sx={{ mb: 3 }} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
          {['LOW', 'MEDIUM', 'HIGH'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <Button variant="contained" fullWidth onClick={() => mutation.mutate(formData)}>Create Task</Button>
      </Box>
    </Modal>
  );
}