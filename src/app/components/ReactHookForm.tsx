"use client"
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface FileWithPreview extends File {
  preview: string;
}

export const ReactHookForm = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [rejected, setRejected] = useState<any[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    maxSize: 1024 * 1000,
    onDrop,
  });

  const removeFile = (name: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.name !== name)
    );
  };

  const removeRejected = (name: string) => {
    setRejected((currentFiles) =>
      currentFiles.filter(({ file }) => file.name !== name)
    );
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files?.length) {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      formData.append("upload_preset", ""); // Add your upload preset value
      // Perform your form submission or API request here
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {/* preview section */}
      <h3>accepted files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <Image
              src={file.preview}
              alt=""
              width={100}
              height={100}
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
            <span onClick={() => removeFile(file.name)}>Cross</span>
          </li>
        ))}
      </ul>
      {/* rejected section */}
      <h3>rejected files</h3>
      <ul className="mt-6 flex flex-col">
        {rejected.map(({ file, errors }) => (
          <li key={file.name} className="flex items-start justify-between">
            <div>
              <p className="mt-2 text-neutral-500 text-sm font-medium">
                {file.name}
              </p>
              <ul className="text-[12px] text-red-400">
                {errors.map((error: any) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
            <span onClick={() => removeRejected(file.name)}>Cross</span>
          </li>
        ))}
      </ul>
      <button type="submit">Submit</button>
    </form>
  );
};
