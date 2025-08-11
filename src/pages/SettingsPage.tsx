import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stack, Divider, Collapse } from '@mui/material';
import { useUserSettings } from '@/hooks/useUserSettings';
import NicknameChange from '@/components/settings/NicknameChange';
import PasswordChange from '@/components/settings/PasswordChange';
import AccountManagement from '@/components/settings/AccountManagement';
import SettingsListItem from '@/components/settings/SettingsListItem';

import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const SettingsPage: React.FC = () => {
    const userSettings = useUserSettings();
    const [open, setOpen] = useState<string | false>(false);

    const handleToggle = (panel: string) => (_event: React.MouseEvent) => {
        setOpen(open === panel ? false : panel);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 5 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    설정
                </Typography>
                <Paper variant="outlined" sx={{ borderRadius: 4 }}>
                    <Stack divider={<Divider />}>
                        <SettingsListItem 
                            title="닉네임 변경" 
                            icon={<EditIcon />} 
                            onClick={handleToggle('nickname')} 
                            open={open === 'nickname'} 
                        />
                        <Collapse in={open === 'nickname'} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, backgroundColor: '#f7f7f7' }}>
                                <NicknameChange {...userSettings} />
                            </Box>
                        </Collapse>

                        <SettingsListItem 
                            title="비밀번호 변경" 
                            icon={<LockResetIcon />} 
                            onClick={handleToggle('password')}
                            open={open === 'password'}
                        />
                        <Collapse in={open === 'password'} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, backgroundColor: '#f7f7f7' }}>
                                <PasswordChange {...userSettings} />
                            </Box>
                        </Collapse>

                        <SettingsListItem 
                            title="계정 관리" 
                            icon={<ManageAccountsIcon />} 
                            onClick={handleToggle('account')}
                            open={open === 'account'}
                        />
                        <Collapse in={open === 'account'} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, backgroundColor: '#f7f7f7' }}>
                                <AccountManagement {...userSettings} />
                            </Box>
                        </Collapse>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default SettingsPage;
