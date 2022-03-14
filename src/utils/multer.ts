import multer , {FileFilterCallback}from 'multer';
import {v4 as guidGenerator} from 'uuid'
import path from 'path/win32';
import {Request} from 'express';
type DestincationCallback = (error: Error | null, destionation: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
   destination: (req: Request, file: Express.Multer.File, cb: DestincationCallback): void => {
    cb(null, '../uploads/');
   },
   filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
    const guid = guidGenerator();
    cb(null, guid + '_' + file.originalname);
   }
})

export const storageProfile = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestincationCallback): void => {
        cb(null, '../uploads/profiles/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

export const storageProduct = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestincationCallback): void => {
        cb(null, '../uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
export const storageCategory = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestincationCallback): void => {
        cb(null, '../uploads/categories');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if(file.originalname.match(/\.(png|jpeg|jpg)$/)){
        return cb(new Error(`Image must be png, jpeg, or jpg`));
    }
    cb(null, true);
}



// app.use(multer({storage: fileStorage, fileFilter}));