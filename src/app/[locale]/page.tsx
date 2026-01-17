import { Box } from '@mui/material';
import HomeForm from '@/components/HomeForm';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <HomeForm />
    </Box>
  );
}
