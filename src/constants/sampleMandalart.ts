import type { MandalartGridData } from '@/components/MandalartGrid';

export const sampleMandalartForGrid: MandalartGridData = {
  mandalart: { id: 0, name: '만다몽 샘플' },
  subject: { id: 1, name: '만다라트 최종 목표' },
  objectives: [
    { id: 2, name: '핵심 목표 1' },
    { id: 3, name: '핵심 목표 2' },
    { id: 4, name: '핵심 목표 3' },
    { id: 5, name: '핵심 목표 4' },
    { id: 6, name: '핵심 목표 5' },
    { id: 7, name: '핵심 목표 6' },
    { id: 8, name: '핵심 목표 7' },
    { id: 9, name: '핵심 목표 8' },
  ],
  actions: [
    Array(8).fill(null).map((_, i) => ({ id: 10 + i, name: `실천 계획 1-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 20 + i, name: `실천 계획 2-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 30 + i, name: `실천 계획 3-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 40 + i, name: `실천 계획 4-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 50 + i, name: `실천 계획 5-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 60 + i, name: `실천 계획 6-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 70 + i, name: `실천 계획 7-${i + 1}` })),
    Array(8).fill(null).map((_, i) => ({ id: 80 + i, name: `실천 계획 8-${i + 1}` })),
  ],
};