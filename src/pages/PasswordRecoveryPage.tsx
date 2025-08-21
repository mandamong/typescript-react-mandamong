import { useSnackbar } from "@/hooks/useSnackbar";
import { authService } from "@/services/AuthService";
import { userService } from "@/services/UserService";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const PasswordRecoveryPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [loadingRequestVerification, setLoadingRequestVerification] =
    useState(false);
  const [loadingVerifyCode, setLoadingVerifyCode] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(
    () => () => {
      if (timerId.current) clearInterval(timerId.current);
    },
    []
  );

  const validateEmail = (val: string) =>
    /^['"\w-.]+@(['"\w-]+\.)+[\w-]{2,4}$/.test(val);

  const handleRequestVerification = useCallback(async () => {
    if (!validateEmail(email)) {
      showSnackbar("유효한 이메일 주소를 입력해주세요.", "warning");
      return;
    }
    setLoadingRequestVerification(true);
    try {
      await authService.requestEmailVerification(email);
      showSnackbar("인증 코드를 발송했습니다.", "info");
      setIsCodeSent(true);
      setResendCooldown(60);
      if (timerId.current) clearInterval(timerId.current);
      timerId.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerId.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      showSnackbar("인증 코드 발송에 실패했습니다.", "error");
    } finally {
      setLoadingRequestVerification(false);
    }
  }, [email, showSnackbar]);

  const handleVerifyCode = useCallback(async () => {
    if (!verificationCode) {
      showSnackbar("인증 코드를 입력해주세요.", "warning");
      return;
    }
    setLoadingVerifyCode(true);
    try {
      await authService.verifyEmailCode(email, verificationCode);
      showSnackbar("이메일 인증이 완료되었습니다.", "success");
      setEmailVerified(true);
      if (timerId.current) clearInterval(timerId.current);
      setResendCooldown(0);
    } catch {
      showSnackbar("인증 코드가 올바르지 않습니다.", "error");
    } finally {
      setLoadingVerifyCode(false);
    }
  }, [email, verificationCode, showSnackbar]);

  const handleResetPassword = useCallback(async () => {
    if (!emailVerified) {
      showSnackbar("이메일 인증을 먼저 완료해주세요.", "warning");
      return;
    }
    setLoadingReset(true);
    try {
  const payload = await userService.resetPassword(email);
  const pwd = (payload as any)?.password;
      if (pwd) {
        setTempPassword(pwd);
        showSnackbar("임시 비밀번호가 생성되었습니다.", "success");
      } else {
        setTempPassword('');
        showSnackbar("임시 비밀번호를 이메일로 발송했습니다.", "success");
      }
      setOpenDialog(true);
    } catch {
      showSnackbar("임시 비밀번호 생성에 실패했습니다.", "error");
    } finally {
      setLoadingReset(false);
    }
  }, [emailVerified, email, showSnackbar]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    showSnackbar("복사되었습니다.", "success");
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ px: { xs: 2.2, md: 2 } }}>
      <Box sx={{
        minHeight: { xs: 'calc(100dvh - 40px)', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { xs: 'flex-start', md: 'center' },
        py: { xs: 2.5, md: 4 }
      }}>
        <Paper elevation={0} sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 460,
          width: '100%',
          mx: 'auto',
          backdropFilter: { md: 'saturate(1.2) blur(3px)' },
          backgroundColor: { md: 'background.paper' }
        }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: { xs: 2, md: 3 },
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mb: 1, width: { xs: 56, md: 60 }, height: { xs: 56, md: 60 } }}>
              <LockResetIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.32rem', md: '1.45rem' }, letterSpacing: '.2px' }}>
              비밀번호 찾기
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center', lineHeight: 1.42 }}>
              이메일 인증 후 임시 비밀번호를 발급받을 수 있습니다.
            </Typography>
          </Box>
          <Stack spacing={{ xs: 2.2, md: 2.8 }}>
            <TextField
              fullWidth
              label="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={!!email && !validateEmail(email)}
              helperText={
                email && !validateEmail(email)
                  ? "유효한 이메일 주소를 입력해주세요."
                  : " "
              }
            />
            <Box>
              <Box sx={{ mb: 1, fontSize: 12, fontWeight: 500, color: 'text.secondary', letterSpacing: '.2px' }}>
                1. 이메일 인증
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
              >
                <Button
                  variant="outlined"
                  disabled={
                    emailVerified ||
                    loadingRequestVerification ||
                    !validateEmail(email) ||
                    resendCooldown > 0
                  }
                  onClick={handleRequestVerification}
                  size="small"
                  fullWidth
                  sx={{
                    minWidth: { sm: 140 },
                    height: 42,
                    fontSize: 14,
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {loadingRequestVerification ? (
                    <CircularProgress size={20} />
                  ) : emailVerified ? (
                    '인증 완료'
                  ) : resendCooldown > 0 ? (
                    `재전송 (${resendCooldown}s)`
                  ) : (
                    "인증 코드 받기"
                  )}
                </Button>
                {!emailVerified && (
                  <>
                    <TextField
                      label="인증 코드"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{
                        flexGrow: 1,
                        '& .MuiInputBase-root': {
                          height: 42,
                        },
                        '& .MuiInputBase-input': {
                          pt: 0,
                          pb: 0,
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      disabled={loadingVerifyCode || !verificationCode}
                      onClick={handleVerifyCode}
                      size="small"
                      fullWidth
                      sx={{
                        minWidth: { sm: 90 },
                        height: 42,
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      {loadingVerifyCode ? <CircularProgress size={20} /> : "확인"}
                    </Button>
                  </>
                )}
              </Stack>
              {isCodeSent && !emailVerified && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  이메일로 전송된 6자리 코드를 입력하세요.
                </Typography>
              )}
               {emailVerified && (
                 <Typography
                   variant="caption"
                   color="success.main"
                   sx={{ mt: 1, display: "block", fontWeight: 600 }}
                 >
                   이메일 인증 완료
                 </Typography>
               )}
            </Box>
            <Box>
              <Box sx={{ mb: 1, fontSize: 12, fontWeight: 500, color: 'text.secondary', letterSpacing: '.2px' }}>
                2. 임시 비밀번호 발급
              </Box>
            <Button
              variant="contained"
              disabled={loadingReset || !emailVerified}
              onClick={handleResetPassword}
              fullWidth
              sx={{ py: 1.1, fontWeight: 600 }}
            >
              {loadingReset ? (
                <CircularProgress size={24} />
              ) : (
                "임시 비밀번호 발급"
              )}
            </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
              >
                로그인으로 돌아가기
              </Link>
            </Box>
          </Stack>
        </Paper>
      </Box>

  <Dialog open={openDialog} fullWidth maxWidth="xs" onClose={() => setOpenDialog(false)}>
  <DialogTitle>임시 비밀번호</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {tempPassword ? (
              <>
                <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                  {tempPassword}
                </Typography>
                <IconButton onClick={handleCopy} size="small" aria-label="임시 비밀번호 복사">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                이메일로 임시 비밀번호를 전송했습니다.
              </Typography>
            )}
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            로그인 후 반드시 새 비밀번호로 변경해주세요.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>확인</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PasswordRecoveryPage;
