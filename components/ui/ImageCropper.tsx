"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageCropperProps {
  image: string | null;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  open,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5,
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
    );

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) resolve(file);
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
      );
      onCropComplete(croppedImage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none bg-white p-0 overflow-hidden rounded-[32px] shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-black text-slate-900">
            ปรับแต่งรูปภาพ
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px] w-full bg-slate-100 mt-4">
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteInternal}
              cropShape="round"
              showGrid={false}
              minZoom={1}
              maxZoom={3}
              zoomSpeed={0.1}
            />
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ZoomOut className="w-5 h-5 text-slate-400" />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
                className="flex-1"
              />
              <ZoomIn className="w-5 h-5 text-slate-400" />
            </div>

            <div className="flex items-center gap-4">
              <RotateCcw className="w-5 h-5 text-slate-400" />
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(val) => setRotation(val[0])}
                className="flex-1"
              />
              <span className="text-xs font-black text-slate-400 w-8">
                {rotation}°
              </span>
            </div>
          </div>

          <DialogFooter className="flex-row gap-3 sm:justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 sm:flex-none h-14 rounded-2xl font-black text-slate-500"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 sm:flex-none h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20"
            >
              ใช้เวฟฟี้ (บันทึก)
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
