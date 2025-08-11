import React from 'react';
import { Box, Button, CircularProgress, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from '@/hooks/useSnackbar';

interface AccountManagementProps {
    loadingPasswordReset: boolean;
    loadingDeleteAccount: boolean;
    handleResetPassword: () => void;
    handleDeleteAccount: () => void;
    tempPassword: string;
    openTempPasswordDialog: boolean;
    handleCloseTempPasswordDialog: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
    loadingPasswordReset,
    loadingDeleteAccount,
    handleResetPassword,
    handleDeleteAccount,
    tempPassword,
    openTempPasswordDialog,
    handleCloseTempPasswordDialog,
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const { showSnackbar } = useSnackbar();

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(tempPassword);
        showSnackbar('임시 비밀번호가 클립보드에 복사되었습니다.', 'success');
    };

    return (
        <>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        임시 비밀번호를 생성하여 즉시 로그인할 수 있습니다.
                    </Typography>
                    <Button onClick={handleResetPassword} disabled={loadingPasswordReset} variant="outlined" size="small">
                        {loadingPasswordReset ? <CircularProgress size={24} /> : '임시 비밀번호 받기'}
                    </Button>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                    </Typography>
                    <Button onClick={handleOpenDeleteDialog} disabled={loadingDeleteAccount} variant="outlined" color="error" size="small">
                        {loadingDeleteAccount ? <CircularProgress size={24} /> : '회원 탈퇴'}
                    </Button>
                </Box>
            </Stack>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>회원 탈퇴</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} disabled={loadingDeleteAccount}>취소</Button>
                    <Button onClick={handleDeleteAccount} color="error" disabled={loadingDeleteAccount} autoFocus>
                        {loadingDeleteAccount ? <CircularProgress size={24} color="inherit" /> : '탈퇴'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTempPasswordDialog} onClose={handleCloseTempPasswordDialog}>
                <DialogTitle>임시 비밀번호</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                            {tempPassword}
                        </Typography>
                        <IconButton onClick={handleCopyPassword} size="small">
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </DialogContentText>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        이 임시 비밀번호로 로그인 후, 반드시 비밀번호를 변경해주세요.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTempPasswordDialog}>확인</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AccountManagement;