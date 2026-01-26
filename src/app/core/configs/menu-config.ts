import { LucideIconData, PawPrint, User } from "lucide-angular";


export interface MenuItem {
  label: string;
  icon: LucideIconData;
  route: any;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Pets',
    icon: PawPrint,
    route: ['/shell/pets']
  },
  {
    label: 'Tutores',
    icon: User,
    route: ['/shell/tutors']
  }
];