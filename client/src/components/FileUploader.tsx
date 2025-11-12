import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface UploadedFile {
  name: string;
  uploadURL: string;
  size: number;
}

interface FileUploaderProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export function FileUploader({
  onFilesUploaded,
  uploadedFiles,
  onRemoveFile,
  maxFiles = 5,
  maxFileSize = 104857600,
  allowedFileTypes = ['.step', '.stp', '.stl', '.dxf', '.dwg'],
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can only upload up to ${maxFiles} files`,
        variant: "destructive",
      });
      return;
    }

    for (const file of fileArray) {
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Maximum file size is ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`,
          variant: "destructive",
        });
        return;
      }

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Allowed: ${allowedFileTypes.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);
    try {
      const newUploadedFiles: UploadedFile[] = [];

      for (const file of fileArray) {
        const uploadData = await apiRequest<{ uploadURL: string; objectPath: string }>("POST", "/api/objects/upload");
        const { uploadURL, objectPath } = uploadData;
        
        const response = await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        newUploadedFiles.push({
          name: file.name,
          uploadURL: objectPath,
          size: file.size,
        });
      }

      onFilesUploaded(newUploadedFiles);
      toast({
        title: "Upload Successful",
        description: `${newUploadedFiles.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload files.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        toast({
          title: "Upload Failed",
          description: (error as Error).message || "Failed to upload files",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedFileTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="absolute w-0 h-0 opacity-0 overflow-hidden"
        style={{ position: 'absolute', left: '-9999px' }}
        data-testid="input-file-hidden"
      />

      <label
        htmlFor="file-input"
        className="block border-2 border-dashed rounded-lg p-12 text-center hover-elevate active-elevate-2 cursor-pointer transition-all"
        onClick={() => fileInputRef.current?.click()}
        data-testid="dropzone-cad-files"
      >
        {uploading ? (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-lg font-medium mb-2">Uploading files...</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Click to upload CAD files</p>
            <p className="text-sm text-muted-foreground">
              STEP, STL, DXF, DWG files supported (Max 100MB each, up to {maxFiles} files)
            </p>
          </>
        )}
      </label>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-md"
              data-testid={`file-uploaded-${index}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveFile(index)}
                disabled={uploading}
                data-testid={`button-remove-file-${index}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
