import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: number;
  withText?: boolean;
  titleImage?: string;
  titleImageHeight?: number;
  showIcon?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 34, withText = true, titleImage, titleImageHeight, showIcon = true }) => {
  return (
    <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }} aria-label="Mandamong Home">
      {showIcon && (
        <Box
          component="img"
          src="/mandamong-logo.svg"
          alt="Mandamong Logo"
          width={size}
          height={size}
          sx={{ display: 'block', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        />
      )}
      {titleImage ? (
        <img src={titleImage} alt="Mandamong Title" style={{ height: titleImageHeight || size * 0.8 }} />
      ) : (
        withText && (
          <Box sx={{ fontWeight: 800, fontSize: { xs: '1.0rem', sm: '1.05rem' }, letterSpacing: '-0.02em' }}>만다몽</Box>
        )
      )}
    </Box>
  );
};

export default BrandLogo;
