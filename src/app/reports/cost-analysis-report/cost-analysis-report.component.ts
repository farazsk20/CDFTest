import { Component, OnInit } from "@angular/core";
import { CDF } from "src/app/_models/cdf";
import { CDFLocation } from "src/app/_models/cdflocation";
import { ActivatedRoute } from "@angular/router";
import { CdfService } from "src/app/_services/cdf.service";
import { CdfLocationService } from "src/app/_services/cdf-location.service";
import { ReportExportService } from "src/app/_services/report-export.service";
import * as moment from "moment";

import {
  GridDataResult,
  DataStateChangeEvent
} from "@progress/kendo-angular-grid";
import { Observable } from "rxjs";
import { State } from "@progress/kendo-data-query";
import { LocationSummary } from "src/app/_models/location-summary";
import { CostLevel } from "src/app/_models/cost-level";
import { LevelCost } from "src/app/_models/level-cost";

@Component({
  selector: "app-cost-analysis-report",
  templateUrl: "./cost-analysis-report.component.html",
  styleUrls: ["./cost-analysis-report.component.css"]
})
export class CostAnalysisReportComponent implements OnInit {
  cdf: CDF;
  bid: CDFLocation;
  cdfId: number;
  bidId: number;
  months = [];
  gridData: any[];
  locationCosts: LevelCost[];

  public view: Observable<GridDataResult>;
  public state: State = {
    skip: 0,
    take: 5
  };

  constructor(
    private route: ActivatedRoute,
    private cdfService: CdfService,
    private cdfLocationService: CdfLocationService,
    private reportExportService: ReportExportService
  ) {}

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.cdfId = +params["id"];
      this.bidId = +params["bidId"];
    });

    this.cdfLocationService
      .GetCdf(this.bidId)
      .subscribe((data: CDFLocation) => {
        this.bid = data;
        this.months = this.getMonths(
          this.bid.CDF.ContractStartDate,
          this.bid.CDF.ContractEndDate
        );

        this.cdfLocationService
          .GetCostLevels(this.bidId)
          .subscribe((data: LevelCost[]) => {
            this.locationCosts = data;

            this.months.forEach((month: string) => {
              let date = moment(month);

              // this.gridData.push({`${month}`:this.getMonthlyData(date.format('L'), this.locationCosts)})
              console.log();
            });
          });
      });
  }

  getMonths(startDate: Date, endDate: Date) {
    var dateStart = moment(startDate);
    var dateEnd = moment(endDate);
    var timeValues = [];

    while (
      dateEnd > dateStart ||
      dateStart.format("M") === dateEnd.format("M")
    ) {
      timeValues.push(dateStart.format("L"));
      dateStart.add(1, "month");
    }

    return timeValues;
  }

  getMonthlyData(date: string, data: LevelCost[]) {
    let monthly = [];

    data.forEach((line: LevelCost) => {
      if (
        !line.Start_Date ||
        (line.Start_Date &&
          line.End_Date &&
          moment(date).isSameOrAfter(moment(line.Start_Date).format("L")) &&
          moment(date).isSameOrBefore(moment(line.End_Date).format("L"))) ||
        (line.Start_Date && !line.End_Date)
      ) {
        monthly.push(line);
      }
    });

    return monthly;
  }

  transposeData(months: any[]) {
    // this.cdfLocationService
    //   .GetCostLevels(this.bidId)
    //   .subscribe((data: LevelCost[]) => {
    //     months.forEach(month => {
    //       this.gridData.push(this.getMonthlyData(month, data));
    //     });
    //   });
  }
}
