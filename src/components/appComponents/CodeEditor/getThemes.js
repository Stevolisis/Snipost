import { 
  abcdef, abyss, androidstudio, andromeda, atomone, basicDark, basicLight, 
  bbedit, bespin, consoleDark, consoleLight, dracula, eclipse, githubDark, githubLight,
  gruvboxDark, gruvboxLight, kimbie, red, solarizedDark, solarizedLight, 
  tokyoNight, tokyoNightDay, tomorrowNightBlue, vscodeDark, vscodeLight, 
  whiteDark, whiteLight, xcodeDark, xcodeLight 
} from "@uiw/codemirror-themes-all";

export const getThemes = (theme) => {
  switch (theme) {
    case "abcdef":
      return { theme: abcdef, color: "#0f0f0f" };
    case "abyss":
      return { theme: abyss, color: "#000c18" };
    case "android studio":
      return { theme: androidstudio, color: "#282b2e" };
    case "andromeda":
      return { theme: andromeda, color: "#23262e" };
    case "atom one":
      return { theme: atomone, color: "#272c35" };
    case "basic dark":
      return { theme: basicDark, color: "#2e3235" };
    case "basic light":
      return { theme: basicLight, color: "#f0f0f0" };
    case "bbedit":
      return { theme: bbedit, color: "#f0f0f0" };
    case "bespin":
      return { theme: bespin, color: "#28211c" };
    case "console dark":
      return { theme: consoleDark, color: "#000000" };
    case "console light":
      return { theme: consoleLight, color: "#f0f0f0" };
    case "dracula":
      return { theme: dracula, color: "#282a36" };
    case "eclipse":
      return { theme: eclipse, color: "#f0f0f0" };
    case "github dark":
      return { theme: githubDark, color: "#0d1117" };
    case "github light":
      return { theme: githubLight, color: "#f0f0f0" };
    case "gruvbox dark":
      return { theme: gruvboxDark, color: "#282828" };
    case "gruvbox light":
      return { theme: gruvboxLight, color: "#FCECAC" };
    case "kimbie":
      return { theme: kimbie, color: "#221a0f" };
    case "red":
      return { theme: red, color: "#390000" };
    case "solarized dark":
      return { theme: solarizedDark, color: "#000c18" };
    case "solarized light":
      return { theme: solarizedLight, color: "#F3E8CC" };
    case "tokyo-night":
      return { theme: tokyoNight, color: "#1a1b26" };
    case "tokyo-night-day":
      return { theme: tokyoNightDay, color: "#D8D9DF" };
    case "tomorrow-night-blue":
      return { theme: tomorrowNightBlue, color: "#000c18" };
    case "vscode dark":
      return { theme: vscodeDark, color: "#1e1e1e" };
    case "vscode light":
      return { theme: vscodeLight, color: "#f0f0f0" };
    case "white dark":
      return { theme: whiteDark, color: "#000000" };
    case "white light":
      return { theme: whiteLight, color: "#f0f0f0" };
    case "xcode dark":
      return { theme: xcodeDark, color: "#292a30" };
    case "xcode light":
      return { theme: xcodeLight, color: "#f0f0f0" };
    default:
      return { theme: dracula, color: "#000c18" }; // Default fallback theme
  }
};
