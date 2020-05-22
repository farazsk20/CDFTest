import { User } from "./user";
import { Region } from "./region";

export class Company {
    Id: number;
    Name: string;
    Users: User[];
    Regions: Region[];
}
