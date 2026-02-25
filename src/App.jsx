import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import { getTasks, updateTask } from './api/tasksApi';
import Navbar from './components/Navbar';
import Column from './components/Column';
import TaskModal from './components/AddTaskModal';

const COLUMNS = [
  { id: 'backlog', title: 'To Do', color: '#4461E2' },
  { id: 'in_progress', title: 'In Progress', color: '#E29E44' },
  { id: 'review', title: 'In Review', color: '#9E44E2' },
  { id: 'done', title: 'Done', color: '#44E27D' }
];

export default function App() {
  const [modalState, setModalState] = useState({ open: false, column: 'backlog' });
  const searchQuery = useSelector((state) => state.search.query);
  const queryClient = useQueryClient();

  // Fetch tasks using React Query
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });

  // Update task mutation for Drag & Drop 
  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const task = tasks.find(t => t.id.toString() === draggableId);
    if (task.column !== destination.droppableId) {
      updateMutation.mutate({ ...task, column: destination.droppableId });
    }
  };

  // Filter tasks based on Redux search state 
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (columnId) => setModalState({ open: true, column: columnId });

  return (
    <Box sx={{ bgcolor: '#F4F5F7', minHeight: '100vh' ,width: '100%' }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', overflowX: 'auto' }}>
            {COLUMNS.map(col => (
              <Column 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                color={col.color} 
                tasks={filteredTasks.filter(t => t.column === col.id)}
                onAddTask={openModal} 
              />
            ))}
          </Box>
        </DragDropContext>
      </Box>
      <TaskModal 
        open={modalState.open} 
        defaultColumn={modalState.column}
        handleClose={() => setModalState({ ...modalState, open: false })} 
      />
    </Box>
  );
}