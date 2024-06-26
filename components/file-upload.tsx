'use client';

import CSVReader, { IFileInfo } from 'react-csv-reader';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';

interface ImageUploadProps {
  onChange?: any;
  onRemove: (value: any[]) => void;
  value: any[];
}

export default function FileUpload({
  onChange,
  onRemove,
  value
}: ImageUploadProps) {
  const onDeleteFile = (key: string) => {
    const files = value;
    let filteredFiles = files.filter((item) => item.key !== key);
    onRemove(filteredFiles);
  };

  const onFileLoaded = (
    data: any[],
    fileInfo: IFileInfo,
    originalFile?: File | undefined
  ) => {
    // TODO: verificar csv antes de passar para o onChange
    onChange(originalFile);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {!!value.length &&
          value?.map((item) => (
            <div
              key={item.key}
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  onClick={() => onDeleteFile(item.key)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Image
                  fill
                  className="object-cover"
                  alt="Image"
                  src={item.fileUrl || ''}
                />
              </div>
            </div>
          ))}
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <CSVReader
            parserOptions={{ header: true }}
            onFileLoaded={onFileLoaded}
          />
        </div>
      </div>
    </div>
  );
}
