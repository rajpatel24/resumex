import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import calendarFill from '@iconify/icons-eva/calendar-fill';
import bookmarkFill from '@iconify/icons-eva/bookmark-fill';
import personDoneFill from '@iconify/icons-eva/person-done-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const EmployeeSidebarConfig = [
  {
    title: 'dashboard',
    path: '/employee-dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  // {
  //   title: 'Calendar',
  //   path: '/employee-dashboard/employee-calendar',
  //   icon: getIcon(calendarFill)
  // },
  {
    title: 'Booked Interviews',
    path: '/employee-dashboard/booked-interview',
    icon: getIcon(bookmarkFill)
  },
  {
    title: 'Completed Interviews',
    path: '/employee-dashboard/completed-interview',
    icon: getIcon(personDoneFill)
  },
  // {
  //   title: 'product',
  //   path: '/employee-dashboard/products',
  //   icon: getIcon(shoppingBagFill)
  // },
  // {
  //   title: 'blog',
  //   path: '/employee-dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // }
];

export default EmployeeSidebarConfig;
