import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JwtInterceptor } from "./_helpers/jwt-interceptor";
import { ErrorInterceptor } from "./_helpers/error-interceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgPipesModule, GroupByPipe } from "ngx-pipes";
import { DecimalPipe } from "@angular/common";
import { CurrencyPipe } from "@angular/common";
import { ToastrModule } from "ngx-toastr";

// import {
//   GridModule,
//   PageService,
//   SortService,
//   FilterService,
//   GroupService
// } from "@syncfusion/ej2-angular-grids";
import { GridModule } from "@progress/kendo-angular-grid";

import { NavbarComponent } from "./layout/navbar/navbar.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatButtonModule,
  MatNativeDateModule,
  MatRadioModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { CdfComponent } from "./cdf/cdf.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LocationComponent } from "./cdf/location/location.component";
import { DialogCdfTitleComponent } from "./cdf/dialog/dialog-cdf-title/dialog-cdf-title.component";
import { AddLocationComponent } from "./cdf/dialog/add-location/add-location.component";
import { SideNavService } from "./_services/side-nav.service";
import { LocationDetailComponent } from "./cdf/location-detail/location-detail.component";
import { AddStaffComponent } from "./cdf/dialog/add-staff/add-staff.component";
import { staffingDetailsComponent } from "./cdf/location-detail/staffingDetails/staffingDetails.component";
import { BuildingInfoComponent } from "./cdf/location-detail/building-info/building-info.component";
import { CostsComponent } from "./cdf/location-detail/costs/costs.component";
import { AddCostComponent } from "./cdf/dialog/add-cost/add-cost.component";
import { SummaryComponent } from "./cdf/location-detail/summary/summary.component";
import { TaxInfoComponent } from "./cdf/location-detail/tax-info/tax-info.component";
import { CbmUnionInfoComponent } from "./cdf/location-detail/cbm-union-info/cbm-union-info.component";
import { AesUnionInfoComponent } from "./cdf/location-detail/aes-union-info/aes-union-info.component";
import { CbmUnionBenefitsComponent } from "./cdf/dialog/add-staff/cbm-union-benefits/cbm-union-benefits.component";
import { AesUnionBenefitsComponent } from "./cdf/dialog/add-staff/aes-union-benefits/aes-union-benefits.component";
import { NonUnionBenefitsComponent } from "./cdf/dialog/add-staff/non-union-benefits/non-union-benefits.component";
import { LocationsComponent } from "./locations/locations.component";
import { NewLocationComponent } from "./locations/new-location/new-location.component";
import { ConfirmBenefitDeleteComponent } from "./cdf/dialog/confirm-benefit-delete/confirm-benefit-delete.component";
import { PricingMethodFilterPipe } from "./_pipes/pricing-method-filter.pipe";
import { AddCbmBenefitComponent } from "./cdf/dialog/add-cbm-benefit/add-cbm-benefit.component";
import { AddNonunionBenefitComponent } from "./cdf/dialog/add-nonunion-benefit/add-nonunion-benefit.component";
import { AddAesBenefitComponent } from "./cdf/dialog/add-aes-benefit/add-aes-benefit.component";
import { ConfirmBidDeleteComponent } from "./cdf/dialog/confirm-bid-delete/confirm-bid-delete.component";
import { AddTaxComponent } from "./cdf/dialog/add-tax/add-tax.component";
import { ConfirmStaffingActualsComponent } from "./cdf/dialog/confirm-staffing-actuals/confirm-staffing-actuals.component";
import { ReportListComponent } from "./reports/report-list/report-list.component";
import { CdfReportComponent } from "./reports/cdf-report/cdf-report.component";
import { WctReportComponent } from "./reports/wct-report/wct-report.component";
import { TestComponent } from "./test/test.component";
import { SseComponent } from "./cdf/location-detail/sse/sse.component";
import { NgxCurrencyModule } from "ngx-currency";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { CostAnalysisReportComponent } from "./reports/cost-analysis-report/cost-analysis-report.component";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    CreateUserComponent,
    CdfComponent,
    DashboardComponent,
    LocationComponent,
    DialogCdfTitleComponent,
    AddLocationComponent,
    LocationDetailComponent,
    AddStaffComponent,
    staffingDetailsComponent,
    BuildingInfoComponent,
    CostsComponent,
    AddCostComponent,
    SummaryComponent,
    TaxInfoComponent,
    AesUnionInfoComponent,
    CbmUnionInfoComponent,
    CbmUnionBenefitsComponent,
    AesUnionBenefitsComponent,
    NonUnionBenefitsComponent,
    LocationsComponent,
    NewLocationComponent,
    ConfirmBenefitDeleteComponent,
    PricingMethodFilterPipe,
    AddCbmBenefitComponent,
    AddNonunionBenefitComponent,
    AddAesBenefitComponent,
    ConfirmBidDeleteComponent,
    AddTaxComponent,
    ConfirmStaffingActualsComponent,
    ReportListComponent,
    CdfReportComponent,
    WctReportComponent,
    TestComponent,
    SseComponent,
    CostAnalysisReportComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgPipesModule,
    MatButtonModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    NgxCurrencyModule,
    MatProgressSpinnerModule,
    PDFExportModule,
    NgxMatSelectSearchModule,
    GridModule
  ],
  entryComponents: [
    DialogCdfTitleComponent,
    AddLocationComponent,
    AddStaffComponent,
    AddCostComponent,
    TaxInfoComponent,
    AesUnionInfoComponent,
    CbmUnionInfoComponent,
    ConfirmBenefitDeleteComponent,
    ConfirmBidDeleteComponent,
    AddCbmBenefitComponent,
    AddNonunionBenefitComponent,
    AddAesBenefitComponent,
    ConfirmStaffingActualsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // PageService,
    // SortService,
    // FilterService,
    // GroupService,
    SideNavService,
    GroupByPipe,
    CurrencyPipe,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
