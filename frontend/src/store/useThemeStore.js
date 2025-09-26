import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Streamify-theme") || "forest",
  setTheme:(theme) =>{
    set({theme});
    localStorage.setItem("Streamify-theme",theme)

  }
}))