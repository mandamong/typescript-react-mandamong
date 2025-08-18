import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import React from 'react';

interface AccountManagementProps {
    loadingDeleteAccount: boolean;
    handleDeleteAccount: () => void;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
    loadingDeleteAccount,
    handleDeleteAccount,
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    return (
        <>
            <Stack spacing={2}>
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
        </>
    );
};

export default AccountManagement;