type TColors =
  | "black"
  | "green"
  | "red"
  | "yellow"
  | "blue"
  | "purple"
  | "cyan";

export const coloredText = ({ color, text }: { color: TColors; text: string }) => {
  const colors: Record<TColors, string> = {
    black: "0",
    red: "1",
    green: "2",
    yellow: "3",
    blue: "4",
    purple: "5",
    cyan: "6",
  };

  return `\x1b[3${colors[color]}m${text}\x1b[0m`;
};
