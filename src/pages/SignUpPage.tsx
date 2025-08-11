import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import EmailVerificationSection from '@/components/signup/EmailVerificationSection';
import PasswordSection from '@/components/signup/PasswordSection';
import ProfileImageUpload from '@/components/signup/ProfileImageUpload';
import LanguageSelect from '@/components/signup/LanguageSelect';
import NicknameSection from '@/components/signup/NicknameSection';

const SignUpPage: React.FC = () => {
  const {
    email,
    setEmail,
    emailChecked,
    setEmailChecked,
    verificationCode,
    setVerificationCode,
    emailVerified,
    setEmailVerified,
    nickname,
    setNickname,
    nicknameChecked,
    setNicknameChecked,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    image,
    setImage,
    language,
    setLanguage,
    loadingEmailCheck,
    loadingRequestVerification,
    loadingVerifyCode,
    loadingNicknameCheck,
    loadingSignUp,
    emailError,
    setEmailError,
    nicknameError,
    setNicknameError,
    passwordError,
    setPasswordError,
    passwordConfirmError,
    setPasswordConfirmError,
    imageError,
    setImageError,
    handleCheckEmail,
    handleRequestVerification,
    handleVerifyCode,
    handleCheckNickname,
    handleSubmit,
  } = useSignUpForm();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <EmailVerificationSection
              email={email}
              setEmail={setEmail}
              emailChecked={emailChecked}
              setEmailChecked={setEmailChecked}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              emailVerified={emailVerified}
              setEmailVerified={setEmailVerified}
              loadingEmailCheck={loadingEmailCheck}
              loadingRequestVerification={loadingRequestVerification}
              loadingVerifyCode={loadingVerifyCode}
              emailError={emailError}
              setEmailError={setEmailError}
              handleCheckEmail={handleCheckEmail}
              handleRequestVerification={handleRequestVerification}
              handleVerifyCode={handleVerifyCode}
            />

            <NicknameSection
              nickname={nickname}
              setNickname={setNickname}
              nicknameChecked={nicknameChecked}
              setNicknameChecked={setNicknameChecked}
              loadingNicknameCheck={loadingNicknameCheck}
              nicknameError={nicknameError}
              setNicknameError={setNicknameError}
              handleCheckNickname={handleCheckNickname}
            />

            <PasswordSection
              password={password}
              setPassword={setPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
              passwordConfirmError={passwordConfirmError}
              setPasswordConfirmError={setPasswordConfirmError}
            />

            <ProfileImageUpload
              image={image}
              setImage={setImage}
              imageError={imageError}
              setImageError={setImageError}
              loadingSignUp={loadingSignUp}
            />

            <LanguageSelect language={language} setLanguage={setLanguage} />
          </Stack>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loadingSignUp}
          >
            {loadingSignUp ? <CircularProgress size={24} /> : '회원가입'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box>
              <Link component={RouterLink} to="/login" variant="body2">
                로그인
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;
