import { AES_Union } from "./AES_Union";
import { CBM_Union } from "./CBM_Union";

export class LOS {
  Id: number;
  Code: string;
  Description: string;
  AES_Unions: AES_Union[]
  CBM_Unions: CBM_Union[];
  Value: string;
}
