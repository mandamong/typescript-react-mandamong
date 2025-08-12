import { Box, Button, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
import React from 'react';

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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                <Box sx={{ flex: 1, width: '100%' }}>
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
                            sx: { borderRadius: 2, backgroundColor: 'var(--field-bg)' },
                        }}
                    />
                </Box>
                <Box>
                    <Button
                        onClick={handleUpdateNickname}
                        disabled={loading || !nicknameChecked}
                        variant="contained"
                        size="large"
                        sx={{ py: '7.5px', px: 3, borderRadius: 2, fontWeight: 'bold' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : '변경'}
                    </Button>
                </Box>
            </Stack>
        );
};

export default NicknameChange;
