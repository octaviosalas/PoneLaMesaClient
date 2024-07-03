import React, {useEffect, useState} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import Dropzone from 'react-dropzone';
import Loading from "../Loading/Loading";
import { PhotoIcon } from '@heroicons/react/24/solid'
import axios from 'axios';

const ViewDniModal = ({item, updateList}) => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure()
    const [image, setImage] = useState("")
    const [load, setLoad] = useState("")
    const [addNewLicense, setAddNewLicense] = useState(false)
    const {size, setSize} = useState("3xl")
    const [succes, setSucces] = useState(false)
    const [missedData, setMissedData] = useState(false)


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
            setImage(fileURL) 
            setLoad(false)
          });
          
      });
    };

   const addLicenseNow = async () => { 
    if(image.length === 0) { 
      setMissedData(true)
      setTimeout(() => { 
        setMissedData(false)
      }, 2000)
    } else { 
      try {
        const dniData = ({ 
          dniImage: image
        }) 
        const {data, status} = await axios.post(`http://localhost:4000/employees/addNewImageDni/${item.id}`, dniData)
        if(status === 200) { 
          await updateList()
          setSucces(true)
          setMissedData(false)
          setImage("")
          setSucces(false)
          setLoad(false)
          setAddNewLicense(false)
          onClose()
        } else { 
          setSucces(false)
          setMissedData(false)
        }
    } catch (error) {
         console.log(error)
    }
    }
   
   }

   return (
    <div>
      <p className='text-green-800 text-xs font-medium cursor-pointer' onClick={onOpen}>Ver DNI</p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent size={size}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">DNI {item.name}</ModalHeader>
              <ModalBody>
                {item.dni ? 
                   <div className='flex tems-center jsutify-center'>
                        <img src={item.dni} className='w-96 h-96'/> 
                   </div>
                 : 
                 <> 
                    <div className='flex flex-col items-center justify-center mt-4'>
                        <p className='text-white w-full text-sm font-medium bg-red-600 text-center'>No hay imagen del DNI cargada</p>
                       {!addNewLicense ? <div className='flex gap-4 items-center'>
                          <Button className='bg-green-800 text-white font-medium text-sm w-40 mt-4' onClick={() => setAddNewLicense(true)}>Agregar DNI</Button>
                          <Button className='bg-green-800 text-white font-medium text-sm w-40 mt-4' onPress={onClose}> Cerrar </Button>
                        </div> : null}
                    </div>
                    {addNewLicense ? 
                    <>
                      <div>
                          <Dropzone onDrop={handleDropImage}>
                          {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: 'dropzone' })}>
                                   <input {...getInputProps()} />
                                      <div className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}>
                                        <div className="text-center">
                                          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                         <div className="mt-4 flex text-md leading-6 text-gray-600">
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
                      <div className='mt-4 flex gap-4 items-center justify-center'>
                        <Button className='bg-green-800 text-white font-medium text-sm w-40 mt-4' onClick={() => addLicenseNow()}>Agregar DNI</Button>
                        <Button className='bg-green-800 text-white font-medium text-sm w-40 mt-4' onClick={() => setAddNewLicense(false)}> Cancelar </Button>
                      </div>
                      {load ? <div className='mt-4 flex items-center justify-center'> <Loading/> </div>  : null}
                      {succes ? <div className='mt-4 flex items-center justify-center'> <p className='font-semibold text-green-800 text-md'>Imagen guardada</p> </div>  : null}
                      {missedData ? <div className='mt-4 flex items-center justify-center'> <p className='font-semibold text-green-800 text-md'>Debes cargar la imagen</p> </div>  : null}
                      </> : null
                    }
                 </>
                 
                 }
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ViewDniModal
