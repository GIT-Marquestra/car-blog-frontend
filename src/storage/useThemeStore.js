import { atom, selector, useRecoilState } from "recoil";

export const themeState = atom({
  key: "themeState", 
  default: localStorage.getItem("chat-theme") || "coffee", 
});

export function useTheme() { // at the end we will use this only 
  const [theme, setThemeState] = useRecoilState(themeState);

  const setTheme = (newTheme) => {
    localStorage.setItem("chat-theme", newTheme); 
    setThemeState(newTheme); 
  };
  return [ theme, setTheme ];
}