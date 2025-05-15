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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

interface ButtonTambahProps {
  formFields: FormField[];
  onSubmit: (data: FormData) => void;
  buttonText?: string;
}

const ButtonTambah: React.FC<ButtonTambahProps> = ({
  formFields,
  onSubmit,
  buttonText = "Tambah Data",
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Map<string, string>>(new Map());

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({});
    setFormData(new Map());
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = new Map(prev);
      newData.set(name, value);
      return newData;
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

        <DialogContent className="max-h-[600px] overflow-y-auto">
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan isi detail yang diperlukan di bawah ini.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-medium">{field.label}</label>

                {field.type === "select" ? (
                  <Select
                    value={formData.get(field.name) || ""}
                    onValueChange={(value) => {
                      setFormData((prev) => {
                        const newData = new Map(prev);
                        newData.set(field.name, value);
                        return newData;
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <span>
                        {formData.get(field.name)
                          ? field.options?.find(
                              (opt) => opt.value === formData.get(field.name)
                            )?.label
                          : `Pilih ${field.label}`}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border rounded-md w-full"
                    value={formData.get(field.name) || ""}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border rounded-md w-full"
                    value={formData.get(field.name) || ""}
                    onChange={handleInputChange}
                    required
                  />
                )}

                {errors[field.name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[field.name]}
                  </p>
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
