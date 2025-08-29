export const OBJECTIVE_PROGRESS_WEIGHT = 0.4; 
export const ACTION_PROGRESS_WEIGHT = 0.6;    
if (import.meta && (OBJECTIVE_PROGRESS_WEIGHT + ACTION_PROGRESS_WEIGHT > 1.0001)) {
  console.warn('[progress] 가중치 합계가 1을 초과합니다.');
}
