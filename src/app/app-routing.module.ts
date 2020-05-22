import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./_guards/auth.guard";
import { CreateUserComponent } from "./create-user/create-user.component";
import { CdfComponent } from "./cdf/cdf.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LocationComponent } from "./cdf/location/location.component";
import { LocationsComponent } from "./locations/locations.component";
import { NewLocationComponent } from "./locations/new-location/new-location.component";
import { ReportListComponent } from "./reports/report-list/report-list.component";
import { CdfReportComponent } from "./reports/cdf-report/cdf-report.component";
import { WctReportComponent } from "./reports/wct-report/wct-report.component";
import { TestComponent } from "./test/test.component";
import { CostAnalysisReportComponent } from "./reports/cost-analysis-report/cost-analysis-report.component";

const routes: Routes = [
  { path: "", component: LoginComponent },

  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "test",
    component: TestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "createUser",
    component: CreateUserComponent,
    canActivate: [AuthGuard]
  },
  { path: "cdfListing", component: CdfComponent, canActivate: [AuthGuard] },
  {
    path: "cdfDetails/:id",
    component: LocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "locations",
    component: LocationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "newLocation",
    component: NewLocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "editLocation/:id",
    component: NewLocationComponent,
    canActivate: [AuthGuard]
  },
  { path: "reports", component: ReportListComponent, canActivate: [AuthGuard] },
  {
    path: "cdf-report/:id/:bidId",
    component: CdfReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "wct-report/:id/:bidId",
    component: WctReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "cost-analysis-report/:id/:bidId",
    component: CostAnalysisReportComponent,
    canActivate: [AuthGuard]
  },
  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
