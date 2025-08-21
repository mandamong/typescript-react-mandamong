import EmailVerificationSection from '@/components/signup/EmailVerificationSection';
import LanguageSelect from '@/components/signup/LanguageSelect';
import NicknameSection from '@/components/signup/NicknameSection';
import PasswordSection from '@/components/signup/PasswordSection';
import ProfileImageUpload from '@/components/signup/ProfileImageUpload';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
    loadingRequestVerification,
    loadingVerifyCode,
    loadingSignUp,
  autoCheckingEmail,
  autoCheckingNickname,
    emailError,
    emailCheckFailed,
    setEmailError,
    nicknameError,
    nicknameCheckFailed,
    setNicknameError,
    passwordError,
    setPasswordError,
    passwordConfirmError,
    setPasswordConfirmError,
    imageError,
    setImageError,
    isCodeSent,
    resendCooldown,
    handleRequestVerification,
    handleVerifyCode,
    handleSubmit,
  } = useSignUpForm();

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
              회원가입
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              계정을 생성하고 만다르트를 만들어보세요.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Stack spacing={2.5}>
            <EmailVerificationSection
              emailCheckFailed={emailCheckFailed}
              email={email}
              setEmail={setEmail}
              emailChecked={emailChecked}
              setEmailChecked={setEmailChecked}
              autoCheckingEmail={autoCheckingEmail}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              emailVerified={emailVerified}
              setEmailVerified={setEmailVerified}
              loadingRequestVerification={loadingRequestVerification}
              loadingVerifyCode={loadingVerifyCode}
              emailError={emailError}
              setEmailError={setEmailError}
              handleRequestVerification={handleRequestVerification}
              handleVerifyCode={handleVerifyCode}
              isCodeSent={isCodeSent}
              resendCooldown={resendCooldown}
            />

            <NicknameSection
              nickname={nickname}
              setNickname={setNickname}
              nicknameChecked={nicknameChecked}
              setNicknameChecked={setNicknameChecked}
              autoCheckingNickname={autoCheckingNickname}
              nicknameError={nicknameError}
              setNicknameError={setNicknameError}
              nicknameCheckFailed={nicknameCheckFailed}
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
              sx={{ mt: 3, mb: 1.5 }}
              disabled={loadingSignUp}
            >
              {loadingSignUp ? <CircularProgress size={24} /> : '회원가입'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2" color="primary">
                이미 계정이 있으신가요? 로그인
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUpPage;
