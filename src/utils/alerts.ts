import Swal from "sweetalert2";

export const showSuccess = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#16a34a", 
  });
};

export const showError = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: "#dc2626", 
  });
};
