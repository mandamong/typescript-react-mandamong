import {useCallback, useState} from 'react';
import {mandalartService} from '@/services/MandalartService';
import {useSnackbar} from '@/hooks/useSnackbar';
import {useNavigate} from 'react-router-dom';

export const useMandalartDeletion = (mandalartId: string | undefined) => {
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const [deleting, setDeleting] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDelete = useCallback(async () => {
        setOpenDeleteDialog(false);
        if (!mandalartId) return;
        setDeleting(true);
        try {
            await mandalartService.deleteMandalart(mandalartId);
            showSnackbar('만다라트가 삭제되었습니다.', 'success');
            navigate('/mandalart');
        } catch (error) {
            console.error('Error deleting mandalart:', error);
            showSnackbar('만다라트 삭제에 실패했습니다.', 'error');
        } finally {
            setDeleting(false);
        }
    }, [mandalartId, navigate, showSnackbar]);

    return {
        deleting,
        openDeleteDialog,
        setOpenDeleteDialog,
        handleDelete,
    };
};
