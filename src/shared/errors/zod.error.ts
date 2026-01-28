import { Logger } from '@nestjs/common';
import { z } from 'zod';

export const setupZodVietnamese = () => {
  z.config({
    localeError: (issue): string => {
      switch (issue.code) {
        case 'invalid_type':
          return `Sai kiểu dữ liệu, vui lòng kiểm tra lại dữ liệu`;

        case 'too_small':
          return issue.type === 'string'
            ? `Chuỗi quá ngắn, tối thiểu ${issue.minimum} ký tự`
            : `Giá trị quá nhỏ, tối thiểu ${issue.minimum}`;

        case 'too_big':
          return issue.type === 'string'
            ? `Chuỗi quá dài, tối đa ${issue.maximum} ký tự`
            : `Giá trị quá lớn, tối đa ${issue.maximum}`;

        case 'invalid_format':
          return 'Định dạng không hợp lệ';

        case 'not_multiple_of':
          return `Giá trị phải là bội số của ${issue.multipleOf}`;

        case 'unrecognized_keys':
          return 'Có trường không được phép';

        case 'invalid_union':
          return 'Giá trị không khớp schema nào';

        case 'invalid_key':
          return 'Key không hợp lệ';

        case 'invalid_element':
          return 'Phần tử không hợp lệ';

        case 'invalid_value':
          return 'Giá trị không hợp lệ';

        case 'custom':
          return issue.message ?? 'Dữ liệu không hợp lệ';

        default:
          return issue;
      }
    },
  });
};

function logError(issue) {
  Logger.error('==== ZOD ISSUE ====');
  Logger.error(`code: ${issue.code}`);
  Logger.error(`path: ${issue.path?.join('.')}`);
  Logger.error(`message: ${issue.message}`);
  Logger.error(`input: ${JSON.stringify(issue.input)}`);
  Logger.error(`expected: ${JSON.stringify(issue.expected)}`);
  Logger.error(`received: ${issue.received}`);
  Logger.error(`minimum: ${issue.minimum}`);
  Logger.error(`maximum: ${issue.maximum}`);
  Logger.error(`type: ${issue.type}`);
  Logger.error(`multipleOf: ${issue.multipleOf}`);
  Logger.error(`keys: ${JSON.stringify(issue.keys)}`);
  Logger.error(`continue: ${issue.continue}`);
  Logger.error('===================');
}
