import React from 'react';
import {Box, Button, CircularProgress, InputAdornment, TextField} from '@mui/material';

interface NicknameSectionProps {
    nickname: string;
    setNickname: (nickname: string) => void;
    nicknameChecked: boolean;
    setNicknameChecked: (checked: boolean) => void;
    loadingNicknameCheck: boolean;
    nicknameError: boolean;
    setNicknameError: (error: boolean) => void;
    handleCheckNickname: () => void;
}

const NicknameSection: React.FC<NicknameSectionProps> = ({
                                                             nickname,
                                                             setNickname,
                                                             nicknameChecked,
                                                             setNicknameChecked,
                                                             loadingNicknameCheck,
                                                             nicknameError,
                                                             setNicknameError,
                                                             handleCheckNickname,
                                                         }) => {
    return (
        <Box sx={{width: '100%'}}>
            <TextField
                
                fullWidth
                id="nickname"
                label={<>닉네임 <span style={{ color: 'red' }}>*</span></>}
                name="nickname"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameError(false);
                    setNicknameChecked(false);
                }}
                error={nicknameError}
                helperText={nicknameError ? '닉네임을 입력해주세요.' : ''}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                onClick={handleCheckNickname}
                                disabled={!nickname || loadingNicknameCheck || nicknameChecked}
                            >
                                {loadingNicknameCheck ? <CircularProgress size={24}/> : '중복확인'}
                            </Button>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default NicknameSection;
