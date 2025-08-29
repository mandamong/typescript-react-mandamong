import { useSnackbar } from '@/hooks/useSnackbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';

interface ProfileImageUploadResult {
    imageUrl?: string;
}

interface ProfileImageUploadProps {
    currentImageUrl?: string;
    loading: boolean;
    onImageUpload: (file: File) => Promise<ProfileImageUploadResult | void>;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    currentImageUrl,
    loading,
    onImageUpload,
}) => {
    const { showSnackbar } = useSnackbar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            showSnackbar('파일 크기는 5MB 이하여야 합니다.', 'error');
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showSnackbar('지원되지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        try {
            await onImageUpload(file);
            setPreviewUrl(null); 
    } catch (_err) {
            setPreviewUrl(null); 
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Stack spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
                <Avatar
                    src={previewUrl || currentImageUrl}
                    sx={{
                        width: 120,
                        height: 120,
                        border: '3px solid',
                        borderColor: 'divider',
                    }}
                />
                {loading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '50%',
                        }}
                    >
                        <CircularProgress size={40} sx={{ color: 'white' }} />
                    </Box>
                )}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    JPG, PNG, GIF, WebP 형식의 파일을 업로드할 수 있습니다.
                    <br />
                    최대 파일 크기: 5MB
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUploadClick}
                    disabled={loading}
                    sx={{ minWidth: 160 }}
                >
                    {loading ? '업로드 중...' : '이미지 선택'}
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </Box>
        </Stack>
    );
};

export default ProfileImageUpload;
