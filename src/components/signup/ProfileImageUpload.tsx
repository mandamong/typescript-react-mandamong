import React from 'react';
import {Box, Button, CircularProgress, Typography,} from '@mui/material';

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
    return (
        <Box sx={{width: '100%'}}>
            <Button variant="contained" component="label" fullWidth disabled={loadingSignUp}>
                {loadingSignUp ? <CircularProgress size={24}/> : 'Upload Profile Image'}
                <input type="file" hidden onChange={(e) => {
                    setImage(e.target.files ? e.target.files[0] : null);
                    setImageError(false);
                }} accept="image/*"/>
            </Button>
            {image && <Typography variant="body2" sx={{mt: 1}}>{image.name}</Typography>}
            {imageError && <Typography variant="body2" color="error">프로필 이미지를 선택해주세요.</Typography>}
        </Box>
    );
};

export default ProfileImageUpload;
