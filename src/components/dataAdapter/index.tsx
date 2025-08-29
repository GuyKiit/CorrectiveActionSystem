import "dayjs/locale/en";
import Dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
Dayjs.extend(buddhistEra);

export default class OverwriteAdapterDayjs extends AdapterDayjs {
  constructor({ locale, formats }:any) {
    super({ locale, formats });
  }
  formatByString = (date:any, format:string) => {
      // if (format === "YYYY") {
      //   format = "YYYY";
      // }
      return this.dayjs(date).format(format);
   }
}