import React, {useState, useCallback} from 'react'
import {FileWithPath,useDropzone} from 'react-dropzone'

import { Button } from '../ui/button'
type fileUploaderType = {
    fieldChange:(FILES : File[]) => void,
    mediaUrl: string
}


const FileUploader = ({fieldChange , mediaUrl} :fileUploaderType) => {
    const [file , setFile] = useState<File[]>([]);
    const [fileUrl , setFileUr] = useState(mediaUrl);

    const onDrop = useCallback((acceptedFiles : FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUr(URL.createObjectURL(acceptedFiles[0]))
      }, [file])
      const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept:{
           'image/*':['.png' , '.jpeg' , '.jpg' , '.svg'] 
        }
      })

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
          <input {...getInputProps()} className='cursor-pointer'/>
          {
            fileUrl ?
            (
                <>
                    <div className='flex flex-1 justify-center w-full p-5'>
                    <img 
                        src={fileUrl} 
                        alt="File_Viewer"
                        className='file_uploader-img' />
                    </div>
                    <p className='file_uploader-label'>Click or Drag to Replace</p>
                </>
            ):
            (
                <div className='file_uploader-box'>
                   <img 
                    src="/assets/icons/file-upload.svg" 
                    alt="file-uploader" 
                    width={96}
                    height={77}/>
                    <h2>Drag 'n' drop some files here, or click to select files</h2>
                    <p className='text-light-4'>JPG,SVG,JPEG,PNG</p>

                    <Button className='mt-4 shad-button_dark_4'>Select from Computer</Button>
                </div>
            )
          }
        </div>
      )
}

export default FileUploader