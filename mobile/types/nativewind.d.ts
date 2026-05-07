import { ViewProps, TextProps, ImageProps, TouchableOpacityProps, SafeAreaViewProps } from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
}
