import dayjs from "dayjs";

export function _formatNumber(input: any) {
  const value = String(input).replace(/[^0-9.-]/g, "");
  const number = Number(value);
  if (!isNaN(number)) {
    const formattedNumber = number.toFixed(2);
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
  } else {
    return "";
  }
}

export function _formatNumberNotdecimal(input: any) {
  const value = String(input).replace(/[^0-9.]/g, "");
  const number = parseFloat(value);
  if (!isNaN(number)) {
    return number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else {
    return "";
  }
}

export function removeCommas(input: any) {
  if (typeof input === 'string') {
    // ใช้ replace() เพื่อลบเครื่องหมายจุลภาค (,) ทั้งหมดออกจากข้อความ
    return input.replace(/,/g, "");
  } else {
    return input;
  }

}

export function stringWithCommas(input: any) {
  const stringWithoutCommas = input.replace(/,/g, ""); // Remove commas
  const numberValue = parseInt(stringWithoutCommas, 10);
  if (!isNaN(numberValue)) {
    // Format the number with commas
    return numberValue;
  } else {
    // If the input is not a valid number, clear the input field
    return "";
  }
}


export const dateFormatSlashReturnMUI = (date: any) => {
  // data DD/MM/YYYY
  if (date == null) {
    return null;
  }
  try {
    const newdate = dayjs(date, "DD/MM/YYYY");
    return newdate;
  } catch {
    return null;
  }
}

export function formatThaiPhone(value: string) {
  if (!value) return value; 
  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export function formatThaiCitizenId(input: string) {
  // Remove all non-digit characters
  input = input.replace(/\D/g, ""); 
  // Format according to the pattern 1-6206-00114-34-4
  if (input.length <= 1) {
    return input;
  } else if (input.length <= 5) {
    return `${input.slice(0, 1)}-${input.slice(1, 5)}`;
  } else if (input.length <= 10) {
    return `${input.slice(0, 1)}-${input.slice(1, 5)}-${input.slice(5, 10)}`;
  } else if (input.length <= 12) {
    return `${input.slice(0, 1)}-${input.slice(1, 5)}-${input.slice(5, 10)}-${input.slice(10, 12)}`;
  } else {
    return `${input.slice(0, 1)}-${input.slice(1, 5)}-${input.slice(5, 10)}-${input.slice(10, 12)}-${input.slice(12, 13)}`;
  }
}

export function formatReturn(inputValue: any) {
  // Remove non-numeric characters
  if (inputValue == "") {
    return "";
  }
  const value = inputValue.replace(/-/g, "");
  return value;
}

export function conCatDateTime(
    due_date?: dayjs.Dayjs | null,
    due_time?: dayjs.Dayjs | null):dayjs.Dayjs | null {

    if (!due_date) return null;  // ถ้าไม่มีวันที่ คืน null
    if (!due_time) return due_date; // ถ้าไม่มีเวลา คืนวันที่เฉย ๆ

    return due_date.hour(due_time.hour()).minute(due_time.minute()).second(due_time.second());
}

export const fetchIpAddress = async (): Promise<string> => {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });

    pc.createDataChannel("");

    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(() => resolve(""));

    pc.onicecandidate = (event) => {
      if (!event?.candidate) return;

      const candidateStr = event.candidate.candidate;
      console.log("Candidate:", candidateStr);

      if (candidateStr.includes("typ host")) {
        const ipMatch = candidateStr.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        console.log(ipMatch ,'ipMatchipMatchipMatch')
        if (ipMatch) {
          const ip = ipMatch[1];
          console.log("✅ Local IPv4:", ip);
          resolve(ip);
          pc.close();
        }
      }
    };

    setTimeout(() => {
      resolve("");
      pc.close();
    }, 3000);
  });
};