import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

interface ProfileImageUploadProps {
    image: File | null;
    setImage: (image: File | null) => void;
    imageError: boolean;
    setImageError: (error: boolean) => void;
    loadingSignUp: boolean;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    image,
    setImage,
    imageError,
    setImageError,
    loadingSignUp,
}) => {
    const imageUrl = image ? URL.createObjectURL(image) : null;
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((files: FileList | null) => {
        const file = files && files[0] ? files[0] : null;
        setImage(file);
        setImageError(false);
    }, [setImage, setImageError]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                component="label"
                sx={{
                    border: `2px dashed ${imageError ? 'red' : (isDragging ? 'primary.main' : 'grey.500')}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 150,
                    color: 'text.secondary',
                    '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                    },
                    transition: 'border-color 0.2s, background-color 0.2s',
                    backgroundColor: isDragging ? 'action.hover' : 'transparent',
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (loadingSignUp) return;
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    if (loadingSignUp) return;
                    setIsDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
            >
                <input
                    type="file"
                    hidden
                    onChange={(e) => handleFiles(e.target.files)}
                    accept="image/*"
                    disabled={loadingSignUp}
                />
                {loadingSignUp ? (
                    <CircularProgress />
                ) : imageUrl ? (
                    <img src={imageUrl} alt="Profile Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                    <>
                        <AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body1" fontWeight="bold">프로필 이미지 (선택)</Typography>
                        <Typography variant="caption">클릭 또는 드래그 & 드롭</Typography>
                    </>
                )}
            </Box>
            {imageError && <Typography variant="body2" color="error" sx={{ mt: 1 }}>이미지 형식을 확인해주세요. (JPG, PNG, GIF, 2MB 이하)</Typography>}
        </Box>
    );
};

export default ProfileImageUpload;
