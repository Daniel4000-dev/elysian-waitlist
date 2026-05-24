import { ThemeMode } from "@/enums/brand.enum";

export interface BaseSectionProps {
  currentScrollProgress: number;
  themeMode: ThemeMode;
  isActive: boolean;
}

export interface HeroSectionProps extends BaseSectionProps {
  headlineText?: string;
  subheadlineText?: string;
}
