import GlassPanel from '@/components/design/GlassPanel';
import MandalartGrid from '@/components/MandalartGrid';
import { usePerformance } from '@/contexts/PerformanceContext';
import { useMandalartDetail, type MandalartDataRaw } from '@/hooks/useMandalartDetail';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mandalartService } from '@/services/MandalartService';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Step, StepLabel, Stepper, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type MandalartItem = { id: number; name?: string; subject?: string; objective?: string; action?: string; status?: string };

const resolveName = (i: MandalartItem) => i.name || i.subject || i.objective || i.action || '';
const getStatusKorean = (status?: string) => status === 'DONE' ? '완료' : '진행 중';

const MandalartDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { mandalart, setMandalart, loading } = useMandalartDetail(id);
  const mandalartRef = useRef<MandalartDataRaw | null>(mandalart);
  useEffect(() => { mandalartRef.current = mandalart; }, [mandalart]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const originalNameRef = useRef(mandalart?.mandalart.name || '');
  useEffect(()=>{ if(mandalart) originalNameRef.current = mandalart.mandalart.name; },[mandalart]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hideCompletedActions, setHideCompletedActions] = useState(false);
  const [collapsedObjectives, setCollapsedObjectives] = useState<Set<number>>(new Set());
  
  const [editingList, setEditingList] = useState<{ id:number; type: 'subject'|'objective'|'action'|'mandalart'|null; value:string }>({ id:-1, type:null, value:'' });
  
  const [loadingSubjectAI, setLoadingSubjectAI] = useState(false); 
  const [loadingObjectiveAI, setLoadingObjectiveAI] = useState<number|null>(null); 
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [subStep, setSubStep] = useState(0);
  const [subData, setSubData] = useState<{ itemName: string; mandalartName: string; subject: string; objectives: string[]; actions: string[][] } | null>(null);
  const [loadingSubAI, setLoadingSubAI] = useState(false);
  const [loadingSubSave, setLoadingSubSave] = useState(false);
  const { perf } = usePerformance();

  const handleCreateSubMandalart = useCallback((_id: number, _type: 'objective' | 'action', name: string) => {
    setSubData({ itemName: name, mandalartName: `${name} 세부 계획`, subject: name, objectives: Array(8).fill(''), actions: Array.from({ length: 8 }, () => Array(8).fill('')) });
    setSubStep(0); setOpenSubDialog(true);
  }, []);

  const handleSubNext = useCallback(async () => {
    if (!subData) return; setLoadingSubAI(true);
    try {
      const ai = await mandalartService.generateGeminiSubject(subData.subject);
      if (ai?.objectives?.length && ai.actions?.length) {
        setSubData(p => p ? { ...p, objectives: ai.objectives!, actions: ai.actions! } : null);
        showSnackbar('AI 제안이 생성되었습니다.', 'success');
      } else showSnackbar('AI 제안 생성에 실패했습니다. 직접 입력해주세요.', 'warning');
      setSubStep(1);
    } catch { showSnackbar('AI 제안 생성에 실패했습니다. 직접 입력해주세요.', 'error'); setSubStep(1); }
    finally { setLoadingSubAI(false); }
  }, [subData, showSnackbar]);

  
  const handleSubRegenerate = useCallback(async () => {
    if (!subData) return; setLoadingSubAI(true);
    try {
      const ai = await mandalartService.generateGeminiSubject(subData.subject);
      if (ai?.objectives?.length && ai.actions?.length) {
        setSubData(p => p ? { ...p, objectives: ai.objectives!, actions: ai.actions! } : null);
        showSnackbar('AI 제안을 다시 불러왔습니다.', 'success');
      } else showSnackbar('AI 제안 재생성 실패 (직접 수정 가능)', 'warning');
    } catch { showSnackbar('AI 제안 재생성 실패', 'error'); }
    finally { setLoadingSubAI(false); }
  }, [subData, showSnackbar]);

  const handleSubNameChange = useCallback((itemId: number, type: 'subject' | 'objective' | 'action', value: string) => {
    if (!subData) return;
    if (type === 'subject') setSubData(p => p ? { ...p, subject: value } : null);
    else if (type === 'objective') setSubData(p => p ? { ...p, objectives: p.objectives.map((o, i) => i === itemId ? value : o) } : null);
    else { const oi = Math.floor(itemId / 100), ai = itemId % 100; setSubData(p => p ? { ...p, actions: p.actions.map((arr, i) => i === oi ? arr.map((a, j) => j === ai ? value : a) : arr) } : null); }
  }, [subData]);

  const handleSubSave = useCallback(async () => {
    if (!subData) return; setLoadingSubSave(true);
    try { const res = await mandalartService.createMandalart({ name: subData.mandalartName, subject: subData.subject, objectives: subData.objectives, actions: subData.actions }); showSnackbar('서브 만다르트가 생성되었습니다.', 'success'); setOpenSubDialog(false); setSubData(null); if (res?.mandalart?.id) navigate(`/mandalart/${res.mandalart.id}`); }
    catch { showSnackbar('서브 만다르트 생성에 실패했습니다.', 'error'); }
    finally { setLoadingSubSave(false); }
  }, [subData, navigate, showSnackbar]);

  const updateMandalartItemStatus = useCallback(async (itemId: number, type: 'subject' | 'objective' | 'action') => {
    let original: MandalartDataRaw | null = null;
    setMandalart(prev => {
      if (!prev) return null; original = JSON.parse(JSON.stringify(prev)); const next: MandalartDataRaw = JSON.parse(JSON.stringify(prev));
      if (type === 'subject' && next.subject.id === itemId) next.subject.status = next.subject.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';
      else if (type === 'objective') next.objectives = next.objectives.map((o: MandalartItem) => o.id === itemId ? { ...o, status: o.status === 'DONE' ? 'IN_PROGRESS' : 'DONE' } : o);
      else if (type === 'action') {
        
        next.actions = next.actions.map((arr: MandalartItem[]) => arr.map((a: MandalartItem) => a.id === itemId ? { ...a, status: a.status === 'DONE' ? 'IN_PROGRESS' : 'DONE' } : a));
        
        const objectiveIndex = next.actions.findIndex(arr => arr.some(a => a.id === itemId));
        if (objectiveIndex >= 0) {
          const actionsArr = next.actions[objectiveIndex];
            if (actionsArr.length) {
              const allDone = actionsArr.every(a => a.status === 'DONE');
              const anyDone = actionsArr.some(a => a.status === 'DONE');
              const obj = next.objectives[objectiveIndex];
              if (obj) {
                const newObjStatus = allDone ? 'DONE' : (anyDone ? 'IN_PROGRESS' : 'IN_PROGRESS');
                obj.status = newObjStatus;
              }
            }
        }
      }
      
      if (next.objectives?.length) {
        const allObjectivesDone = next.objectives.every(o => o.status === 'DONE');
        next.subject.status = allObjectivesDone ? 'DONE' : 'IN_PROGRESS';
      }
      return next;
    });
    try {
      const before = mandalartRef.current; let oldStatus: string | undefined;
      if (before) {
        const flat = [before.subject, ...before.objectives, ...before.actions.flat()];
        const found = flat.find(i => i.id === itemId); oldStatus = found?.status;
      }
      const newStatus = oldStatus === 'DONE' ? 'IN_PROGRESS' : 'DONE';
  if (type === 'subject') await mandalartService.updateSubject(String(itemId), undefined, newStatus);
  else if (type === 'objective') await mandalartService.updateObjective(String(itemId), undefined, newStatus);
      else {
        
  await mandalartService.updateAction(String(itemId), undefined, newStatus);
        
        const after = mandalartRef.current; 
        const current = after || original; 
        if (current) {
          const objectiveIndex = current.actions.findIndex(arr => arr.some(a => a.id === itemId));
          if (objectiveIndex >= 0) {
            const actionsArr = current.actions[objectiveIndex];
            if (actionsArr.length) {
              const allDone = actionsArr.every(a => a.status === 'DONE');
              const obj = current.objectives[objectiveIndex];
              const desired = allDone ? 'DONE' : 'IN_PROGRESS';
              if (obj && obj.status !== desired) {
                try { await mandalartService.updateObjective(String(obj.id), undefined, desired); } catch {/* 조용히 무시 */}
              }
            }
          }
        }
      }
      
      try {
        const cur = mandalartRef.current;
        if (cur && cur.objectives?.length) {
          const allObjectivesDone = cur.objectives.every(o => o.status === 'DONE');
          const desiredSubj = allObjectivesDone ? 'DONE' : 'IN_PROGRESS';
          if (cur.subject.status !== desiredSubj) {
            await mandalartService.updateSubject(String(cur.subject.id), undefined, desiredSubj);
          }
        }
      } catch {/* ignore cascade error */}
      showSnackbar('상태가 업데이트되었습니다.', 'success');
    } catch { showSnackbar('상태 업데이트에 실패했습니다.', 'error'); if (original) setMandalart(original); }
  }, [setMandalart, showSnackbar]);

  const triggerAIGenerationForObjective = useCallback(async (itemId: number, objectiveName: string) => {
    const objectiveIndex = mandalart?.objectives.findIndex(o => o.id === itemId);
    if (objectiveIndex === undefined || objectiveIndex < 0) return;

    setLoadingObjectiveAI(objectiveIndex);
    try {
      const ai = await mandalartService.generateGeminiObjective(objectiveName);
      if (ai?.actions) {
        const updatedActs: { id: number; name: string }[] = [];
        let nextMandalart: MandalartDataRaw | null = null;

        setMandalart(prev => {
          if (!prev) return null;
          nextMandalart = JSON.parse(JSON.stringify(prev));
          const row = nextMandalart.actions[objectiveIndex];
          const aiActs = ai.actions.slice(0, row.length);
          aiActs.forEach((n: string, i: number) => {
            if (row[i]) {
              row[i].name = n;
              row[i].status = 'IN_PROGRESS';
              updatedActs.push({ id: row[i].id, name: n });
            }
          });
          return nextMandalart;
        });
        
        showSnackbar('AI 제안 적용 – 서버 병렬 업데이트...', 'info');
        if (updatedActs.length > 0) {
          const updatePromises = updatedActs.map(a =>
            mandalartService.updateAction(String(a.id), a.name, 'IN_PROGRESS').catch(() => {})
          );
          await Promise.all(updatePromises);
          showSnackbar('AI 제안이 서버에 저장되었습니다.', 'success');
        }
      } else {
        showSnackbar('AI 제안을 가져오지 못했습니다.', 'warning');
      }
    } catch (error) {
      showSnackbar('AI 제안 생성에 실패했습니다.', 'error');
    } finally {
      setLoadingObjectiveAI(null);
    }
  }, [mandalart, setMandalart, showSnackbar]);

  const triggerAIGenerationForSubject = useCallback(async (subjectName: string) => {
    setLoadingSubjectAI(true);
    try {
      const ai = await mandalartService.generateGeminiSubject(subjectName);
      if (ai?.objectives?.length && ai.actions?.length) {
        const updatedObjectives: { id: number; name: string }[] = [];
        const updatedActionItems: { id: number; name: string }[] = [];
        
        let nextMandalart: MandalartDataRaw | null = null;
        setMandalart(prev => {
          if (!prev) return null;
          nextMandalart = JSON.parse(JSON.stringify(prev));
          const maxObjectives = nextMandalart.objectives.length;
          const aiObjectives = ai.objectives.slice(0, maxObjectives);

          aiObjectives.forEach((name, i) => {
            if (nextMandalart.objectives[i] && name) {
              nextMandalart.objectives[i].name = name;
              nextMandalart.objectives[i].status = 'IN_PROGRESS';
              updatedObjectives.push({ id: nextMandalart.objectives[i].id, name });
            }
          });

          ai.actions.forEach((acts, oi) => {
            if (!nextMandalart.actions[oi]) return;
            const actRow = nextMandalart.actions[oi];
            const aiActs = acts.slice(0, actRow.length);
            aiActs.forEach((n, aiIdx) => {
              if (actRow[aiIdx] && n) {
                actRow[aiIdx].name = n;
                actRow[aiIdx].status = 'IN_PROGRESS';
                updatedActionItems.push({ id: actRow[aiIdx].id, name: n });
              }
            });
          });
          return nextMandalart;
        });

        if (updatedObjectives.length || updatedActionItems.length) {
          showSnackbar('AI 제안 적용 – 서버 병렬 업데이트...', 'info');
          const updatePromises = [
            ...updatedObjectives.map(obj =>
              mandalartService.updateObjective(String(obj.id), obj.name, 'IN_PROGRESS').catch(() => {})
            ),
            ...updatedActionItems.map(act =>
              mandalartService.updateAction(String(act.id), act.name, 'IN_PROGRESS').catch(() => {})
            )
          ];
          await Promise.all(updatePromises);
          showSnackbar('AI 제안이 모두 서버에 저장되었습니다.', 'success');
        } else {
          showSnackbar('AI 제안 결과와 기존 내용이 동일합니다.', 'info');
        }
      } else {
        showSnackbar('AI 제안을 가져오지 못했습니다.', 'warning');
      }
    } catch {
      showSnackbar('주제 AI 제안 실패', 'error');
    } finally {
      setLoadingSubjectAI(false);
    }
  }, [mandalart, setMandalart, showSnackbar]);

  const updateMandalartItemName = useCallback(async (itemId: number, type: 'subject' | 'objective' | 'action', newItemName: string) => {
    if (!mandalart) return;
    const original = JSON.parse(JSON.stringify(mandalart));

    setMandalart(prev => {
      if (!prev) return null;
      const next: MandalartDataRaw = JSON.parse(JSON.stringify(prev));
      if (type === 'subject' && next.subject.id === itemId) {
        next.subject.name = newItemName;
      } else if (type === 'objective') {
        next.objectives = next.objectives.map((o: MandalartItem) => o.id === itemId ? { ...o, name: newItemName } : o);
      } else if (type === 'action') {
        next.actions = next.actions.map((arr: MandalartItem[]) => arr.map((a: MandalartItem) => a.id === itemId ? { ...a, name: newItemName } : a));
      }
      return next;
    });

    try {
      if (type === 'subject') {
        await mandalartService.updateSubject(String(itemId), newItemName);
        showSnackbar('주제 이름이 업데이트되었습니다. AI 재생성을 시작합니다.', 'info');
        await triggerAIGenerationForSubject(newItemName);
      } else if (type === 'objective') {
        await mandalartService.updateObjective(String(itemId), newItemName);
        showSnackbar('목표 이름이 업데이트되었습니다. AI 재생성을 시작합니다.', 'info');
        await triggerAIGenerationForObjective(itemId, newItemName);
      } else {
        await mandalartService.updateAction(String(itemId), newItemName);
        showSnackbar('이름이 업데이트되었습니다.', 'success');
      }
    } catch {
      showSnackbar('이름 업데이트에 실패했습니다.', 'error');
      setMandalart(original); 
    }
  }, [mandalart, setMandalart, showSnackbar, triggerAIGenerationForSubject, triggerAIGenerationForObjective]);

  const handleDelete = useCallback(async () => {
    setOpenDeleteDialog(false); if (!id) return; setLoadingDelete(true);
    try { await mandalartService.deleteMandalart(id); showSnackbar('만다라트가 삭제되었습니다.', 'success'); navigate('/mandalart'); }
    catch { showSnackbar('만다라트 삭제에 실패했습니다.', 'error'); }
    finally { setLoadingDelete(false); }
  }, [id, navigate, showSnackbar]);

  
  const updateItemName = useCallback((itemId: number, type: 'subject' | 'objective' | 'action', newName: string) => {
    updateMandalartItemName(itemId, type, newName);
  }, [updateMandalartItemName]);

  const updateItemStatus = useCallback((itemId: number, type: 'subject' | 'objective' | 'action') => {
    updateMandalartItemStatus(itemId, type);
  }, [updateMandalartItemStatus]);

  const handleNameChange = useCallback(async () => {
    if (!id || !mandalart || editingList.value === mandalart.mandalart.name) { 
      setEditingList({ id:-1, type:null, value:'' }); 
      return; 
    }
    const originalName = mandalart.mandalart.name;
    setMandalart(prev => prev ? { ...prev, mandalart: { ...prev.mandalart, name: editingList.value } } : prev);
    setEditingList({ id:-1, type:null, value:'' });
    try { 
      await mandalartService.updateMandalartName(id, editingList.value); 
      showSnackbar('이름이 성공적으로 변경되었습니다.', 'success'); 
    }
    catch { 
      setMandalart(prev => prev ? { ...prev, mandalart: { ...prev.mandalart, name: originalName } } : prev); 
      showSnackbar('이름 변경에 실패했습니다.', 'error'); 
    }
  }, [id, mandalart, editingList.value, setMandalart, showSnackbar]);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress /></Box>;
  if (!mandalart) return <Typography>만다르트를 찾을 수 없습니다.</Typography>;

  return (
    <GlassPanel glow gradientBorder sx={{ p: { xs:2.4, sm:3.4 }, position: 'relative', mb:4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2, gap:2, flexWrap:'wrap' }}>
          <Box sx={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:.4, minWidth:0 }}>
            {editingList.type==='mandalart' ? (
              <TextField
                value={editingList.value}
                onChange={e=>setEditingList(s=>({...s, value:e.target.value}))}
                onBlur={()=>{
                  const v = editingList.value.trim();
                  if(v && v!==mandalart.mandalart.name) {
                    handleNameChange();
                  }
                  setEditingList({ id:-1, type:null, value:'' });
                }}
                onKeyDown={e=>{
                  if(e.key==='Enter'){ e.currentTarget.blur(); }
                  if(e.key==='Escape'){ setEditingList({ id:-1, type:null, value:'' }); }
                }}
                autoFocus
                variant="standard"
                inputProps={{ maxLength: 60 }}
                InputProps={{ disableUnderline:true, sx:{ typography:'h4', p:0, fontWeight:800 } }}
              />
            ) : (
              <Typography variant="h4" component="h1" sx={{ fontWeight:800, display:'flex', alignItems:'center', gap:.75 }}>
                {mandalart.mandalart.name}
                <IconButton size="small" aria-label="만다르트 이름 수정" onClick={()=> setEditingList({ id: -1, type:'mandalart', value: mandalart.mandalart.name })} sx={{ ml:.5 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Typography>
            )}
            {editingList.type==='mandalart' && (
              <Typography variant="caption" color="text.secondary" sx={{ opacity:0.7 }}>이전: {originalNameRef.current}</Typography>
            )}
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, flexWrap:'wrap' }}>
            <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(_,v)=>v && setViewMode(v)}>
            <ToggleButton value="grid">그리드</ToggleButton>
            <ToggleButton value="list">리스트</ToggleButton>
          </ToggleButtonGroup>
          <IconButton aria-label="delete" onClick={()=>setOpenDeleteDialog(true)} disabled={loadingDelete} color="error">{loadingDelete ? <CircularProgress size={22}/> : <DeleteIcon/>}</IconButton>
        </Box>
      </Box>

    {viewMode === 'grid' && (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <MandalartGrid
          data={mandalart}
          updateItemName={updateItemName}
          updateItemStatus={updateItemStatus}
          onCreateSubMandalart={handleCreateSubMandalart}
          loadingSubjectAI={false}
          loadingObjectiveAI={null}
          loadingSubMandalartAI={false}
          readOnly={false}
          visualMode='preview'
          shape='circle'
          perfMode={perf}
          showConnections={false}
        />
        {(loadingSubjectAI || loadingObjectiveAI!==null) && (
          <Box sx={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:30, backdropFilter:'blur(4px) saturate(1.2)', WebkitBackdropFilter:'blur(4px) saturate(1.2)', background:'transparent', borderRadius:2 }}>
            <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1.6 }}>
              <CircularProgress size={48} thickness={4} />
              <Typography variant='body2' sx={{ fontWeight:600, opacity:0.85 }}>
                {loadingSubjectAI ? '주제 변경 - 목표/행동 AI 재생성 중...' : '목표 변경 - 행동 AI 재생성 중...'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    )}
      {viewMode === 'list' && (
  <Paper variant="outlined" sx={{ p:{ xs:1.5, sm:2 }, borderRadius:3, bgcolor:'background.paper', '&:hover':{ boxShadow: (theme)=>theme.shadows[1] }, position:'relative' }}>
    {(loadingSubjectAI || loadingObjectiveAI!==null) && (
      <Box sx={{ position:'absolute', inset:0, zIndex:25, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(3px) saturate(1.15)', WebkitBackdropFilter:'blur(3px) saturate(1.15)', background:(t)=> t.palette.mode==='dark' ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.6)', borderRadius:3 }}>
        <Box sx={{ display:'flex', flexDirection:'column', gap:1.2, alignItems:'center' }}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant='caption' sx={{ fontWeight:600, opacity:0.85 }}>
            {loadingSubjectAI ? 'AI가 목표/행동을 재구성 중...' : '해당 목표의 행동을 재생성 중...'}
          </Typography>
        </Box>
      </Box>
    )}
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:1, mb:1.5, alignItems:'center' }}>
            <Chip size="small" clickable color={hideCompletedActions ? 'primary' : 'default'} variant={hideCompletedActions ? 'filled':'outlined'} label={hideCompletedActions ? '완료 숨김' : '완료 표시'} onClick={()=>setHideCompletedActions(v=>!v)} />
            <Chip size="small" variant="outlined" label="모두 접기" onClick={()=> setCollapsedObjectives(new Set(mandalart.objectives.map(o=>o.id)))} />
            <Chip size="small" variant="outlined" label="모두 펼치기" onClick={()=> setCollapsedObjectives(new Set())} />
          </Box>
          <List disablePadding sx={{ width:'100%', '& .tree-line': { position:'relative', '&::before': { content:'""', position:'absolute', left:18, top:0, bottom:4, width:2, background:'linear-gradient(to bottom, rgba(120,120,120,0.25), transparent 85%)' } } }}>
            {/* Subject (derived) */}
            <ListItem role="treeitem" aria-level={1} sx={{ alignItems:'flex-start', pb:1.4, borderBottom:'1px solid', borderColor:'divider', mb:1 }}>
              <ListItemText primary={<Box sx={{ display:'flex', alignItems:'center', gap:1, flexWrap:'wrap' }}>
                <Chip label={getStatusKorean(mandalart.subject.status)} size="small" sx={{ height:22, fontSize:12, bgcolor: mandalart.subject.status==='DONE' ? 'var(--status-done)' : 'var(--status-in-progress)', color:'#fff' }} />
                {editingList.type==='subject' && editingList.id===mandalart.subject.id ? (
                  <TextField
                    size="small"
                    value={editingList.value}
                    onChange={e=>setEditingList(s=>({...s, value:e.target.value}))}
                    onBlur={()=>{
                      const v = editingList.value.trim();
                      if(v && v!==resolveName(mandalart.subject)) {
                        updateMandalartItemName(mandalart.subject.id,'subject',v);
                      }
                        setEditingList({ id:-1, type:null, value:'' });
                    }}
                    onKeyDown={e=>{
                        if(e.key==='Enter'){ e.currentTarget.blur(); }
                        if(e.key==='Escape'){ setEditingList({ id:-1, type:null, value:'' }); }
                    }}
                    autoFocus
                    sx={{ minWidth:220 }}
                  />
                ) : (
                  <Typography variant="subtitle1" sx={{ fontWeight:700 }}>{resolveName(mandalart.subject)}</Typography>
                )}
                <IconButton size="small" aria-label="주제 편집" onClick={()=> setEditingList({ id: mandalart.subject.id, type:'subject', value: resolveName(mandalart.subject) })} >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" aria-label="주제 AI 제안" onClick={() => triggerAIGenerationForSubject(resolveName(mandalart.subject))} >
                  <AutoFixHighIcon fontSize="inherit" />
                </IconButton>
              </Box>} secondary={<Typography variant="caption" sx={{ opacity:0.6 }}>주제</Typography>} />
            </ListItem>
            {mandalart.objectives.map((obj, oi)=>{
              const actions = mandalart.actions[oi];
              const doneCnt = actions.filter(a=>a.status==='DONE').length;
              const allDone = doneCnt === actions.length && actions.length>0;
              const collapsed = collapsedObjectives.has(obj.id);
              const progressPct = actions.length ? Math.round((doneCnt / actions.length) * 100) : 0;
              return (
                <Box key={obj.id} className="tree-line" sx={{ pl:2.5, mb:1.4 }}>
                  <ListItem disablePadding sx={{ borderRadius:2 }} role="presentation">
                    <ListItemButton role="treeitem" aria-level={2} aria-expanded={!collapsed} onClick={(e)=>{ 
                      if((e.target as HTMLElement).closest('.obj-actions')) return; 
                      setCollapsedObjectives(s=>{ const n = new Set(s); n.has(obj.id)? n.delete(obj.id): n.add(obj.id); return n; });
                    }} sx={{ alignItems:'flex-start', py:0.6, pr:0.75, borderRadius:2, transition:'background-color .15s' }}>
                      <ListItemText primary={<Box sx={{ display:'flex', alignItems:'center', gap:1, width:'100%', flexWrap:'wrap' }}>
                        <Chip label={getStatusKorean(allDone ? 'DONE' : 'IN_PROGRESS')} size="small" sx={{ height:22, fontSize:12, bgcolor: allDone ? 'var(--status-done)' : 'var(--status-in-progress)', color:'#fff', opacity: loadingSubjectAI ? 0.4 : 1 }} />
                        {editingList.type==='objective' && editingList.id===obj.id ? (
                          <TextField
                            size="small"
                            value={editingList.value}
                            onChange={e=>setEditingList(s=>({...s, value:e.target.value}))}
                            onBlur={()=>{
                              const v = editingList.value.trim();
                              if(v && v!==resolveName(obj)) {
                                updateMandalartItemName(obj.id,'objective',v);
                              }
                                setEditingList({ id:-1, type:null, value:'' });
                            }}
                            onKeyDown={e=>{
                                if(e.key==='Enter'){ e.currentTarget.blur(); }
                                if(e.key==='Escape'){ setEditingList({ id:-1, type:null, value:'' }); }
                            }}
                            autoFocus
                            sx={{ minWidth:160 }}
                          />
                        ) : (
                          <Typography variant="subtitle1" sx={{ fontWeight:600, display:'flex', alignItems:'center', gap:.5 }}>
                            {loadingSubjectAI && <CircularProgress size={14} sx={{ mr:.25 }} />}
                            {resolveName(obj) || `목표 ${oi+1}`}
                          </Typography>
                        )}
                        {(editingList.type !== 'objective' && !loadingSubjectAI) && (
                          <IconButton size="small" aria-label="목표 편집" onClick={()=> setEditingList({ id: obj.id, type:'objective', value: resolveName(obj) })} className="obj-actions">
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        {!loadingSubjectAI && (
                          <IconButton size="small" aria-label="목표 AI 제안" onClick={() => triggerAIGenerationForObjective(obj.id, resolveName(obj))} className="obj-actions">
                            <AutoFixHighIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        {!loadingSubjectAI && (
                          <IconButton size="small" aria-label="서브 만다르트 생성" onClick={()=> handleCreateSubMandalart(obj.id,'objective', resolveName(obj) || `목표 ${oi+1}`)} className="obj-actions">
                            <AddIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        <Chip label={`${doneCnt}/${actions.length}`} size="small" variant={allDone?'filled':'outlined'} color={allDone?'success':'default'} sx={{ ml:0.5, height:22, fontSize:11 }} />
                        <Chip size="small" variant="outlined" label={`${progressPct}%`} sx={{ height:22, fontSize:11 }} />
                        <Box component="span" aria-hidden sx={{ ml:'auto', fontSize:12, opacity:0.55 }}>{collapsed ? '▶' : '▼'}</Box>
                      </Box>} secondary={<Typography variant="caption" sx={{ opacity:0.55 }}>목표 {oi+1}</Typography>} />
                    </ListItemButton>
                  </ListItem>
                  {!collapsed && (
                    <Box role="group" aria-label={`목표 ${oi+1} 행동`} sx={{ pl:5, pt:0.5, display:'flex', flexDirection:'column', gap:0.4 }}>
                      {actions.filter(a=> !hideCompletedActions || a.status!=='DONE').map((action, ai)=>{
                        const isEditing = editingList.type==='action' && editingList.id===action.id;
                        const actionLoading = loadingSubjectAI || loadingObjectiveAI === oi;
                        return (
                          <Box key={action.id} role="treeitem" aria-level={3} sx={{ display:'flex', alignItems:'flex-start', gap:1, pr:1.5, borderRadius:1.5, transition:'background-color .12s', '&:hover':{ bgcolor:'action.hover' } }}>
                            <Checkbox size="small" edge="start" sx={{ p:0.5 }} checked={action.status==='DONE'} onChange={()=>updateMandalartItemStatus(action.id,'action')} inputProps={{ 'aria-label': `행동 ${oi+1}.${ai+1}` }} />
                            {isEditing ? (
                              <TextField
                                size="small"
                                value={editingList.value}
                                onChange={e=>setEditingList(s=>({...s, value:e.target.value}))}
                                onBlur={()=>{
                                  const v=editingList.value.trim();
                                  if(v && v!==resolveName(action)) {
                                    updateMandalartItemName(action.id,'action',v);
                                  }
                                    setEditingList({ id:-1, type:null, value:'' });
                                }}
                                onKeyDown={e=>{
                                    if(e.key==='Enter'){ e.currentTarget.blur(); }
                                    if(e.key==='Escape'){ setEditingList({ id:-1, type:null, value:'' }); }
                                }}
                                autoFocus
                                fullWidth
                                sx={{ mt:-0.4 }}
                              />
                            ) : (
                              <Typography variant="body2" sx={{ flexGrow:1, lineHeight:1.3, textDecoration: action.status==='DONE' ? 'line-through':'none', opacity: action.status==='DONE'?0.38:1, fontWeight: action.status==='DONE'?500:400, display:'flex', alignItems:'center', gap:.5 }}>
                                {actionLoading && <CircularProgress size={14} />}
                                {oi+1}.{ai+1} {resolveName(action) || '행동'}
                              </Typography>
                            )}
                            {(!isEditing && !actionLoading) && (
                              <IconButton size="small" aria-label="행동 편집" onClick={()=> setEditingList({ id: action.id, type:'action', value: resolveName(action) })} >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                            )}
                            {!actionLoading && (
                              <IconButton size="small" aria-label="서브 만다르트 생성" onClick={()=> handleCreateSubMandalart(action.id,'action', resolveName(action) || `행동 ${oi+1}.${ai+1}`)} >
                                <AddIcon fontSize="inherit" />
                              </IconButton>
                            )}
                          </Box>
                        );
                      })}
                      {hideCompletedActions && doneCnt === actions.length && (
                        <Typography variant="caption" sx={{ pl:1, pt:0.25, opacity:0.55 }}>모든 행동 완료</Typography>
                      )}
                    </Box>
                  )}
                  <Box sx={{ pl:5, pr:3, mt:0.6 }} aria-hidden>
                    <Box sx={{ height:6, borderRadius:3, bgcolor:'action.hover', overflow:'hidden', position:'relative' }}>
                      <Box sx={{ position:'absolute', inset:0, width:`${progressPct}%`, bgcolor: allDone ? 'success.main' : 'primary.main', transition:'width .3s' }} />
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </List>
          <Box sx={{ mt:2, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:1 }}>
            <Typography variant="caption" color="text.secondary">주제/목표 상태는 행동 완료도 기반으로 자동 설정됩니다.</Typography>
            <Typography variant="caption" color="text.secondary">행동만 직접 체크 가능합니다.</Typography>
          </Box>
        </Paper>
      )}

      <Dialog open={openDeleteDialog} onClose={()=>setOpenDeleteDialog(false)}>
        <DialogTitle>만다르트 삭제 확인</DialogTitle>
        <DialogContent><DialogContentText>정말로 이 만다라트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDeleteDialog(false)} disabled={loadingDelete}>취소</Button>
          <Button onClick={handleDelete} autoFocus color="error" disabled={loadingDelete}>삭제</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSubDialog} onClose={()=>setOpenSubDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight:800, letterSpacing:'-0.5px' }}>서브 만다르트 생성</DialogTitle>
        <DialogContent sx={{ pb:2 }}>
          <Box sx={{ width:'100%', pt:0.5 }}>
            <Stepper activeStep={subStep} alternativeLabel sx={{ mb: { xs:3, sm:4 }, '& .MuiStepLabel-label': { typography:'caption' }, '& .MuiStepConnector-line': { minHeight:{ xs:12, sm:24 } } }}>
              <Step><StepLabel>기본 정보 입력</StepLabel></Step>
              <Step><StepLabel>만다르트 수정 및 저장</StepLabel></Step>
            </Stepper>
            {subStep===0 && (
              <GlassPanel gradientBorder glow sx={{ p:{ xs:3, sm:4 }, borderRadius:{ xs:4, sm:5 } }}>
                <TextField label="만다르트 이름" fullWidth value={subData?.mandalartName||''} onChange={e=>setSubData(p=>p?{...p, mandalartName:e.target.value}:null)} sx={{ mb:2 }} />
                <TextField label="이루고 싶은 주제" fullWidth value={subData?.subject||''} onChange={e=>setSubData(p=>p?{...p, subject:e.target.value}:null)} />
                <Box sx={{ display:'flex', justifyContent:{ xs:'center', sm:'flex-end' }, mt:3 }}>
                  <Button variant="contained" onClick={handleSubNext} disabled={loadingSubAI || !subData?.mandalartName || !subData?.subject} sx={{ py:{ xs:1.05, sm:0.8 }, minWidth:180 }}>
                    {loadingSubAI ? <CircularProgress size={24}/> : '초안 만들기'}
                  </Button>
                </Box>
              </GlassPanel>
            )}
            {subStep===1 && subData && (
              <GlassPanel gradientBorder glow sx={{ p:{ xs:2.4, sm:3.2 }, borderRadius:{ xs:4, sm:5 }, position:'relative', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position:'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                  <MandalartGrid
                    data={{
                      mandalart:{ id:0, name: subData.mandalartName, status:'IN_PROGRESS' },
                      subject:{ id:0, name: subData.subject, status:'IN_PROGRESS' },
                      objectives: subData.objectives.map((n,i)=>({ id:i, name:n, status:'IN_PROGRESS' })),
                      actions: subData.actions.map((arr,oi)=>arr.map((n,ai)=>({ id: oi*100+ai, name:n, status:'IN_PROGRESS' })))
                    }}
                    updateItemName={handleSubNameChange}
                    updateItemStatus={()=>{}}
                    loadingSubjectAI={loadingSubAI}
                    loadingObjectiveAI={null}
                    visualMode='preview'
                    shape='circle'
                    readOnly={false}
                    perfMode={perf}
                    showConnections={false}
                  />
                  {loadingSubAI && (
                    <Box sx={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, backdropFilter:'blur(4px) saturate(1.2)', WebkitBackdropFilter:'blur(4px) saturate(1.2)', background:(t)=> t.palette.mode==='dark' ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.55)', borderRadius:{ xs:4, sm:5 } }}>
                      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <CircularProgress size={42} thickness={4} />
                        <Typography variant='body2' sx={{ fontWeight:500, opacity:0.8 }}>AI 제안 생성 중...</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display:'flex', justifyContent:'center', mt:2.2, mb:2.4 }}>
                  <Button variant="outlined" onClick={handleSubRegenerate} disabled={loadingSubAI || !subData.subject} sx={{ mr:2 }}>
                    {loadingSubAI ? <CircularProgress size={20}/> : '전체 AI 제안 다시 받기'}
                  </Button>
                </Box>
                <Box sx={{ display:'flex', justifyContent:'center', mt:3.2 }}>
                  <Button variant="contained" color="primary" onClick={handleSubSave} disabled={loadingSubSave || loadingSubAI || !subData.mandalartName || !subData.subject} sx={{ py:{ xs:1.05, sm:0.95 }, minWidth:220 }}>
                    {loadingSubSave ? <CircularProgress size={24} color="inherit"/> : '서브 만다르트 생성하기'}
                  </Button>
                </Box>
              </GlassPanel>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {subStep===0 ? (
            <Button onClick={()=>setOpenSubDialog(false)}>닫기</Button>
          ) : (
            <>
              <Button onClick={()=>setSubStep(0)} disabled={loadingSubSave}>이전</Button>
              <Button onClick={()=>setOpenSubDialog(false)} disabled={loadingSubSave}>취소</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
  </GlassPanel>
  );
};

export default MandalartDetailPage;
