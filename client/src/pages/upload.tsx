import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const uploadMutation = useMutation<{ reportId: string }, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest("POST", "/api/reports/upload", formData);
      return response as { reportId: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", data.reportId] });
      setFiles([]);
      toast({
        title: "Upload successful!",
        description: "Your health report is being analyzed by AI. This may take a few moments...",
      });
      
      setTimeout(() => {
        setLocation(`/report/${data.reportId}`);
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF or image file.`,
          variant: "destructive",
        });
      } else if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    const file = files[0];
    uploadMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upload Your Health Report</h1>
          <p className="text-lg text-muted-foreground">
            Upload your blood test results or health documents to get AI-powered insights and personalized recommendations
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div
            {...getRootProps()}
            className={`min-h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover-elevate"
            }`}
            data-testid="dropzone-upload"
          >
            <input {...getInputProps()} />
            <Upload className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? "Drop your file here" : "Drag & drop your health report"}
            </h3>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, PNG, JPG (max 10MB)
            </p>
          </div>
        </Card>

        {files.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Selected Files</h3>
            {files.map((file, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-12 w-12 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" data-testid={`text-filename-${index}`}>
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    data-testid={`button-remove-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleUpload}
            disabled={files.length === 0 || uploadMutation.isPending}
            className="px-8"
            data-testid="button-upload"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading & Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload & Analyze Report
              </>
            )}
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">1. Upload Document</h3>
            <p className="text-sm text-muted-foreground">
              Upload your health reports, blood tests, or medical documents
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">2. AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your health data and extracts key biomarkers
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">3. Get Insights</h3>
            <p className="text-sm text-muted-foreground">
              Receive personalized health insights and lifestyle recommendations
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
