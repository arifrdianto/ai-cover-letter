"use client";

import * as React from "react";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import {
  FileIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileStatus = "uploading" | "complete" | "failed";

export interface FileItem {
  id: string;
  name: string;
  size: number;
  totalSize: number;
  progress: number;
  status: FileStatus;
  file: File;
}

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "defaultValue"
  > {
  value?: FileItem | null;
  onChange?: (file: FileItem | null) => void;
  onFileUpload?: (file: File) => Promise<boolean>;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      value,
      onChange,
      onFileUpload,
      disabled = false,
      accept,
      maxSize,
      className,
      ...props
    },
    ref
  ) => {
    const [file, setFile] = useState<FileItem | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => fileInputRef.current as HTMLInputElement);

    const isControlled = value !== undefined && onChange !== undefined;

    // Update internal state when controlled value changes
    React.useEffect(() => {
      if (isControlled && value !== file) {
        setFile(value);
      }
    }, [isControlled, value, file]);

    const updateFile = (newFile: FileItem | null) => {
      setFile(newFile);

      if (isControlled) {
        onChange(newFile);
      }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];

        // Check file size if maxSize is provided
        if (maxSize && selectedFile.size > maxSize) {
          // File is too large, handle this case
          console.error("File is too large");
          return;
        }

        const newFile: FileItem = {
          id: crypto.randomUUID(),
          name: selectedFile.name,
          size: 0,
          totalSize: selectedFile.size,
          progress: 0,
          status: "uploading",
          file: selectedFile,
        };

        // Update state with the new file
        updateFile(newFile);

        // Process the file
        if (onFileUpload) {
          try {
            const success = await onFileUpload(selectedFile);
            updateFile({
              ...newFile,
              progress: 100,
              size: selectedFile.size,
              status: success ? "complete" : "failed",
            });
          } catch {
            updateFile({
              ...newFile,
              progress: 100,
              size: 0,
              status: "failed",
            });
          }
        } else {
          // Use simulated upload if no handler provided
          simulateFileUpload(newFile);
        }
      }

      // Reset input value to allow selecting the same file again
      if (e.target) {
        e.target.value = "";
      }
    };

    const simulateFileUpload = (fileItem: FileItem) => {
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; // Faster progress for demo
        const newProgress = Math.min(progress, 100);
        const newSize = Math.floor((fileItem.totalSize * newProgress) / 100);

        if (newProgress >= 100) {
          clearInterval(interval);
          updateFile({
            ...fileItem,
            progress: 100,
            size: fileItem.totalSize,
            status: "complete", // Always complete for demo
          });
        } else {
          updateFile({
            ...fileItem,
            progress: newProgress,
            size: newSize,
          });
        }
      }, 300);
    };

    const handleRetry = () => {
      if (!file) return;

      const retryFile = {
        ...file,
        progress: 0,
        size: 0,
        status: "uploading" as FileStatus,
      };

      updateFile(retryFile);

      if (onFileUpload) {
        onFileUpload(file.file)
          .then((success) => {
            updateFile({
              ...retryFile,
              progress: 100,
              size: file.totalSize,
              status: success ? "complete" : "failed",
            });
          })
          .catch(() => {
            updateFile({
              ...retryFile,
              progress: 100,
              size: 0,
              status: "failed",
            });
          });
      } else {
        simulateFileUpload(retryFile);
      }
    };

    const handleDelete = () => {
      updateFile(null);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 KB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + " " + sizes[i]
      );
    };

    const getFileIcon = (fileName: string) => {
      const extension = fileName.split(".").pop()?.toLowerCase();

      // Return different colored box based on file type
      if (extension === "pdf") {
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-destructive text-destructive-foreground rounded">
            <span className="text-xs font-bold">PDF</span>
          </div>
        );
      } else if (["doc", "docx"].includes(extension || "")) {
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded">
            <span className="text-xs font-bold">DOC</span>
          </div>
        );
      } else if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded">
            <span className="text-xs font-bold">IMG</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center w-8 h-8 bg-muted text-muted-foreground rounded">
            <FileIcon className="h-4 w-4" />
          </div>
        );
      }
    };

    delete props.children;
    delete props.dangerouslySetInnerHTML;

    return (
      <div className={cn("w-full", className)}>
        <div className="border border-dashed border-input rounded-lg p-6">
          {file ? (
            <div className="space-y-4">
              <div
                className={cn(
                  "flex items-start justify-between p-4 rounded-lg",
                  file.status === "failed" && "bg-destructive/10"
                )}
              >
                <div className="flex items-start gap-3">
                  {getFileIcon(file.name)}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} of{" "}
                        {formatFileSize(file.totalSize)}
                      </p>
                      {file.status === "uploading" && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-muted-foreground/50"></span>
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                      {file.status === "complete" && (
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span className="text-sm">Complete</span>
                        </div>
                      )}
                      {file.status === "failed" && (
                        <div className="flex items-center gap-1 text-destructive">
                          <XCircleIcon className="h-4 w-4" />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                    </div>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} />
                    )}
                    {file.status === "complete" && <Progress value={100} />}
                    {file.status === "failed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10 -ml-2"
                        onClick={handleRetry}
                        disabled={disabled}
                        type="button"
                      >
                        Try again
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-muted-foreground"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    type="button"
                  >
                    Replace
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={handleDelete}
                    disabled={disabled}
                    type="button"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-muted p-3">
                <FileIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-sm font-medium">
                Drag and drop your file
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                or click to browse
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                type="button"
              >
                Browse files
              </Button>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            disabled={disabled}
            ref={fileInputRef}
            {...props}
          />
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
