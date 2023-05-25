import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import baselineDocumentScanner from '@iconify/icons-ic/baseline-document-scanner';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import baselineArchive from '@iconify/icons-ic/baseline-archive';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const RMGSidebarConfig = [
  {
    title: 'dashboard',
    path: '/resumeX/app',
    icon: getIcon(pieChart2Fill)
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
    title: 'resume parser',
    path: '/resumeX/resume-parser',
    icon: getIcon(baselineDocumentScanner)
  }, 
];

export default RMGSidebarConfig;
