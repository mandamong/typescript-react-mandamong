import type { MandalartGridData } from '@/components/MandalartGrid';
import MandalartGrid from '@/components/MandalartGrid';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 간단한 데모 데이터 (정적)
const demoData: MandalartGridData = {
  mandalart: { id: 0, name: '예시 만다르트 이름' },
  subject: { id: 1, name: '예시 만다르트 주제 (올해 목표)' },
  objectives: [
    { id: 2, name: '건강 관리' },
    { id: 3, name: '커리어 성장' },
    { id: 4, name: '재정 관리' },
    { id: 5, name: '취미 / 휴식' },
  ],
  actions: [
    [
      { id: 6, name: '주 3회 운동' },
      { id: 7, name: '7시간 수면' },
      { id: 8, name: '매일 2L 수분' },
      { id: 9, name: '주 1회 스트레칭' },
      { id: 10, name: '체성분 측정' },
    ],
    [
      { id: 11, name: '기술 블로그 작성' },
      { id: 12, name: '오픈소스 PR 1건' },
      { id: 13, name: '주 5시간 학습' },
      { id: 14, name: '영어 기사 리딩' },
      { id: 15, name: '사이드 프로젝트' },
    ],
    [
      { id: 16, name: '지출 카테고리 트래킹' },
      { id: 17, name: '월 예산 수립' },
      { id: 18, name: '비상금 적립' },
      { id: 19, name: '불필요 구독 점검' },
      { id: 20, name: '투자 리밸런싱' },
    ],
    [
      { id: 21, name: '일요일 디지털 디톡스' },
      { id: 22, name: '독서 30분' },
      { id: 23, name: '주 1회 자연 산책' },
      { id: 24, name: '친구와 만남' },
      { id: 25, name: '새 취미 체험' },
    ],
  ],
};

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  const gridData = useMemo(() => demoData, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={8}>
        <Box textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: 'clamp(2rem,6vw,2.75rem)', md: '3.25rem' } }}>
            목표를 구체화하고, 성취하세요.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            핵심 주제를 이루기 위해 수행해야 하는 구체적인 행동들을 제안해줍니다.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button variant="contained" size="large" onClick={() => navigate('/signup')}>지금 시작하기</Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')}>로그인</Button>
          </Stack>
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>예시 만다르트 이름</Typography>
          <MandalartGrid
            data={gridData}
            updateItemName={() => { /* read-only */ }}
            updateItemStatus={() => { /* read-only */ }}
            readOnly
          />
        </Paper>

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>실행 순서</Typography>
          <Stack spacing={1}>
            <Typography variant="body2">1. 새 만다라트를 만들고 이루고 싶은 목표를 입력하세요.</Typography>
            <Typography variant="body2">2. 초안 만들기 버튼을 눌러 AI 의 제안을 확인하세요.</Typography>
            <Typography variant="body2">3. AI 의 제안을 바탕으로 자유롭게 수정하여 나만의 만다르트 표를 완성하세요.</Typography>
            <Typography variant="body2">4. 완료한 행동을 하나씩 체크하며 목표 달성의 즐거움을 느껴보세요.</Typography>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default IntroPage;
