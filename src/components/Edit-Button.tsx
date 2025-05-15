"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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

interface EditButtonProps {
  formFields: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
  onSubmit: (id: number, data: FormData) => void;
  buttonText?: string;
  editData: { id: number; [key: string]: any };
}

const EditButton: React.FC<EditButtonProps> = ({
  formFields,
  onSubmit,
  buttonText = "Edit Data",
  editData,
}) => {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      formFields.map((f) => {
        let value = editData[f.name];
        if (f.type === "date" && value) {
          value = new Date(value).toISOString().split("T")[0]; // Format date
        }
        return [f.name, value?.toString() || ""]; // Set default value
      })
    )
  );

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });
    onSubmit(editData.id, formData); // Submit with id and formData
    setOpen(false); // Close modal after submit
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
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

        <DialogContent className="max-h-[500px] overflow-y-auto">
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

                {field.type === "select" ? (
                  <Select
                    value={formValues[field.name] || ""}
                    onValueChange={(value) =>
                      handleInputChange(field.name, value)
                    }
                  >
                    <SelectTrigger className="w-full p-2 border rounded-md">
                      {field.options?.find(
                        (opt) => opt.value === formValues[field.name]
                      )?.label || field.placeholder}
                    </SelectTrigger>

                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (  // Check if field is textarea
                  <Textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formValues[field.name] || ""} // Use formValues for value
                    onChange={(e) => handleInputChange(field.name, e.target.value)} // Handle change
                    className="mt-2 p-2 border rounded-md w-full"
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    value={formValues[field.name] || ""} // Use formValues for value
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border rounded-md w-full"
                  />
                )}
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
