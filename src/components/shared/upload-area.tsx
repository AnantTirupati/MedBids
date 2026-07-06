"use client";

import * as React from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onFileSelect?: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function UploadArea({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ["image/jpeg", "image/png", "application/pdf"],
  className,
}: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    // Validate type
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith(".pdf")) {
      setError("Unsupported file format. Please upload JPG, PNG or PDF.");
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-card bg-[#111827] cursor-pointer select-none transition-all duration-150 min-h-[220px]",
          isDragActive
            ? "border-primary bg-primary-container/5"
            : "border-outline-variant hover:border-outline",
          selectedFile ? "border-solid border-primary bg-[#122131]/20" : "",
          className
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedTypes.join(",")}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary">
              <File className="w-6 h-6" />
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface line-clamp-1 max-w-[280px]">
                {selectedFile.name}
              </p>
              <p className="text-body-sm text-on-surface-variant">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <p className="text-label-md text-primary font-semibold uppercase tracking-wider">
              Click to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface">
                Drag and drop your prescription here
              </p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Supports JPG, PNG or PDF (Max {maxSizeMB}MB)
              </p>
            </div>
            <span className="btn-secondary h-10 px-4 py-2 text-label-md flex items-center mt-2">
              Browse Files
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-error-container/30 bg-error-container/5 text-error text-body-sm mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default UploadArea;
