import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  transform(values: any) {
    if (!values.length) {
      throw new BadRequestException('Invalid files');
    }

    values.map((value) => {
      if (!value || !value.originalname || !value.mimetype) {
        throw new BadRequestException('Invalid file');
      }

      const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!mimeTypes.includes(value.mimetype)) {
        throw new BadRequestException('Invalid file type');
      }

      const size = 5 * 1024 * 1024;

      if (value.size > size) {
        throw new BadRequestException('File size must not exceed 5MB');
      }
    });

    return values;
  }
}
