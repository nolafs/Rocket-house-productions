import { FolderIcon, HomeIcon, UsersIcon } from 'lucide-react';

export const NavigationData = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Users', href: '/admin/users', icon: UsersIcon, current: false },
  { name: 'Courses', href: '/admin/courses', icon: FolderIcon, current: false },
];
