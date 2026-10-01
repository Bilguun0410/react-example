import { cn } from "../../utils/cn";

export const Button = (props) => {
  return (
    <button
      {...props}
      className={cn(
        "bg-primary text-primary-foreground cursor-pointer hover:opacity-75 rounded px-3 transition-all duration-300 ease-in-out hover:scale-95",
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};
