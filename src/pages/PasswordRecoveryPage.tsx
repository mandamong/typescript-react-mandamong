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
      const { updated } = await userService.resetPassword(email);
      setTempPassword(updated);
      setOpenDialog(true);
      showSnackbar("임시 비밀번호가 생성되었습니다.", "success");
    } catch {
      showSnackbar("임시 비밀번호 생성에 실패했습니다.", "error");
    } finally {
      setLoadingReset(false);
    }
  }, [emailVerified, showSnackbar]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    showSnackbar("복사되었습니다.", "success");
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
              <LockResetIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
              비밀번호 찾기
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              이메일 인증 후 임시 비밀번호를 발급받을 수 있습니다.
            </Typography>
          </Box>
          <Stack spacing={2.5}>
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
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  disabled={
                    loadingRequestVerification ||
                    !validateEmail(email) ||
                    resendCooldown > 0
                  }
                  onClick={handleRequestVerification}
                  size="small"
                >
                  {loadingRequestVerification ? (
                    <CircularProgress size={20} />
                  ) : resendCooldown > 0 ? (
                    `재전송 (${resendCooldown}s)`
                  ) : (
                    "인증 코드 받기"
                  )}
                </Button>
                <TextField
                  label="인증 코드"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  disabled={loadingVerifyCode || !verificationCode}
                  onClick={handleVerifyCode}
                  size="small"
                >
                  {loadingVerifyCode ? <CircularProgress size={20} /> : "확인"}
                </Button>
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
                  sx={{ mt: 1, display: "block" }}
                >
                  이메일 인증 완료
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              disabled={loadingReset || !emailVerified}
              onClick={handleResetPassword}
            >
              {loadingReset ? (
                <CircularProgress size={24} />
              ) : (
                "임시 비밀번호 발급"
              )}
            </Button>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>임시 비밀번호</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {tempPassword}
            </Typography>
            <IconButton onClick={handleCopy} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
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
