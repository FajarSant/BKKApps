"use client";

import React, { useState, FormEvent } from "react";
import { AiOutlineEdit } from "react-icons/ai";
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type FormField = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

interface EditButtonProps<T extends Record<string, unknown>> {
  formFields: FormField[];
  onSubmit: (id: number, data: FormData) => void;
  buttonText?: string;
  editData: T & { id: number };
}

const EditButton = <T extends Record<string, unknown>>({
  formFields,
  onSubmit,
  buttonText = "Edit Data",
  editData,
}: EditButtonProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Map<string, string>>(new Map());

  const handleOpen = () => {
    // Initialize form with existing data
    const initialData = new Map<string, string>();
    
    formFields.forEach((field) => {
      const value = editData[field.name as keyof T];
      let stringValue = "";
      
      if (value !== null && value !== undefined) {
        if (field.type === "date" && value instanceof Date) {
          stringValue = value.toISOString().split("T")[0]; // Format date for input[type=date]
        } else if (field.type === "date" && typeof value === "string") {
          stringValue = value.split("T")[0]; // Format date string
        } else {
          stringValue = String(value);
        }
      }
      
      initialData.set(field.name, stringValue);
    });
    
    setFormData(initialData);
    setOpen(true);
  };

  const handleClose = () => {
    setErrors({});
    setFormData(new Map());
    setOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = new Map(prev);
      newData.set(name, value);
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = new Map(prev);
      newData.set(name, value);
      return newData;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors: { [key: string]: string } = {};

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

    onSubmit(editData.id, formDataToSubmit);
    handleClose();
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpen}
                aria-label="Edit"
              >
                <AiOutlineEdit className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        <DialogContent className="max-h-[600px] overflow-y-auto">
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Silakan edit detail yang diperlukan.
          </DialogDescription>

          <form onSubmit={handleSubmit}>
            {formFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-medium">{field.label}</label>

                {field.type === "select" ? (
                  <Select
                    value={formData.get(field.name) || ""}
                    onValueChange={(value) => handleSelectChange(field.name, value)}
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
                    required={field.required}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border rounded-md w-full"
                    value={formData.get(field.name) || ""}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
              >
                Batal
              </Button>
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