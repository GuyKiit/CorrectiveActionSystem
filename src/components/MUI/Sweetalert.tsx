import Swal from "sweetalert2";

interface FullSweetalertProps {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";

  // optional fields (ใช้เฉพาะบางเคส เช่น Reject)
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;

  // รองรับ options เสริม
  options?: any;
}

export default function FullSweetalert(props: FullSweetalertProps) {
  const { title, text, icon, options, ...rest } = props;

  return Swal.fire({
    title,
    html: text,
    icon,
    confirmButtonText: "ตกลง", // ✅ ค่า default เป็น ตกลง
    confirmButtonColor: "#3085d6",
    cancelButtonText: "ยกเลิก", // ค่า default สำหรับ Cancel
    cancelButtonColor: "#FF0000",
    heightAuto: false,
    backdrop: true,
    customClass: {
      container: "swal-top-zindex",
    },
    ...rest,    // merge props ที่ส่งเข้ามา
    ...options, // merge options ถ้ามี
  });
}