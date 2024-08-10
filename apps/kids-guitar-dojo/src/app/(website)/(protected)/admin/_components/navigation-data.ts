import { FolderIcon, GraduationCapIcon, HomeIcon, UsersIcon } from 'lucide-react';

export const NavigationData = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Courses', href: '/admin/courses', icon: FolderIcon, current: false },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, current: false },
  { name: 'Enrollment', href: '/admin/enrollment', icon: GraduationCapIcon, current: false },
];
