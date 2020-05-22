import { Company } from "./company";
import { Location } from "./location";

export class Region {
    Id: number;
    Number: number;
    Name: string;
    Company: Company;
    Locations: Location[];
}
