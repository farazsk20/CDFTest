import { Injectable } from "@angular/core";
import { State } from "../_models/state";


@Injectable({
    providedIn: "root"
})

 
export class StateService {
    
    getStates(): State[]{
        let states = [
            new State("AK", "Alaska"),
            new State("AL", "Alabama"),
            new State("AR", "Arkansas"),
            new State("AZ", "Arizona"),
            new State("CA", "California"),
            new State("CO", "Colorado"),
            new State("CT", "Connecticut"),
            new State("DC", "District of Columbia"),
            new State("DE", "Delaware"),
            new State("FL", "Florida"),
            new State("GA", "Georgia"),
            new State("HI", "Hawaii"),
            new State("IA", "Iowa"),
            new State("ID", "Idaho"),
            new State("IL", "Illinois"),
            new State("IN", "Indiana"),
            new State("KS", "Kansas"),
            new State("KY", "Kentucky"),
            new State("LA", "Louisiana"),
            new State("MA", "Massachusetts"),
            new State("MD", "Maryland"),
            new State("ME", "Maine"),
            new State("MI", "Michigan"),
            new State("MN", "Minnesota"),
            new State("MO", "Missouri"),
            new State("MS", "Mississipi"),
            new State("MT", "Montana"),
            new State("NC", "North Carolina"),
            new State("ND", "North Dakota"),
            new State("NE", "Nebraska"),
            new State("NH", "New Hampshire"),
            new State("NJ", "New Jersey"),
            new State("NM", "New Mexico"),
            new State("NV", "Nevada"),
            new State("NY", "New York"),
            new State("OH", "Ohio"),
            new State("OK", "Oklahoma"),
            new State("OR", "Oregon"),
            new State("PA", "Pennsylvania"),
            new State("PR", "Puerto Rico"),
            new State("RI", "Rhode Island"),
            new State("SC", "South Carolina"),
            new State("SD", "South Dakota"),
            new State("TN", "Tennessee"),
            new State("TX", "Texas"),
            new State("UT", "Utah"),
            new State("VA", "Virigina"),
            new State("VI", "Virgina Islands"),
            new State("VT", "Vermont"),
            new State("WA", "Washington"),
            new State("WI", "Wisconsin"),
            new State("WV", "West Virginia"),
            new State("WY", "Wyoming")
        ];
        return states;
    }
}