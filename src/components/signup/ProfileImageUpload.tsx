import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                component="label"
                sx={{
                    border: `2px dashed ${imageError ? 'red' : 'grey.500'}`,
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
                }}
            >
                <input
                    type="file"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setImage(file);
                        setImageError(false);
                    }}
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
                        <Typography variant="body1" fontWeight="bold">프로필 이미지 업로드 <span style={{ color: 'red' }}>*</span></Typography>
                        <Typography variant="caption">클릭하거나 파일을 드래그하세요</Typography>
                    </>
                )}
            </Box>
            {imageError && <Typography variant="body2" color="error" sx={{ mt: 1 }}>프로필 이미지를 선택해주세요.</Typography>}
        </Box>
    );
};

export default ProfileImageUpload;
