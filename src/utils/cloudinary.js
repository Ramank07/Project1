import * as dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"






    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });


    const uploadOnCloudinary= async(localFilePath)=>{

        try {
            if(!localFilePath)return null;
            const  response= await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
    
            // console.log("file is uploaded in cloudinary", response.url);
            fs.unlinkSync(localFilePath);//remove when uploaded on cloudinary
            return response;

        } catch (error) {
            console.log(
                "photo not uploaded on Cloudinary, error:",error
            );
            
            fs.unlinkSync(localFilePath);//remove the locally saved temporary as upload operation is failed

            return null;
        }
       
        

    }

    export {uploadOnCloudinary};

    
    
       
    
    