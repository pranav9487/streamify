import React from "react";
import { Library, Palette, PaletteIcon } from "lucide-react";
import { THEMES } from "../constants/index.js";
import { useThemeStore } from "../store/useThemeStore.js";
const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end ">
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <Palette className="size-5" />
      </button>
      <div
        tabIndex={0}
        className="dropdown-content menu mt-2 p-1 shadow-2xl bg-base-200 
         backdrop-blur-lg w-56 max-h-80 border border-base-content/10 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
              ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-content/5"
              }
              `}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="font-medium ">{themeOption.label}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto gap-1 flex">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
