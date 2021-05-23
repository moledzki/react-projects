import fs = require('fs');
import { PhotoAlbum } from 'model/PhotoAlbum';
const path = require('path');


export class LocalPhotoService {
    getAllAlbums(rootDir: string): Array<PhotoAlbum> {
        console.log("Processing directory: " + rootDir)
        let result = [];
        fs.readdirSync(rootDir).forEach((fileName: string) => {
            let fullPath = path.join(rootDir, fileName);
            if (fs.statSync(fullPath).isDirectory()) {
                let numberOfFiles = this.countFilesInDirectory(fullPath);
                if (numberOfFiles > 0) {
                    result.push({ name: fullPath, photoNumber: numberOfFiles });
                }
                result.push(...this.getAllAlbums(fullPath));
            }
        });
        return result;
    }

    countFilesInDirectory(dir: string): number {
        let result = 0;
        fs.readdirSync(dir).forEach((fileName: string) => {
            let fullPath = path.join(dir, fileName);
            if (fs.statSync(fullPath).isFile()) {
                result += 1;
            }
        });
        return result
    }

    getAllAlbums2(rootDir: string): Array<PhotoAlbum> {
        console.log("Processing2 directory: " + rootDir)
        let result = [];
        let fileCount = 0;
        fs.readdirSync(rootDir).forEach((fileName: string) => {
            let fullPath = path.join(rootDir, fileName);
            if (fs.statSync(fullPath).isFile()) {
                fileCount += 1;
            } else {
                result.push(...this.getAllAlbums2(fullPath));
            }
        });
        if(fileCount > 0) {
            result.push({name: path.basename(rootDir), photoNumber: fileCount});
        }
        return result;
    }
    getAllAlbums3(rootDir: string): Array<PhotoAlbum> {
        console.log("Processing2 directory: " + rootDir)
        let result = [];
        let fileCount = 0;
        fs.readdir(rootDir, function(err: NodeJS.ErrnoException, files: string[])  {

        });
        fs.readdirSync(rootDir).forEach((fileName: string) => {
            let fullPath = path.join(rootDir, fileName);
            if (fs.statSync(fullPath).isFile()) {
                fileCount += 1;
            } else {
                result.push(...this.getAllAlbums3(fullPath));
            }
        });
        if(fileCount > 0) {
            result.push({name: path.basename(rootDir), photoNumber: fileCount});
        }
        return result;
    }
}