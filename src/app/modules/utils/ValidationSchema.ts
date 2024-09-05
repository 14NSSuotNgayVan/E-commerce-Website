import * as Yup from "yup";
import { DATE } from "./Constant";

export const maxDate = (date: string | Date, errorMessage: string) => {
    return Yup.date().test('max-date', errorMessage, function (value: any) {
        const newDate = new Date(value);
        const maxDate = new Date(date);
        return newDate <= maxDate;
    });
}

export const minDate = (date: string | Date, errorMessage: string) => {
    return Yup.date().test('min-date', errorMessage, function (value: any) {
        const newDate = new Date(value);
        const minDate = new Date(date);
        return newDate >= minDate;
    });
}

export const validationDate = (lang: (message: string) => Yup.Message<any>) => {
    return Yup.date().test('invalid-date', lang("VALIDATION.INVALID_FORMAT"), function (value: any) {
        const newDate = new Date(value);
        const minDate = DATE.MIN_DATE;
        const maxDate = DATE.MAX_DATE;
        return value ? newDate <= maxDate && newDate >= minDate : true;
    });
}