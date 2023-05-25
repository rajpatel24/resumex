import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import optionsOutline from '@iconify/icons-eva/options-outline';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Job Openings',
    path: '/dashboard/jobs/openings/',
    icon: getIcon(peopleFill)
  },

  // uncomment below code to show "schedule interview" page with calendar to choose slots.

  // {
  //   title: 'Schedule Interview',
  //   path: '/dashboard/interview/schedule/',
  //   icon: getIcon(fileTextFill)
  // },
  {
    title: 'Interview Details',
    path: '/dashboard/interview/details/',
    icon: getIcon(fileTextFill)
  },
  {
     title: 'Upload Documents',
     path: '/dashboard/upload/documents/',
     icon: getIcon(optionsOutline)
   }    
  // {
  //   title: 'Timeline',
  //   path: '/dashboard/timeline/',
  //   icon: getIcon(optionsOutline)
  // }  
];

export default sidebarConfig;