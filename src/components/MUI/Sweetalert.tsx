
import Swal from "sweetalert2";

interface FullSweetalert {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";
}

export default function FullSweetalert({ title, text, icon }: FullSweetalert) {
  Swal.fire({
    title: title,
    html: text,
    icon: icon,
    confirmButtonText: 'ตกลง',
    confirmButtonColor: "#3085d6"
  })
  return null
}
