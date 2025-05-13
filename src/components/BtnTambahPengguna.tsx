"use client";
import React, { useState, FormEvent } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean; // Add required field to FormField type
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // Reset errors and form fields when closing modal
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let formErrors: { [key: string]: string } = {};

    // Validate each form field
    formFields.forEach((field) => {
      const fieldValue = formData.get(field.name);
      if (field.required && !fieldValue) {
        formErrors[field.name] = `${field.label} harus diisi!`;
      }
    });

    // If there are errors, set them and don't submit
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // If no errors, call onSubmit function to process the form data
    onSubmit(formData);

    // Close the modal after form submission and reset errors
    handleClose();
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
                {/* Show error message if there's an error for this field */}
                {errors[field.name] && (
                  <div className="text-red-600 text-sm mt-1">{errors[field.name]}</div>
                )}
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
