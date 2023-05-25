import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
// components
import Logo from '../../Logo';
import Scrollbar from '../../Scrollbar';
import NavSection from '../../NavSection';
import { MHidden } from '../../@material-extend';
//
import EmployeeSidebarConfig from './EmployeeSidebarConfig';
import account from '../../../_mocks_/account';
import UserInfo from '../../../utils/Authorization/UserInfo';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

EmployeeDashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function EmployeeDashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const userData = UserInfo();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/employee-dashboard/app" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
               {userData.first_name + " " + userData.last_name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary'}}>

                {/* {userData.role === 'NON_TECH_INTERVIEWER' ? 'Non-Tech Interviewer' : '' || userData.role === 'TECH_INTERVIEWER' ? 'Technical Interviewer' : ''} */}
                {
                  userData.role === 'NON_TECH_INTERVIEWER' ? 'Non-Tech Interviewer' : userData.role === 'TECH_INTERVIEWER' ? 'Technical Interviewer' : ''
                }
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      {(userData?.role === 'TECH_INTERVIEWER'  || userData?.role === 'NON_TECH_INTERVIEWER') &&
      <NavSection navConfig={EmployeeSidebarConfig} />} 

    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
