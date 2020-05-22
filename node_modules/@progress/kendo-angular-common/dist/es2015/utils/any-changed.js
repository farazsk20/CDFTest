/**-----------------------------------------------------------------------------------------
* Copyright © 2019 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { isChanged } from './is-changed';
export const anyChanged = (propertyNames, changes, skipFirstChange = true) => propertyNames.some(name => isChanged(name, changes, skipFirstChange));
