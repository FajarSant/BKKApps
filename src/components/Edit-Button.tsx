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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import select component
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
    options?: { value: string; label: string }[]; // Dropdown options
  }[];
  onSubmit: (id: number, data: FormData) => void;
  buttonText?: string;
  editData: { id: number; [key: string]: any }; // Tipe editData bisa disesuaikan
}

const EditButton: React.FC<EditButtonProps> = ({
  formFields,
  onSubmit,
  buttonText = "Edit Data",
  editData,
}) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(editData.id, formData); // Only send the id in formData
    setOpen(false); // Close modal after submit
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Trigger button for opening the modal */}
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

          {/* Form controlled by parent */}
          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block font-medium text-sm">
                  {field.label}
                </label>

                {/* Check if field has dropdown options */}
                {field.type === "select" ? (
                  <Select
                    name={field.name}
                    defaultValue={editData[field.name]?.toString()}
                  >
                    <SelectTrigger className="w-full p-2 bg-white border border-gray-300 rounded-md">
                      <span>{editData[field.name] || field.placeholder}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="p-2 hover:bg-gray-200"
                        >
                          {/* Display both id and namaperusahaan */}
                          {`${option.value} - ${option.label}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    defaultValue={editData[field.name] || ""}
                    placeholder={field.placeholder}
                    className="mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
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
