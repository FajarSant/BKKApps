"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";

// Tipe data perusahaan
interface Perusahaan {
  id: number;
  nama: string;
  email: string;
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
  onSubmit: (id: number, data: FormData) => void; // ✅ Sudah sesuai
  buttonText?: string;
  editData: Perusahaan; // editData sebaiknya wajib untuk kejelasan
}

const EditButton: React.FC<EditButtonProps> = ({
  formFields,
  onSubmit,
  buttonText = "Edit Data",
  editData,
}) => {
  const [open, setOpen] = useState<boolean>(false);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) =>
      formData.append(key, value)
    );

    onSubmit(editData.id, formData); // ✅ Kirim ID dan FormData
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleOpen}>
            <AiOutlineEdit className="h-5 w-5" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan edit detail yang diperlukan.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block font-medium">{field.label}</label>
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
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                {buttonText}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditButton;
