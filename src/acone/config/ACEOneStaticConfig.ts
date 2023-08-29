import {AceConfiguration} from '../../acone/aceconfiguration'
import ACEStaticConfig from '../../common/config/ACEStaticConfig'
import ACEParameterUtilForOne from '../parameter/ACEParameterUtilForOne'
import IACECommonAPI from '../../common/parameter/IACECommonAPI'
import ACEInternalAPIForOne from '../parameter/ACEInternalAPIForOne'
import IACEParameterUtil from '../../common/parameter/IACEParameterUtil'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'

export default class ACEOneStaticConfig implements ACEStaticConfig {
  _debug: boolean
  _key: string
  _disableToCollectAdvertisingIdentifier: boolean
  _commonAPI: IACECommonAPI
  private _enablePrivacyPolicy: boolean

  public constructor() {
    this._enablePrivacyPolicy = false
    this._debug = true
    this._key = 'empty'
    this._disableToCollectAdvertisingIdentifier = false
    this._commonAPI = new ACEInternalAPIForOne()
  }

  public configure(
    configuration: AceConfiguration,
    callback: ((error?: Error, result?: ACEResponseToCaller) => void) | undefined,
  ): void
  public configure(configuration: AceConfiguration): Promise<ACEResponseToCaller>
  public configure(
    configuration: AceConfiguration,
    callback?: ((error?: Error, result?: ACEResponseToCaller) => void) | undefined,
  ): Promise<ACEResponseToCaller> | void {
    this._key = configuration.key
    if (configuration.enablePrivacyPolicy) {
      this._enablePrivacyPolicy = configuration.enablePrivacyPolicy
    }
    if (configuration.disableToCollectAdvertisingIdentifier) {
      this._disableToCollectAdvertisingIdentifier = configuration.disableToCollectAdvertisingIdentifier
    }
    if (configuration.debug) {
      this._debug = configuration.debug
    }

    return ACEParameterUtilForOne.getInstance().initParameters(
      this._key,
      this._enablePrivacyPolicy,
      this._disableToCollectAdvertisingIdentifier,
      callback,
    )
  }
  isDebug(): boolean {
    return this._debug
  }
  getEnablePrivacyPolicy(): boolean {
    return this._enablePrivacyPolicy
  }
  getKey(): string {
    return this._key
  }
  getCommonAPI(): IACECommonAPI | undefined {
    if (this._commonAPI) {
      return this._commonAPI
    }

    return undefined
  }
  getParameterUtil(): IACEParameterUtil | undefined {
    return ACEParameterUtilForOne.getInstance()
  }
}
