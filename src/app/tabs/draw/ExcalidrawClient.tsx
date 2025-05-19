"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Excalidraw,
  exportToCanvas,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ExcalidrawWrapper: React.FC = () => {
  const [canvasUrl, setCanvasUrl] = useState("");
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const initialData = {
  appState: {
    exportWithDarkMode: false, 
  },
  elements: [],
};


  const handleExport = async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) return;

    const canvas = await exportToCanvas({
      elements,
      appState: {
        ...initialData.appState,
        exportWithDarkMode: false,
      },
      files: excalidrawAPI.getFiles(),
      getDimensions: () => ({ width: 350, height: 350 }),
    });

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "30px Virgil";
      // ctx.strokeText("My custom text", 50, 60);
    }

    setCanvasUrl(canvas.toDataURL());
  };

  return (
    <div className="">
      <Link href='/dashboard'><Button  className="absolute z-10 top-4 py-2 bg-red-400 left-22 hover:bg-red-500 duration-150 cursor-pointer"><span className="text-md">X</span> Cancel</Button></Link>
      <Dialog>
      <div className="h-screen">
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
          renderTopRightUI={() => {
          return (
            <DialogTrigger asChild>
              <Button
              className="py-2 bg-blue-500 text-white rounded"
              onClick={handleExport}
            >
              Export to Canvas
            </Button>
            </DialogTrigger>
            
          );
        }}
        />
      </div>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Exported View</DialogTitle>
          <DialogDescription>
            Click on the save button to save the draw.
          </DialogDescription>
        </DialogHeader>
        {canvasUrl && (
        <div className="rounded-lg border mx-4 flex items-center justify-center ">
          <img src={canvasUrl} alt="Exported drawing" />
        </div>
      )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="cursor-pointer">
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
