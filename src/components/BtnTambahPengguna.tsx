"use client"
import React, { useState, FormEvent } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

interface BtnTambahPenggunaProps {
  formFields: FormField[];
  onSubmit: (data: FormData) => void;
  buttonText?: string;
}

const BtnTambahPengguna: React.FC<BtnTambahPenggunaProps> = ({
  formFields,
  onSubmit,
  buttonText = "Tambah Pengguna",
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" onClick={handleOpen}>
            <FaPlus className="w-4 h-4 mr-1" /> {buttonText}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan masukkan detail pengguna baru di bawah ini.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field, index: number) => (
              <div key={index} className="mb-4">
                <label className="block">{field.label}</label>
                <Input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="mt-2 p-2 border rounded-md"
                />
              </div>
            ))}
            <div className="mt-4 flex justify-end">
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

export default BtnTambahPengguna;
