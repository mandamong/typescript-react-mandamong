import { useMandalartList } from '@/hooks/useMandalartList'; // Import the custom hook
import AddIcon from '@mui/icons-material/Add'; // Corrected import
import { Box, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, Fab, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const MandalartListPage: React.FC = () => {
    const {mandalarts, loading, hasNext, loadMore, loadingMore} = useMandalartList();

    const getStatusInKorean = (status: string) => {
        switch (status) {
            case 'IN_PROGRESS':
                return '진행 중';
            case 'DONE':
                return '완료';
            default:
                return status;
        }
    };

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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                상태:
                                            </Typography>
                                            <Chip
                                                label={getStatusInKorean(mandalart.mandalart.status)}
                                                color={mandalart.mandalart.status === 'DONE' ? 'success' : 'primary'}
                                                size="small"
                                            />
                                        </Box>
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
            {!loading && mandalarts.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="outlined" onClick={loadMore} disabled={!hasNext || loadingMore}>
                        {loadingMore ? '불러오는 중…' : hasNext ? '더 보기' : '모두 확인했습니다'}
                    </Button>
                </Box>
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
