import { AbstractControl } from "@angular/forms";

export function validDateCheck({ value }: AbstractControl) {
  if (value && isNaN(+value)) {
    const parts = value.split("/");
    const [year, month, date] = parts;
    if (parts.length === 3) {
      return { validDate: !isNaN(+new Date(year, parseInt(month) + 1, date)) };
    } else {
      return { validDate: false };
    }
  }
}
