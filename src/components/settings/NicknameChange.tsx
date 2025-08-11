import React from 'react';
import { Box, Button, CircularProgress, TextField, InputAdornment, Grid } from '@mui/material';

interface NicknameChangeProps {
    nickname: string;
    setNickname: (nickname: string) => void;
    handleUpdateNickname: () => void;
    handleCheckNickname: () => void;
    loading: boolean;
    loadingCheck: boolean;
    nicknameChecked: boolean;
}

const NicknameChange: React.FC<NicknameChangeProps> = ({
    nickname,
    setNickname,
    handleUpdateNickname,
    handleCheckNickname,
    loading,
    loadingCheck,
    nicknameChecked
}) => {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs>
                <TextField
                    placeholder="새 닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    variant="filled"
                    size="small"
                    fullWidth
                    hiddenLabel
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleCheckNickname} disabled={loadingCheck || nicknameChecked} size="small" sx={{ fontWeight: 'bold' }}>
                                    {loadingCheck ? <CircularProgress size={20} /> : '중복 확인'}
                                </Button>
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                        sx: { borderRadius: 2, backgroundColor: 'white' }
                    }}
                />
            </Grid>
            <Grid item xs="auto">
                <Button 
                    onClick={handleUpdateNickname} 
                    disabled={loading || !nicknameChecked} 
                    variant="contained"
                    size="large"
                    sx={{ 
                        py: '7.5px', 
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : '변경'}
                </Button>
            </Grid>
        </Grid>
    );
};

export default NicknameChange;
