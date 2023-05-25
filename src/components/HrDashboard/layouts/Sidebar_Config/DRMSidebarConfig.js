import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import baselineDocumentScanner from '@iconify/icons-ic/baseline-document-scanner';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import baselineArchive from '@iconify/icons-ic/baseline-archive';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const DRMSidebarConfig = [
  {
    title: 'dashboard',
    path: '/resumeX/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'DRM Requisition',
    path: '/resumeX/drm-requisition',
    icon: getIcon(fileTextFill),
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
    title: 'resume parser',
    path: '/resumeX/resume-parser',
    icon: getIcon(baselineDocumentScanner)
  }, 
];

export default DRMSidebarConfig;
