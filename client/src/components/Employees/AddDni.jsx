import React from 'react'
import Dropzone from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react";
import axios from 'axios';
import Loading from '../Loading/Loading';

const AddDni = ({chooseImage}) => {

    const [image, setImage] = useState("")
    const [load, setLoad] = useState("")

    const handleDropImage = (files) => {
        setLoad(true)
        const uploaders = files.map((file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('tags', `codeinfuse, medium, gist`);
          formData.append('upload_preset', 'App-Cars');
          formData.append('api_key', '687985773113572');
          formData.append('timestamp', Date.now() / 1000 / 0);
         
          return axios
            .post('https://api.cloudinary.com/v1_1/dgheotuij/image/upload', formData, {
              headers: { 'X-Requested-With': 'XMLHttpRequest' },
            })
            .then((res) => {
              const data = res.data;
              const fileURL = data.secure_url;
              console.log(fileURL);
              chooseImage(fileURL) 
              setImage(fileURL)
              setLoad(false)
            });
        });
      };


  return (
    <div>
        <div>
                        <Dropzone onDrop={handleDropImage}>
                          {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: 'dropzone' })}>
                                   <input {...getInputProps()} />
                                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-2 py-2" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}>
                                        <div className="text-center">
                                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                         <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                              <label
                                                  htmlFor="file-upload"
                                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-green-800 focus-within:outline-none  "
                                                  >
                                                  <span>Upload a file</span>
                                               <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                           </label>
                                            </div>
                                        </div>
                                    </div>
                                 </div> )}
                         </Dropzone>
                    </div> 
                    <div className='flex flex-col items-center justify-center mt-4'>
                      {load ? <Loading /> : null}
                    </div>
    </div>
  )
}

export default AddDni
