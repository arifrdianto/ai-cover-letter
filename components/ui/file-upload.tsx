"use client";

import * as React from "react";
import { forwardRef, memo, useImperativeHandle, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FileUploadChangeHandler = (files: FileList | null) => void;

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  onChange?: FileUploadChangeHandler;
  value?: File | FileList | null;
}

const FileUpload = memo(
  forwardRef<HTMLInputElement, FileUploadProps>(
    (
      { disabled = false, accept, className, onChange, value, ...props },
      ref
    ) => {
      const [dragActive, setDragActive] = useState(false);
      const inputRef = useRef<HTMLInputElement>(null);

      useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onChange) {
          onChange(e.target.files);
        }
      };

      const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
        } else if (e.type === "dragleave") {
          setDragActive(false);
        }
      };

      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          if (onChange) {
            onChange(e.dataTransfer.files);
          }
        }
      };

      // Get filename to display if a file is selected
      const getFileName = () => {
        if (!value) return null;
        if (value instanceof File) return value.name;
        if (value instanceof FileList && value.length > 0) return value[0].name;
        return null;
      };

      const fileName = getFileName();

      return (
        <div className={cn("w-full", className)}>
          <div
            className={`border border-dashed border-input rounded-lg p-2 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }
                ${props["aria-invalid"] ? "border-red-500 bg-red-50" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mb-4 rounded-full bg-muted p-3">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>

              {fileName ? (
                <div className="mb-4 text-center">
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                </div>
              ) : (
                <>
                  <h3 className="mb-1 text-sm font-medium">
                    Drag and drop your file
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  if (inputRef?.current) {
                    inputRef.current.click();
                  }
                }}
                disabled={disabled}
                type="button"
              >
                {fileName ? "Change file" : "Browse files"}
              </Button>
            </div>

            <input
              type="file"
              className="hidden"
              accept={accept}
              disabled={disabled}
              ref={inputRef}
              onChange={handleChange}
              {...props}
            />
          </div>
        </div>
      );
    }
  )
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
