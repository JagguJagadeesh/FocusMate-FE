'use client';

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Excalidraw,
  exportToCanvas,
  getCommonBounds,
  getNonDeletedElements,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createNote } from "@/services/userService";
import useUserStore from "@/stores/useUserStore";
import { ArrowLeftFromLine } from "lucide-react";
import { toast } from "sonner";

const ExcalidrawWrapper: React.FC = () => {
  const user = useUserStore((s) => s.user);

  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [canvasUrl, setCanvasUrl] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDes, setNoteDes] = useState("");

  const initialData = {
    appState: {
      exportWithDarkMode: false,
    },
    elements: [],
  };

  const handleExport = async () => {
    if (!excalidrawAPI) return;

    const elements = getNonDeletedElements(excalidrawAPI.getSceneElements());
    if (!elements || elements.length === 0) return;

    const [x1, y1, x2, y2] = getCommonBounds(elements);
    const width = x2 - x1 + 100;
    const height = y2 - y1 + 100;

    const canvas = await exportToCanvas({
      elements,
      appState: {
        ...initialData.appState,
        exportWithDarkMode: false,
        viewBackgroundColor: "#ffffff",
      },
      files: excalidrawAPI.getFiles(),
      getDimensions: () => ({
        width,
        height,
      }),
    });

    setCanvasUrl(canvas.toDataURL());
  };

  const handleSave = async () => {
    try {
      const res = await createNote({
        ownerID: user.id,
        title: noteTitle,
        description: noteDes,
        imgData: canvasUrl,
      });
      // console.log(res);
      toast.success("Note Added...")
    } catch (e) {
      toast.success("Error addig Note!")
      console.log(e);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Responsive Header Buttons */}
      <div className="absolute bottom-18 right-4 z-20 flex gap-4 flex-wrap">
        <Link href="/dashboard/notes">
          <Button
            size="icon"
            className="p-2 border bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeftFromLine className="h-5 w-5" />
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleExport}
              className="text-sm sm:text-base px-4 py-2 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            >
              Export as Image
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-2xl p-4 sm:p-6 rounded-2xl shadow-lg">
            {/* Preview Image */}
            {canvasUrl && (
              <div className="rounded-lg border overflow-hidden max-h-[300px] flex justify-center items-center">
                <img
                  src={canvasUrl}
                  alt="Exported drawing"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Input Fields */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  onBlur={(e) => setNoteTitle(e.target.value)}
                  placeholder="Enter note title"
                  className="px-4 py-2 rounded-md border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="desc" className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  rows={3}
                  onBlur={(e) => setNoteDes(e.target.value)}
                  placeholder="Write something about this note"
                  className="px-4 py-2 rounded-md border bg-background shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Buttons */}
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost" className="px-4 py-2">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition"
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

      {/* Full Canvas */}
      <div className="h-full w-full">
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
        />
      </div>
    </div>
  );
};

export default ExcalidrawWrapper;
