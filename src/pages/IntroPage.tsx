import FeatureGrid from "@/components/design/FeatureGrid";
import GlassPanel from "@/components/design/GlassPanel";
import GradientDivider from "@/components/design/GradientDivider";
import HeroSection from "@/components/design/HeroSection";
import type { MandalartGridData } from "@/components/MandalartGrid";
import MandalartGrid from "@/components/MandalartGrid";
import PrefetchOnVisible from "@/components/PrefetchOnVisible";
import { usePerformance } from '@/contexts/PerformanceContext';
import useReveal from "@/hooks/useReveal";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
const demoData: MandalartGridData = {
  mandalart: { id: 0, name: "예시 만다르트 이름" },
  subject: { id: 1, name: "예시 만다르트 주제 (올해 목표)" },
  objectives: [
    { id: 2, name: "건강 관리" },
    { id: 3, name: "커리어 성장" },
    { id: 4, name: "재정 관리" },
    { id: 5, name: "취미 / 휴식" },
  ],
  actions: [
    [
      { id: 6, name: "주 3회 운동" },
      { id: 7, name: "7시간 수면" },
      { id: 8, name: "매일 2L 수분" },
      { id: 9, name: "주 1회 스트레칭" },
      { id: 10, name: "체성분 측정" },
    ],
    [
      { id: 11, name: "기술 블로그 작성" },
      { id: 12, name: "오픈소스 PR 1건" },
      { id: 13, name: "주 5시간 학습" },
      { id: 14, name: "영어 기사 리딩" },
      { id: 15, name: "사이드 프로젝트" },
    ],
    [
      { id: 16, name: "지출 카테고리 트래킹" },
      { id: 17, name: "월 예산 수립" },
      { id: 18, name: "비상금 적립" },
      { id: 19, name: "불필요 구독 점검" },
      { id: 20, name: "투자 리밸런싱" },
    ],
    [
      { id: 21, name: "일요일 디지털 디톡스" },
      { id: 22, name: "독서 30분" },
      { id: 23, name: "주 1회 자연 산책" },
      { id: 24, name: "친구와 만남" },
      { id: 25, name: "새 취미 체험" },
    ],
  ],
};

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { perf } = usePerformance();

  const gridData = useMemo(() => demoData, []);
  useReveal();

  return (
    <Box>
  {/* Prefetch hidden triggers */}
  <PrefetchOnVisible importFunc={() => import('./MandalartListPage')} />
  <PrefetchOnVisible importFunc={() => import('./MandalartCreatePage')} />
  <PrefetchOnVisible importFunc={() => import('./MandalartDetailPage')} />
      <HeroSection
        eyebrow={
          <Box sx={{ height: { xs: '32px', sm: '40px' } }}>
            <img src="/mandamong-logo.svg" alt="Mandamong" style={{ height: '80%' }} />
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
              <MandalartGrid
                data={gridData}
                updateItemName={() => {}}
                updateItemStatus={() => {}}
                readOnly
                visualMode="preview"
                shape="circle"
                perfMode={perf}
              />
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
