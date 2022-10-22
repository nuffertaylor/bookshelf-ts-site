import * as React from 'react';
import { createContext, FC, PropsWithChildren, useState } from 'react';
import { getCookie, setCookie } from './utils/utilities';

type ColorScheme = 'light' | 'dark' ;
type ColorSchemeProps = {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
};

const cookieColorScheme = getCookie("colorScheme");

export const ColorSchemeCtx = createContext<ColorSchemeProps>({
  colorScheme: "light",
  toggleColorScheme: () => {},
});



export const ColorSchemeCtxProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(cookieColorScheme ? cookieColorScheme === "light" ? "light" : "dark" : "light");
  function toggleColorScheme() {
    setColorScheme((s) => (s === 'dark' ? 'light' : 'dark'));
    setCookie("colorScheme", colorScheme === "dark" ? "light" : "dark");
  }
  return (
    <ColorSchemeCtx.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ColorSchemeCtx.Provider>
  );
};
