"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Perusahaan {
  id: number;
  nama: string;
  email: string;
  gambar?: string;
  telepon?: string;
  alamat: string;
  deskripsi?: string;
}

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

interface EditButtonProps {
  formFields: FormField[];
  onSubmit: (id: number, data: FormData) => void;
  buttonText?: string;
  editData: Perusahaan;
}

const EditButton: React.FC<EditButtonProps> = ({
  formFields,
  onSubmit,
  buttonText = "Edit Data",
  editData,
}) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editData) {
      setFormValues({
        nama: editData.nama ?? "",
        email: editData.email ?? "",
        telepon: editData.telepon ?? "",
        alamat: editData.alamat ?? "",
        deskripsi: editData.deskripsi ?? "",
      });
    }
  }, [editData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) =>
      formData.append(key, value)
    );
    onSubmit(editData.id, formData);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* ⛔ Jangan letakkan DialogTrigger di dalam TooltipTrigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Edit"
            >
              <AiOutlineEdit className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan edit detail yang diperlukan.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block font-medium text-sm">
                  {field.label}
                </label>
                <Input
                  type={field.type || "text"}
                  name={field.name}
                  value={formValues[field.name] || ""}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className="mt-2"
                  required
                />
              </div>
            ))}

            <div className="mt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default EditButton;
