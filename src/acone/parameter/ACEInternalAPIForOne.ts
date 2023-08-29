import {ACParams} from '../acparam'
import IACECommonAPI from '../../common/parameter/IACECommonAPI'
import ACEReducerForOne from './ACEReducerForOne'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'

export default class ACEInternalAPIForOne implements IACECommonAPI {
  public constructor() {}

  requestPolicy(callback: (error?: object, result?: ACEResponseToCaller) => void): void
  requestPolicy(): Promise<ACEResponseToCaller>
  requestPolicy(
    callback?: (error?: object, result?: ACEResponseToCaller) => void,
  ): void | Promise<ACEResponseToCaller> {
    return ACEReducerForOne.policy(callback)
  }

  send(value: ACParams, callback: (error?: object, result?: object) => void): void
  send(value: ACParams): Promise<object>
  send(value: ACParams, callback?: (error?: object, result?: object) => void): void | Promise<object> {
    throw new Error('Method not implemented.')
  }
}
