/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    useColorScheme,
    View as DefaultView,
  } from "react-native";
  
  import Colors from "./Colors";
  export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  ) {
    // const theme = useColorScheme() ?? "light";
    const theme = "light";
    const colorFromProps = props[theme];
  
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[theme][colorName];
    }
  }
  
  type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
    title?: boolean;
  };
  
  export type TextProps = ThemeProps & DefaultText["props"];
  export type ViewProps = ThemeProps & DefaultView["props"];
  
  export function Text(props: TextProps) {
    const { style, lightColor, darkColor, title, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
    return (
      <DefaultText
        style={[
          { color },
          title
            ? {
                fontSize: 20,
                fontWeight: "bold",
              }
            : null,
          style,
        ]}
        {...otherProps}
      />
    );
  }
  
  export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  