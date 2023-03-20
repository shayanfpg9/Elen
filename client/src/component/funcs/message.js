import Swal from "sweetalert2";

const Toast = Swal.mixin({
  background: "var(--color-fg)",
  color: "var(--color-text)",
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function message(title = "", text = "", icon = "success") {
  return Toast.fire({ ...{ title, icon }, html: text }); //send message faster...
}
