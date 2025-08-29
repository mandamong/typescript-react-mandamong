import AuthFrame from '@/components/layout/AuthFrame';
import Section from '@/components/Section';
import EmailVerificationSection from '@/components/signup/EmailVerificationSection';
import LanguageSelect from '@/components/signup/LanguageSelect';
import NicknameSection from '@/components/signup/NicknameSection';
import PasswordSection from '@/components/signup/PasswordSection';
import ProfileImageUpload from '@/components/signup/ProfileImageUpload';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, CircularProgress, Container, Link, Stack } from '@mui/material';
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
    <Container component="main" maxWidth="sm" sx={{ px:{ xs:2.5, sm:0 } }}>
      <AuthFrame icon={<LockOutlinedIcon />} title="회원가입" subtitle="계정을 생성하고 만다르트를 만들어보세요.">
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Stack spacing={{ xs: 3.25, md: 4 }}>
              <Section title="이메일 인증" subtitle="이메일 중복 확인 및 코드 인증" bordered dense>
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
              </Section>
              <Section title="닉네임" subtitle="표시될 공개 이름" bordered dense>
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
              </Section>
              <Section title="비밀번호" subtitle="안전한 비밀번호를 설정하세요" bordered dense>
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
              </Section>
              <Section title="프로필 이미지" subtitle="선택 사항" bordered dense>
                <ProfileImageUpload
                  image={image}
                  setImage={setImage}
                  imageError={imageError}
                  setImageError={setImageError}
                  loadingSignUp={loadingSignUp}
                />
              </Section>
              <Section title="사용 언어" bordered dense>
                <LanguageSelect language={language} setLanguage={setLanguage} />
              </Section>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1.5, py: { xs: 1.1, md: 1.2 } }}
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
    </AuthFrame>
    </Container>
  );
};

export default SignUpPage;
