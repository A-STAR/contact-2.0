import { ValidatorFn } from '@angular/forms';

const formatSize = (size: number): string => {
  if (size < 1e3) {
    return `${size}B`;
  }
  if (size < 1e6) {
    return `${size / 1e3}kB`;
  }
  if (size < 1e9) {
    return `${size / 1e6}MB`;
  }
  return `${size / 1e9}GB`;
};

export const maxFileSize = (size: number): ValidatorFn => {
  return control => {
    const value: File = control.value;
    return value && value.size > size ? { maxsize: { requiredSize: formatSize(size) } } : null;
  };
};
