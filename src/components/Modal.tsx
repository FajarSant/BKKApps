"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";

export default function Modal() {
  const { isOpen, onClose } = useModal();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleImport = () => {
    if (!file) {
      alert("Silakan pilih file Excel terlebih dahulu.");
      return;
    }
    console.log("Importing file:", file.name);
    alert(`Mengimpor file: ${file.name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Data dari Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
