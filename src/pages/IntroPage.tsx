import FeatureGrid from "@/components/design/FeatureGrid";
import GlassPanel from "@/components/design/GlassPanel";
import GradientDivider from "@/components/design/GradientDivider";
import HeroSection from "@/components/design/HeroSection";
import PrefetchOnVisible from "@/components/PrefetchOnVisible";
import { SampleMandalart } from "@/components/SampleMandalart";
import useReveal from "@/hooks/useReveal";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  useReveal();

  return (
    <Box>
      {/* Prefetch hidden triggers */}
      <PrefetchOnVisible importFunc={() => import("./MandalartListPage")} />
      <PrefetchOnVisible importFunc={() => import("./MandalartCreatePage")} />
      <PrefetchOnVisible importFunc={() => import("./MandalartDetailPage")} />
      <HeroSection
        eyebrow={
          <Box sx={{ height: { xs: "32px", sm: "40px" } }}>
            <img
              src="/mandamong-logo.svg"
              alt="Mandamong"
              style={{ height: "80%" }}
            />
          </Box>
        }
        title={<>목표를 구조화하고 성취하세요</>}
        description={
          <>
            핵심 주제를 이루기 위해 수행해야 하는 구체적인 행동들을 제안해줍니다.
          </>
        }
        primaryAction={{
          label: "지금 시작하기",
          onClick: () => navigate("/signup"),
        }}
        secondaryAction={{ label: "로그인", onClick: () => navigate("/login") }}
        centerScreen
        centerShift={{ xs: 28, sm: 52, md: 60, lg: 68 }}
      />
      <Container
        maxWidth="lg"
        sx={{ pb: { xs: 10, md: 14 }, px: { xs: 2.2, sm: 3, md: 4 } }}
      >
        <Stack spacing={{ xs: 8, md: 10 }}>
          <GlassPanel glow gradientBorder sx={{ p: { xs: 2.2, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "1.35rem", md: "1.55rem" },
              }}
            >
              만다르트 미리보기
            </Typography>
            <Box sx={{ position: "relative" }}>
              <SampleMandalart />
            </Box>
          </GlassPanel>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "1.4rem", md: "1.7rem" },
                letterSpacing: "-0.02em",
              }}
            >
              핵심 기능
            </Typography>
            <FeatureGrid
              features={[
                {
                  icon: "🎯",
                  title: "구조적 목표 설계",
                  description:
                    "주제 → 목표 → 행동 3계층 구조로 명확한 방향 설정.",
                },
                {
                  icon: "⚡",
                  title: "AI 초안 제안",
                  description:
                    "입력한 주제를 기반으로 초기 목표/행동 아이디어 자동 생성.",
                },
                {
                  icon: "📊",
                  title: "진행률 가시화",
                  description: "체크한 완료 항목 비율을 즉시 시각화.",
                },
                {
                  icon: "🌗",
                  title: "다크 모드",
                  description:
                    "시각 피로를 줄이고 집중도를 높이는 라이트/다크 테마.",
                },
                {
                  icon: "🧩",
                  title: "유연한 수정",
                  description: "목표/행동을 언제든지 추가 · 편집 · 재구성.",
                },
                {
                  icon: "🔁",
                  title: "실시간 전환",
                  description:
                    "리스트 ↔ 그리드 보기 전환으로 다양한 관점 확보.",
                },
                {
                  icon: "📱",
                  title: "반응형 설계",
                  description: "모바일에서도 쾌적한 터치 중심 인터랙션.",
                },
                {
                  icon: "🔐",
                  title: "안전한 인증",
                  description: "이메일 인증 기반 사용자 계정 및 세션 관리.",
                },
              ]}
            />
          </Box>

          <GlassPanel gradientBorder sx={{ p: { xs: 2.4, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "1.35rem", md: "1.55rem" },
              }}
            >
              실행 순서
            </Typography>
            <GradientDivider sx={{ mb: 3 }} />
            <Stack spacing={1.4} sx={{ fontSize: ".9rem" }}>
              <Typography variant="body2">
                1. 새 만다르트를 만들고 이루고 싶은 목표를 입력
              </Typography>
              <Typography variant="body2">
                2. 초안 만들기 버튼으로 AI 제안 확인
              </Typography>
              <Typography variant="body2">
                3. 필요에 따라 자유롭게 수정
              </Typography>
              <Typography variant="body2">
                4. 완료한 행동을 체크하며 진행률 확인
              </Typography>
            </Stack>
            <Button
              onClick={() => navigate("/signup")}
              variant="contained"
              size="large"
              sx={{ mt: 4, alignSelf: "flex-start", fontWeight: 700 }}
            >
              지금 시작하기
            </Button>
          </GlassPanel>
        </Stack>
      </Container>
    </Box>
  );
};

export default IntroPage;
