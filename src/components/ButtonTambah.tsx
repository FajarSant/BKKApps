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
import { Button } from "@/components/ui/button";

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // Add options for select type
};

interface ButtonTambahProps {
  formFields: FormField[];
  onSubmit: (data: FormData) => void;
  buttonText?: string;
}

const ButtonTambah: React.FC<ButtonTambahProps> = ({
  formFields,
  onSubmit,
  buttonText = "Tambah Pengguna",
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Map<string, string>>(new Map());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({});
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newFormData = new Map(prevFormData);
      newFormData.set(name, value);
      return newFormData;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formErrors: { [key: string]: string } = {};

    formFields.forEach((field) => {
      const fieldValue = formData.get(field.name);
      if (field.required && !fieldValue) {
        formErrors[field.name] = `${field.label} harus diisi!`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formData.forEach((value, key) => {
      formDataToSubmit.append(key, value);
    });

    onSubmit(formDataToSubmit);
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

        <DialogContent className="max-h-[500px] overflow-y-auto">
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan masukkan detail pengguna baru di bawah ini.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block">{field.label}</label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData.get(field.name) || ""}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border rounded-md w-full"
                  >
                    <option value="">Pilih {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value} - {option.label} {/* Show both ID and company name */}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border rounded-md"
                    value={formData.get(field.name) || ""}
                    onChange={handleInputChange}
                  />
                )}

                {errors[field.name] && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors[field.name]}
                  </div>
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

export default ButtonTambah;
