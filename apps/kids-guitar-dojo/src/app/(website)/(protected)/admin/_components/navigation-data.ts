import { FolderIcon, GraduationCapIcon, HomeIcon, UsersIcon, ShieldIcon } from 'lucide-react';

export const NavigationData = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Courses', href: '/admin/courses', icon: FolderIcon, current: false },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, current: false },
  { name: 'Enrolment', href: '/admin/enrolment', icon: GraduationCapIcon, current: false },
  { name: 'Security', href: '/admin/security', icon: ShieldIcon, current: false },
];
