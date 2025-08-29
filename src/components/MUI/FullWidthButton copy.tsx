import React, { useState, ChangeEvent } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
  initialValue?: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  initialValue = '',
  size = 200,
}) => {
  const [text, setText] = useState<string>(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="พิมพ์ข้อความหรือ URL"
        style={{
          width: 300,
          padding: 10,
          fontSize: 16,
          marginBottom: 20,
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />
      <div>
        <QRCodeCanvas value={text} size={size} />
      </div>
    </div>
  );
};

export default QRCodeGenerator;