import { Icon } from '@iconify/react';
import pinFill from '@iconify/icons-eva/pin-fill';
import shakeFill from '@iconify/icons-eva/shake-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import funnelFill from '@iconify/icons-eva/funnel-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import baselineArchive from '@iconify/icons-ic/baseline-archive';
import outlineAttachFile from '@iconify/icons-ic/outline-attach-file';
import baselineLibraryAdd from '@iconify/icons-ic/baseline-library-add';
import personDoneFill from '@iconify/icons-eva/person-done-fill';
import baselineGroups from '@iconify/icons-ic/baseline-groups';
import layersFill from '@iconify/icons-eva/layers-fill';
import baselineSupervisedUserCircle from '@iconify/icons-ic/baseline-supervised-user-circle';
import baselineAdminPanelSettings from '@iconify/icons-ic/baseline-admin-panel-settings';
import baselineSettingsApplications from '@iconify/icons-ic/baseline-settings-applications';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

// Note: Below code has been moved to HrDashboardSidebar.js (To display count badge on sidebar icon)
// In case of any change in sidebar config, modify code at HrDashboardSidebar.js

const FSDAdminSidebarConfig = [
  {
    title: 'dashboard',
    path: '/resumeX/app',
    icon: getIcon(pieChart2Fill)
  },
  // {
  //   title: 'create jobs',
  //   path: '/resumeX/create-jobs',
  //   icon: getIcon(baselineLibraryAdd)
  // },
  {
    title: 'RRF templates',
    path: '/resumeX/rrf-templates',
    icon: getIcon(outlineAttachFile)
  },
  {
    title: 'Requisition Pool',
    path: '/resumeX/rrfpool',
    icon: getIcon(layersFill)
  },
  {
    title: 'requisition',
    path: '/resumeX/requisition',
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
    title: 'joinees',
    path: '/resumeX/joinees',
    icon: getIcon(personDoneFill)
  },
  {
    title: 'User',
    path: '/resumeX/users',
    icon: getIcon(baselineSupervisedUserCircle),
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
    icon: getIcon(baselineSettingsApplications)
  },
  {
    title: 'Roles',
    path: '/resumeX/roles',
    icon: getIcon(baselineAdminPanelSettings)
  },      
  {
    title: 'resume parser',
    path: '/resumeX/resume-parser',
    icon: getIcon(funnelFill)
  }, 
  {
    title: 'office location',
    path: '/resumeX/office-location',
    icon: getIcon(pinFill)
  },
  {
    title: 'technology',
    path: '/resumeX/technology',
    icon: getIcon(shakeFill)
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

export default FSDAdminSidebarConfig;
