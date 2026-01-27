import { LucideIconData } from "lucide-angular";

export interface BreadcrumbConfig { 
  breadcrumbs: Breadcrumb[];
  button?: BreadcrumbButton;
}

interface Breadcrumb {
  label: string;
  link?: string;
}

interface BreadcrumbButton {
  icon?: LucideIconData;
  link: string;
  label: string;
}