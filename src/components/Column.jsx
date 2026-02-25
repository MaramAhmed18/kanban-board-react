import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';

export default function Column({ id, title, tasks, color, onAddTask }) {
  // pagination state 
  const [page, setPage] = useState(1);
  const tasksPerPage = 5;
  const paginatedTasks = tasks.slice(0, page * tasksPerPage);

  return (
    <Box sx={{ flex: 1, minWidth: 280, minHeight: '75vh', bgcolor: '#edeef1ef', borderRadius: 2, p: 1.5 }}>
      {/* Column header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          {title} 
          <Box component="span" sx={{ ml: 1, color: 'text.disabled', fontWeight: 'normal' }}>
            {tasks.length}
          </Box>
        </Typography>
      </Box>

      {/* Drag and Drop area */}
      <Droppable droppableId={id}>
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100 }}>
            {paginatedTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => <TaskCard task={task} provided={provided} />}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {/* Add Task button*/}
      <Button 
        fullWidth 
        startIcon={<AddIcon />} 
        onClick={() => onAddTask(id)}
        sx={{ color: 'text.secondary', textTransform: 'none', border: '1px dashed #ccc', mb: 1 }}>
        Add task
      </Button>

      {/* Pagination */}
      {tasks.length > paginatedTasks.length && (
        <Button size="small" fullWidth onClick={() => setPage(page + 1)}>
          Load More Tasks
        </Button>
      )}
    </Box>
  );
}