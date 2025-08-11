import React from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select,} from '@mui/material';

interface LanguageSelectProps {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
                                                           language,
                                                           setLanguage,
                                                       }) => {
    return (
        <Box sx={{width: '100%'}}>
            <FormControl fullWidth required>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select labelId="language-select-label" id="language" value={language} label="Language"
                        onChange={(e) => setLanguage(e.target.value)}>
                    <MenuItem value="ko_KR">한국어</MenuItem>
                    <MenuItem value="en_US">English</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default LanguageSelect;
