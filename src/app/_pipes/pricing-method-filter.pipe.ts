import { Pipe, PipeTransform } from '@angular/core';
import { PricingMethod } from '../_models/pricing-method';
import { CDFLocationCost } from '../_models/cdflocation-cost';
import { Cost } from '../_models/cost';
import { CostPricingMethod } from '../_models/cost-pricing-method';

@Pipe({
  name: 'pricingMethodFilter'
})
export class PricingMethodFilterPipe implements PipeTransform {

  // transform(pricingMethods: PricingMethod[], type: string): any {
  //   if (!pricingMethods) return [];
  //   if (!type) return [];

  //   return pricingMethods.filter(item => { return item.Type == type });
  // }

  transform(pricingMethods: PricingMethod[], type: any): any {
    if (!pricingMethods) return [];
    if (!type) return [];
    if(type !== 'Staff' && !(type.CostPricingMethods.length > 0)) return [];

    if( type === 'Staff'){
      return pricingMethods.filter(item => { return item.Type == type });
    }
    else 
    {
     return pricingMethods.filter(item => type.CostPricingMethods.some(cp => cp.PricingMethod.Id === item.Id ));
    }                                                      
    
  }

}
