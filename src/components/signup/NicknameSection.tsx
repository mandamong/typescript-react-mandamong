import { Box, CircularProgress, InputAdornment, TextField, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from 'react';

interface NicknameSectionProps {
    nickname: string;
    setNickname: (nickname: string) => void;
    nicknameChecked: boolean;
    setNicknameChecked: (checked: boolean) => void;
    autoCheckingNickname?: boolean;
    nicknameCheckFailed?: boolean;
    nicknameError: boolean;
    setNicknameError: (error: boolean) => void;
}

const NicknameSection: React.FC<NicknameSectionProps> = ({
    nickname,
    setNickname,
    nicknameChecked,
    setNicknameChecked,
    autoCheckingNickname,
    nicknameCheckFailed,
    nicknameError,
    setNicknameError,
}) => {
    return (
        <Box sx={{width: '100%'}}>
            <TextField
                required
                fullWidth
                id="nickname"
                label={"닉네임"}
                name="nickname"
                autoComplete="nickname"
                value={nickname}
                onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameError(false);
                    setNicknameChecked(false);
                }}
                error={!!nicknameCheckFailed}
                helperText={nicknameError ? '닉네임을 입력해주세요.' : (nicknameCheckFailed ? '이미 사용 중인 닉네임입니다.' : '')}
                FormHelperTextProps={{
                    sx: {
                        m: 0.5,
                        fontSize: 12,
                        color: nicknameCheckFailed ? 'error.main' : nicknameError ? 'warning.main' : 'text.secondary'
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {autoCheckingNickname && !nicknameChecked && (
                                <CircularProgress size={20} />
                            )}
                            <Fade in={nicknameChecked && !autoCheckingNickname && !nicknameCheckFailed} timeout={250}>
                                <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{
                                        ml: 0.5,
                                        '@keyframes popIn': {
                                            '0%': { transform: 'scale(0.4)', opacity: 0 },
                                            '70%': { transform: 'scale(1.05)', opacity: 1 },
                                            '100%': { transform: 'scale(1)', opacity: 1 }
                                        },
                                        animation: 'popIn 300ms ease'
                                    }}
                                    aria-label="사용 가능한 닉네임"
                                />
                            </Fade>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default NicknameSection;
