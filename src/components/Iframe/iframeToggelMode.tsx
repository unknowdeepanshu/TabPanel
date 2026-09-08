import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTheme } from "@/store/iframeDarkmode/darkmodeSlice";

import { useAppDispatch } from "@/store/hook";
export function IframeMode() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="flex gap-1 p-1 border rounded-4xl w-fit border-foreground">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setTheme("system"))}
        >
          <Monitor />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setTheme("light"))}
        >
          <Sun />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setTheme("dark"))}
        >
          <Moon />
        </Button>
      </div>
    </>
  );
}
