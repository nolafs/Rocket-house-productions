'use client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { saveAs } from 'file-saver';
import axios from 'axios';

interface ButtonDownloadPdfProps {
  url: string;
  filename: string;
  label?: string;
}

export function ButtonDownloadPdf({ url, filename, label = 'Download' }: ButtonDownloadPdfProps) {
  const onHandleClick = async () => {
    const response = await axios.post(
      `/api/download`,
      {
        url: url,
        filename: filename,
      },
      {
        responseType: 'blob',
      },
    );

    filename = encodeURIComponent(filename.trim().replace(/\s+/g, '-'));

    saveAs(response.data, `${filename}.pdf`);
  };

  return (
    <Button variant={'default'} size={'sm'} onClick={onHandleClick}>
      {label}
    </Button>
  );
}

export default ButtonDownloadPdf;
