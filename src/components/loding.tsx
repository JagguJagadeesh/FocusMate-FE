import { cn } from "@/lib/utils";
import { GraduationCapIcon } from "lucide-react";

export const Component = () => {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-violet-600"></div>
        {/* <img src={<GraduationCapIcon/>} className="rounded-full h-20 w-20" /> */}
        <GraduationCapIcon width={65} height={65}/>
      </div>
    </div>
  );
};
