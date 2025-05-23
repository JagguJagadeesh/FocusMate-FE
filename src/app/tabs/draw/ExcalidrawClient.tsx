"use client";

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
// import { NonDeleted, ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

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
    const width = x2 - x1 + 100; // Padding
    const height = y2 - y1 + 100;

    const canvas = await exportToCanvas({
      elements,
      appState: {
        ...initialData.appState,
        exportWithDarkMode: false,
        viewBackgroundColor: "#ffffff", // optional
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
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="">
      <Link href="/dashboard/notes">
        <Button className="absolute z-10 top-4 py-2 left-22 hover:border duration-150 cursor-pointer">
          <ArrowLeftFromLine />
        </Button>
      </Link>
      <Dialog>
        <div className="h-screen">
          <Excalidraw
            initialData={initialData}
            excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
            renderTopRightUI={() => (
              <DialogTrigger asChild>
                <Button
                  className="py-2 bg-blue-500 text-white rounded"
                  onClick={handleExport}
                >
                  Export as Image
                </Button>
              </DialogTrigger>
            )}
          />
        </div>
        <DialogContent>
          {canvasUrl && (
            <div className="rounded-lg border mx-4 flex items-center justify-center">
              <img src={canvasUrl} alt="Exported drawing" />
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <Label>Title:</Label>
              <Input
                onBlur={(e) => setNoteTitle(e.target.value)}
                type="text"
                placeholder="Title of note"
              />
            </div>
            <div className="flex gap-2">
              <Textarea
                onBlur={(e) => setNoteDes(e.target.value)}
                placeholder="Describe about note"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-4">
            <DialogClose asChild>
              <Button className="cursor-pointer" onClick={handleSave}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExcalidrawWrapper;
