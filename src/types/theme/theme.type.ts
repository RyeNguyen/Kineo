import type layout from '@/config/theme/layout';
import type { Backgrounds } from './backgrounds.type';
import type { Borders } from './borders.type';
import type { Colors } from './colors.type';
import type { Variant } from './config.type';
import type { Fonts } from './fonts.type';
import type { Gutters } from './gutters.type';
import type { Theme as NavigationTheme } from '@react-navigation/native';
import type componentGenerators from '@/config/theme/components';

export type Theme = {
  backgrounds: Backgrounds;
  borders: Borders;
  colors: Colors;
  components: ReturnType<typeof componentGenerators>;
  fonts: Fonts;
  gutters: Gutters;
  layout: typeof layout;
  navigationTheme: NavigationTheme;
  variant: Variant;
};

export type ComponentTheme = Omit<Theme, 'components' | 'navigationTheme'>;
