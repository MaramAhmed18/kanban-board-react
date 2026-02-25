import { useState } from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/tasksApi';
import UpdateTaskModal from './UpdateTaskModal';

export default function TaskCard({ task, provided }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const queryClient = useQueryClient();

  // calculate colors based on task priority 
  const getPriorityColor = (p) => {
    if (p === 'HIGH') return { bg: '#FFE2E2', text: '#FF4D4D' };
    if (p === 'MEDIUM') return { bg: '#FFF4E2', text: '#FFB344' };
    return { bg: '#F4F5F7', text: 'text.secondary' };
  };

  const colors = getPriorityColor(task.priority);

  // Mutation to handle task deletion
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  return (
    <>
      <Card 
        ref={provided.innerRef} 
        {...provided.draggableProps} 
        {...provided.dragHandleProps}
        sx={{ mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      >
        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight="600">{task.title}</Typography>
            <Box>
              <IconButton size="small" onClick={() => setIsUpdateOpen(true)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" onClick={() => deleteMutation.mutate()}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>

          {/* Priority Chip*/}
          <Chip 
            label={task.priority} 
            size="small" 
            sx={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              height: 20, 
              borderRadius: 1, 
              bgcolor: colors.bg, 
              color: colors.text 
            }} 
          />
        </CardContent>
      </Card>

      <UpdateTaskModal 
        open={isUpdateOpen} 
        handleClose={() => setIsUpdateOpen(false)} 
        task={task} 
      />
    </>
  );
}