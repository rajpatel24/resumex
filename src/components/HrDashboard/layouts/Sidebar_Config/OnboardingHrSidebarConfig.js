import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import personDoneFill from '@iconify/icons-eva/person-done-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const OnboardingHrSidebarConfig = [
  {
    title: 'dashboard',
    path: '/resumeX/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'joinees',
    path: '/resumeX/joinees',
    icon: getIcon(personDoneFill)
  }, 
];

export default OnboardingHrSidebarConfig;
