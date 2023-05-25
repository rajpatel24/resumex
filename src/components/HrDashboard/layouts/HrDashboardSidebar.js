import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
// components
import Logo from '../../../components/Logo';
import Scrollbar from '../../Scrollbar';
import NavSection from '../../../components/NavSection';
import { MHidden } from '../../@material-extend';
//
// import FSDAdminSidebarConfig from './Sidebar_Config/FSDAdminSidebarConfig';
import OnboardingHrSidebarConfig from './Sidebar_Config/OnboardingHrSidebarConfig';
import BUHeadSideBarConfig from './Sidebar_Config/BUHeadSideBarConfig';
import DRMSidebarConfig from './Sidebar_Config/DRMSidebarConfig';
import FSD_HODSidebarConfig from './Sidebar_Config/FSD_HODSidebarConfig';
import RMGSidebarConfig from './Sidebar_Config/RMGSidebarConfig'
import account from '../../../_mocks_/account';
import UserInfo from 'src/utils/Authorization/UserInfo';

import { useSnackbar } from 'notistack'
import { apiInstance } from 'src/utils/apiAuth';

//------------ imports for sidebar ----------------------------------

import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import baselineDocumentScanner from '@iconify/icons-ic/baseline-document-scanner';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import baselineArchive from '@iconify/icons-ic/baseline-archive';
import sharpTopic from '@iconify/icons-ic/sharp-topic';
import layersFill from '@iconify/icons-eva/layers-fill';
import personDoneFill from '@iconify/icons-eva/person-done-fill';
import baselinePermContactCalendar from '@iconify/icons-ic/baseline-perm-contact-calendar';
import baselineAdminPanelSettings from '@iconify/icons-ic/baseline-admin-panel-settings';
import baselineManageAccounts from '@iconify/icons-ic/baseline-manage-accounts';
import Badge from '@mui/material/Badge';
import LayersIcon from '@mui/icons-material/Layers';

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

HrDashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export default function HrDashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const userInfo = UserInfo()
  let user_roles = JSON.parse(localStorage.getItem("user"))

  const { enqueueSnackbar } = useSnackbar();
  const [requisitionData, setRequisitionData] = useState([])

  const getRequisitionData = () => {
      apiInstance({
          method: "get",
          url: "requisitions/",
          headers: {
              Authorization: "token " + localStorage.getItem("authToken"),
          }
      })
          .then(function (response) {
              setRequisitionData(response.data.data)
          })
          .catch(function (error) {
              enqueueSnackbar('Something went wrong. Please try after sometime.', {
                  anchorOrigin: {
                      vertical: 'top',
                      horizontal: 'right',
                  },
                  variant: 'error',
                  autoHideDuration: 2000,
              });
          });
  }

  // count unassigned RRFs to dsplay number on an icon badge
  const filterRequisitionData = requisitionData.map((item) => { if(item?.assigned_fsd_user?.length === 0){ return(item) } })
  const unAssignedReqData = filterRequisitionData.filter(function (el) { return el != null; });
  const rrf_pool_length = unAssignedReqData.length

  useEffect(() => {
    getRequisitionData();
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  // -------------------------- FSD Admin Sidebar Config (Moved here from FSDAdminSidebarConfig.js) --------------------------

  const FSDAdminSidebarConfig = [
    {
      title: 'dashboard',
      path: '/resumeX/app',
      icon: getIcon(pieChart2Fill)
    },
    {
      title: 'RRF templates',
      path: '/resumeX/rrf-templates',
      icon: getIcon(sharpTopic)
    },
    {
      title: 'Requisition Pool',
      path: '/resumeX/rrfpool',
      icon: <Badge badgeContent={rrf_pool_length} color="primary"><LayersIcon color="action" /></Badge>
      
    },
    {
      title: 'Requisition',
      // path: '/resumeX/requisition',
      icon: getIcon(fileTextFill),
      children: [{
          title: 'My Requisitions',
          path: '/resumeX/myrequisition',
          icon: getIcon(fileTextFill)
        },
        {
          title: 'Other Requisitions',
          path: '/resumeX/otherrequisition'
        }]
    },
    {
      title: 'job applications',
      path: '/resumeX/job-application',
      icon: getIcon(baselineArchive)
    },  
    {
      title: 'candidates',
      path: '/resumeX/candidates',
      icon: getIcon(peopleFill)
    },
    {
      title: 'Joinees',
      path: '/resumeX/joinees',
      icon: getIcon(personDoneFill)
    },
    {
      title: 'Users',
      // path: '/resumeX/users',
      icon: getIcon(baselinePermContactCalendar),
      children: [{
          title: 'FSD Members',
          path: '/resumeX/fsdusers',
          icon: getIcon(fileTextFill)
        },
        {
          title: 'Employees',
          path: '/resumeX/empusers'
        }]
    }, 
    {
      title: 'Master Roles',
      path: '/resumeX/master-roles',
      icon: getIcon(baselineManageAccounts)
    },
    {
      title: 'Roles',
      path: '/resumeX/roles',
      icon: getIcon(baselineAdminPanelSettings)
    },      
    {
      title: 'resume parser',
      path: '/resumeX/resume-parser',
      icon: getIcon(baselineDocumentScanner)
    },
    {
      title: 'Master Tables',
      icon: getIcon(layersFill),
      children: [
        {
          title: 'Business Unit',
          path: '/resumeX/business-units',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Currency',
          path: '/resumeX/currency',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Candidate Source',
          path: '/resumeX/candidate-source',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Candidate Status',
          path: '/resumeX/candidate-status',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Educational Degree',
          path: '/resumeX/education-degree',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Notice Period',
          path: '/resumeX/notice-period',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Office Location',
          path: '/resumeX/office-location',
          // icon: getIcon(pinFill)
        },
        {
          title: 'Requisition Status',
          path: '/resumeX/requisition-status',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Requisition Type',
          path: '/resumeX/requisition-types',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'TechStack',
          path: '/resumeX/tech-stack',
          // icon: getIcon(shakeFill)
        },
        {
          title: 'Technology',
          path: '/resumeX/technology',
          // icon: getIcon(shakeFill)
        },
        // {
        //   title: 'TechStack Technology',
        //   path: '/resumeX/techstack-technologies',
        //   // icon: getIcon(shakeFill)
        // },
      ]
    },  
    // {
    //   title: 'DRM Requisition',
    //   path: '/resumeX/drm-requisition',
    //   icon: getIcon(fileTextFill),
    // },
    // {
    //   title: 'product',
    //   path: '/resumeX/products',
    //   icon: getIcon(shoppingBagFill)
    // },
    // {
    //   title: 'blog',
    //   path: '/resumeX/blog',
    //   icon: getIcon(fileTextFill)
    // }
  ];

  // -------------------------------------------------------------------------------------

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/resumeX/app" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
               {userInfo.first_name + " " + userInfo.last_name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               {userInfo.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      {userInfo?.role === 'FSD_Admin' &&
      <NavSection navConfig={FSDAdminSidebarConfig} />} 

      {userInfo?.role === 'BU_HEAD' &&
      <NavSection navConfig={BUHeadSideBarConfig} />} 

      {userInfo?.role === 'DRM' &&
      <NavSection navConfig={DRMSidebarConfig} />} 

      {userInfo?.role === 'FSD_HOD' &&
      <NavSection navConfig={FSD_HODSidebarConfig} />} 

      {userInfo?.role === 'RMG' &&
      <NavSection navConfig={RMGSidebarConfig} />} 

      {userInfo?.role === 'OnBoarding_HR' &&
      <NavSection navConfig={OnboardingHrSidebarConfig} />} 
    
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
