import { Controller, Post, Get, Param, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({ message: 'File uploaded successfully', filename: file.filename });
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.sendFile(filePath);
  }
}
