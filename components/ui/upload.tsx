"use client";

import * as React from "react";
import { UploadCloud, CheckCircle, AlertCircle, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import Progress component or use the one from shadcn/ui
import { Progress } from "@/components/ui/progress";

// File status types
type FileStatus = "uploading" | "complete" | "failed";

// File info interface for tracking upload state
interface FileInfo {
  file: File;
  id: string;
  progress: number;
  status: FileStatus;
  uploaded: number;
}

// Internal FileUploadResult component
function FileUploadResult({
  fileName,
  fileSize,
  totalSize,
  status,
  progress,
  onRetry,
  onDelete,
  className,
}: {
  fileName: string;
  fileSize: number;
  totalSize: number;
  status: FileStatus;
  progress: number;
  onRetry?: () => void;
  onDelete?: () => void;
  className?: string;
}) {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  const isComplete = status === "complete";
  const isFailed = status === "failed";

  return (
    <div
      className={cn(
        "border rounded-md p-3 mb-2",
        isFailed ? "border-destructive bg-destructive/5" : "border-border",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-muted rounded">
          <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded">
            <span className="text-[10px] font-bold uppercase">
              {fileExtension}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Delete file</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {fileSize} KB of {totalSize} KB
            </span>

            {isComplete && (
              <div className="flex items-center gap-2">
                |
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Complete
                </span>
              </div>
            )}
            {isFailed && (
              <div className="flex items-center gap-2">
                |
                <span className="flex items-center text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Failed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {status === "uploading" && (
        <div className="mt-2">
          <Progress value={progress} />
        </div>
      )}

      {isFailed && (
        <Button
          variant="link"
          size="sm"
          className="mt-1 h-auto p-0 text-destructive"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
}

// Main FileUpload component
interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  description?: string;
  onUpload?: (files: File[]) => Promise<void> | void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  className?: string;
  showUploadResults?: boolean;
}

const FileUpload = React.forwardRef<
  HTMLInputElement,
  Omit<FileUploadProps, "value" | "defaultValue">
>(
  (
    {
      description = "Drag and drop files here or click to browse",
      onUpload,
      maxFiles = 1,
      maxSize = 5 * 1024 * 1024, // 5MB default
      accept,
      className,
      showUploadResults = true,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const [fileInfos, setFileInfos] = React.useState<FileInfo[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Create an internal ref if no ref is forwarded
    const internalRef = React.useRef<HTMLInputElement>(null);
    // Use the forwarded ref if available, otherwise use internal ref
    const fileRef = (forwardedRef ||
      internalRef) as React.RefObject<HTMLInputElement>;

    const simulateUpload = async (fileInfo: FileInfo) => {
      // This is a simulation - replace with actual upload logic
      const totalSteps = 10;
      const increment = 100 / totalSteps;

      // Simulate random success/failure (90% success rate)
      const willSucceed = Math.random() > 0.1;

      for (let i = 0; i < totalSteps; i++) {
        if (!willSucceed && i > totalSteps / 2) {
          // Simulate failure midway
          setFileInfos((current) =>
            current.map((info) =>
              info.id === fileInfo.id
                ? {
                    ...info,
                    status: "failed",
                    progress: Math.floor(increment * i),
                  }
                : info
            )
          );
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 200));

        setFileInfos((current) =>
          current.map((info) =>
            info.id === fileInfo.id
              ? {
                  ...info,
                  progress: Math.min(Math.floor(increment * (i + 1)), 100),
                  uploaded: Math.floor(
                    ((info.file.size / 1024) * (increment * (i + 1))) / 100
                  ),
                }
              : info
          )
        );
      }

      // Mark as complete
      setFileInfos((current) =>
        current.map((info) =>
          info.id === fileInfo.id
            ? {
                ...info,
                status: "complete",
                progress: 100,
                uploaded: Math.floor(info.file.size / 1024),
              }
            : info
        )
      );
    };

    const handleFileChange = (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      setError(null);

      // Check number of files
      if (selectedFiles.length + fileInfos.length > maxFiles) {
        setError(
          `You can only upload up to ${maxFiles} file${
            maxFiles === 1 ? "" : "s"
          }`
        );
        return;
      }

      // Check file size and prepare file infos
      const newFileInfos: FileInfo[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.size > maxSize) {
          setError(
            `File "${file.name}" exceeds the maximum size of ${Math.round(
              maxSize / 1024 / 1024
            )}MB`
          );
          return;
        }

        const fileInfo: FileInfo = {
          file,
          id: `${file.name}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          progress: 0,
          status: "uploading",
          uploaded: 0,
        };

        newFileInfos.push(fileInfo);
      }

      setFileInfos((prev) => [...prev, ...newFileInfos]);

      // Call onUpload if provided
      if (onUpload) {
        onUpload(newFileInfos.map((info) => info.file));
      }

      // Simulate upload for each file
      newFileInfos.forEach((fileInfo) => {
        simulateUpload(fileInfo);
      });

      // Trigger onChange if provided
      if (onChange) {
        onChange({
          target: {
            files: selectedFiles,
          } as EventTarget & HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFileChange(droppedFiles);
    };

    const handleClick = React.useCallback(() => {
      if (fileRef.current) {
        fileRef.current.click();
      }
    }, [fileRef]);

    const removeFile = (id: string) => {
      setFileInfos((prev) => {
        const updatedFileInfos = prev.filter((info) => info.id !== id);

        // Create a new DataTransfer object to build a new FileList
        const dataTransfer = new DataTransfer();

        // Add remaining files to the DataTransfer object
        updatedFileInfos.forEach((info) => {
          dataTransfer.items.add(info.file);
        });

        // Trigger onChange with the updated FileList if provided
        if (onChange) {
          onChange({
            target: {
              files: dataTransfer.files,
            } as EventTarget & HTMLInputElement,
          } as React.ChangeEvent<HTMLInputElement>);
        }

        return updatedFileInfos;
      });
    };

    const retryUpload = (id: string) => {
      setFileInfos((prev) =>
        prev.map((info) =>
          info.id === id
            ? { ...info, status: "uploading", progress: 0, uploaded: 0 }
            : info
        )
      );

      const fileInfo = fileInfos.find((info) => info.id === id);
      if (fileInfo) {
        simulateUpload({
          ...fileInfo,
          status: "uploading",
          progress: 0,
          uploaded: 0,
        });
      }
    };

    // Render different UI based on whether it's in a form context
    const renderUploadArea = () => (
      <div
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/25",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-center mb-1">{description}</p>
        <p className="text-xs text-center text-muted-foreground mb-4">
          {maxFiles > 1 ? `Up to ${maxFiles} files` : "One file"}, max{" "}
          {Math.round(maxSize / 1024 / 1024)}MB each
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleClick}
          className="mt-2"
        >
          Browse
        </Button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          multiple={maxFiles > 1}
          accept={accept}
          id={props.id}
          name={props.name}
          disabled={props.disabled}
          aria-label={props["aria-label"]}
        />
      </div>
    );

    const renderFileResults = () => (
      <div className="mt-4 space-y-2">
        {fileInfos.map((fileInfo) => (
          <FileUploadResult
            key={fileInfo.id}
            fileName={fileInfo.file.name}
            fileSize={fileInfo.uploaded}
            totalSize={Math.floor(fileInfo.file.size / 1024)}
            status={fileInfo.status}
            progress={fileInfo.progress}
            onRetry={() => retryUpload(fileInfo.id)}
            onDelete={() => removeFile(fileInfo.id)}
          />
        ))}
      </div>
    );

    return (
      <div className="flex flex-col gap-4">
        {(fileInfos.length === 0 ||
          (maxFiles > 1 && fileInfos.length < maxFiles)) &&
          renderUploadArea()}
        {showUploadResults && fileInfos.length > 0 && renderFileResults()}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
