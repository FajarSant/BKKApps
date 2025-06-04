"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => new Map(prev).set(name, value));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => new Map(prev).set(name, value));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors: { [key: string]: string } = {};

    formFields.forEach((field) => {
      const value = formData.get(field.name);
      if (field.required && !value) {
        formErrors[field.name] = `${field.label} harus diisi!`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const submittedData = new FormData();
    formData.forEach((value, key) => submittedData.append(key, value));

    onSubmit(submittedData);
    resetForm();
  };

  const resetForm = () => {
    setFormData(new Map());
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      {" "}
      <DialogTrigger asChild>
        <Button variant="default" size="sm" onClick={() => setOpen(true)}>
          <FaPlus className="w-4 h-4 mr-1" />
          {buttonText}
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
              <label htmlFor={field.name} className="block mb-1 font-medium">
                {field.label}
              </label>

              {field.type === "select" && field.options ? (
                <Select
                  value={formData.get(field.name) || ""}
                  onValueChange={(value) =>
                    handleSelectChange(field.name, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {formData.get(field.name)
                      ? field.options.find(
                          (opt) => opt.value === formData.get(field.name)
                        )?.label
                      : `Pilih ${field.label}`}
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="mt-2 w-full"
                  value={formData.get(field.name) || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="mt-2 w-full"
                  value={formData.get(field.name) || ""}
                  onChange={handleInputChange}
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
            <Button type="submit">{buttonText}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonTambah;
