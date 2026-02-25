import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import { useDispatch } from 'react-redux';
import { setQuery } from '../features/searchSlice';

export default function Navbar() {
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '10px 24px', bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
      {/*Logo and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <GridViewIcon color="primary" />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 2, letterSpacing: 2}}>
            KANBAN BOARD
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <TextField
        size="small"
        placeholder="search tasks..."
        onChange={(e) => dispatch(setQuery(e.target.value))}
        sx={{ width: 300, bgcolor: '#edeef1ef', borderRadius: 1, '& fieldset': { border: 'none' } }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
        }}
      />
    </Box>
  );
}