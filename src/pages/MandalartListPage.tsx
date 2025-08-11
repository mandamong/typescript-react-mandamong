import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Box, Card, CardActionArea, CardContent, CircularProgress, Fab, Typography,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Corrected import
import {useMandalartList} from '@/hooks/useMandalartList'; // Import the custom hook

const MandalartListPage: React.FC = () => {
    const {mandalarts, loading} = useMandalartList();

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                만다르트
            </Typography>
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress/></Box>
            ) : mandalarts.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    {mandalarts.map((mandalart) => (
                        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={mandalart.mandalart.id}>
                            <Card>
                                <CardActionArea component={RouterLink} to={`/mandalart/${mandalart.mandalart.id}`}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {mandalart.mandalart.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Status: {mandalart.mandalart.status}
                                        </Typography>
                                        <Typography variant="body1" sx={{mt: 1}}>
                                            🎯 {mandalart.subject.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography>생성된 만다르트가 없습니다.</Typography>
            )}
            <Fab
                color="primary"
                aria-label="add"
                sx={{position: 'fixed', bottom: 32, right: 32}}
                component={RouterLink}
                to="/mandalart/new"
            >
                <AddIcon/>
            </Fab>
        </Box>
    );
};

export default MandalartListPage;
