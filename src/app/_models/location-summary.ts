export class LocationSummary {

  BaseWages: number; // 100
  ActualBaseWages
  BaseWagesNight: number; // 100
  BaseWagesDay: number;
  TotalLabor: number; // 100 + 150
  TotalUnionLabor: number; // 100 + 150
  TotalNonUnionLabor: number; // 100 + 150
  ActualTotalLabor: number; // 100 + 150
  ActualTotalUnionLabor: number;
  ActualTotalNonUnionLabor: number;
  TotalLaborNight: number;
  TotalLaborDay: number;
  TotalLaborUnion: number;
  TotalLaborNonUnion: number;
  TotalPayrollTax: number; // 200 + 280
  TotalPayrollProcessing: number; // 290
  TotalPayrollProcessingActual: number;
  TotalInsurance: number; // 250
  TotalPayrollTaxInsurance: number; // 100 + 150 + 200 + 250 + 280 + 290
  TotalUnionBenefits: number; // 300
  TotalUnionBenefitsNight: number;
  TotalUnionBenefitsDay: number;
  TotalNonUnionBenefits: number; // 400 + 410
  TotalNonUnionBenefitsNight: number;
  TotalNonUnionBenefitsDay: number;
  TotalOngoingCosts: number; // 520
  TotalRemainingCostItems: number; // 500 + 540 + 560 + 600 + 700
  TotalStartupOtherCosts: number; // 500 + 540 + 560
  TotalCostsBeforeFees: number; // 100 + 150 + 200 + 250 + 280 + 300 + 400 + 500 + 520 + 540 + 560 + 600 + 700
  TotalFees: number; // 800 + 820 + 840 + 850 + 860
  TotalDiscount: number; // 880
  TotalEquipment: number; // 600
  TotalSubcontracts: number; // 700
  TotalPayrollBenefits: number; // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410
  TotalPayrollBenefitsCosts: number; // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410 + 500 + 520 + 540 + 560
  TotalPlusEquipment: number; // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410 + 500 + 520 + 540 + 560 + 600
  TotalPlusEquipmentSubs: number; // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410 + 500 + 520 + 540 + 560 + 600 + 700
  TotalTax: number; //900
  TotalWithoutFees: number;
  TotalWithoutProfit: number;
  TotalWithFees: number;
  TotalWithoutTax: number; // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410 + 500 + 520 + 540 + 560 + 600 + 700 + 800 + 820 + 840 + 850 + 860 + 880
  TotalWithTax: number;  // 100 + 150 + 200 + 250 + 280 + 290 + 300 + 400 + 410 + 500 + 520 + 540 + 560 + 600 + 700 + 800 + 820 + 840 + 850 + 860 + 880 + 900

  TotalGrossProfit: number;
}
