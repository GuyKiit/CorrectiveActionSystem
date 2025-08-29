import React, { useEffect, useState } from "react";
import qz from "qz-tray";
import QRCode from 'qrcode';
import { _POST } from "../../service/mas";
import { Typography } from "@mui/material";

export default function PrintReceiptButton() {

  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  
  const generateQR = async () => {
    setText("55555555555555555555555555")
    if (!text) return;

    try {
      // Generate QR code to data URL
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H', // High error correction for logo overlay
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrUrl(url);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };


  const handlePrint = async () => {
    try {
      const res = await fetch('http://localhost:3001/print'); // เรียก backend
      const data = await res.text();
      alert('พิมพ์สำเร็จ: ' + data);
    } catch (err) {
      alert('พิมพ์ไม่สำเร็จ');
      console.error(err);
    }
  };

  const launch_Edit = async () => {
    try {
      generateQR();
      if (qrUrl) {
        const printRes = await fetch('http://localhost:8081/api_print/api/print/usb-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            printerIp: "192.168.1.100",
            type_print: "USB",
            Message: "บริษัท บีทาเก้น จำกัด\n123 ถนนสุขุมวิท\nโทร 02-1234567\n\nขอบคุณค่ะ",
            Message5: "55555555555555555555555555555"
          })
        });

        const printText = await printRes.text();
        console.log("Print response:", printText);
      }

    } catch (printErr) {
      console.error("Print error:", printErr);
    }
  };

  // const printReceipt = async () => {
  //   try {
  //     // ถ้า connection ไม่ active ให้เชื่อมต่อใหม่
  //     if (!qz.websocket.isActive()) {
  //       console.log(5555555555555);

  //       await qz.websocket.connect({
  //         host: "localhost",
  //         ports: { insecure: [8182] },
  //         usingSecure: false,
  //       } as any);
  //     }

  //     const config = qz.configs.create("EPSON TM-T82 Receipt");
  //     const data = [
  //       "\x1B\x40",
  //       "\n",
  //       "ร้านของคุณ\n",
  //       "-------------------\n",
  //       "สินค้า x1   100.00 บาท\n",
  //       "-------------------\n",
  //       "รวม          100.00\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",
  //       "\n\nขอบคุณที่ใช้บริการ!\n",

  //       "\x1D\x56\x41" + "\x10",
  //     ];

  //     await qz.print(config, data);
  //     alert("✅ พิมพ์สำเร็จ");
  //   } catch (err) {
  //     console.error("❌ เกิดข้อผิดพลาดในการพิมพ์:", err);
  //     alert("❌ พิมพ์ไม่สำเร็จ");
  //   }
  // };

  return (
    <>
      <button onClick={launch_Edit} style={{ padding: 10, fontSize: 16 }}>
        🧾 พิมพ์ใบเสร็จ (QZ Tray)
      </button>
      <button onClick={generateQR} style={{ padding: 10, fontSize: 16 }}>
        generateQR
      </button>
      {/* <Typography variant="h4" component="h1" gutterBottom>
        {qrUrl}
      </Typography> */}

    </>

  );
}



