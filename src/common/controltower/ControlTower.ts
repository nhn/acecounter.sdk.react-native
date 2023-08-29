import {SDKMode, NetworkMode} from '../constant/SDKMode'
import ACEPolicyParameters from '../policy/ACEPolicyParameters'
import {isEmpty} from '../util/TextUtils'
import POLICY from '../constant/Policy'
import ACELog from '../logger/ACELog'

export default class ControlTower {
  private static _pTAG = 'pTower'
  protected _sdk_mode: SDKMode
  protected _network_mode: NetworkMode
  protected _isCompletePolicy: boolean
  protected _isInstallReferrerDone: boolean
  protected _isSDKForceStop: boolean
  protected _isSDKEnabled: boolean

  private static instance: ControlTower

  public static getInstance(): ControlTower {
    return this.instance || (this.instance = new this())
  }

  public constructor() {
    this.reset()
  }

  public reset(): void {
    ACELog.d(ControlTower._pTAG, 'Reset policy information of SDK.')
    this._sdk_mode = SDKMode.production
    this._network_mode = NetworkMode.Pro
    this._isCompletePolicy = false
    this._isInstallReferrerDone = false
    this._isSDKForceStop = false
    this._isSDKEnabled = false
    ACELog.setProductionMode()
  }

  public getIsCompletePolicy(): boolean {
    return this._isCompletePolicy
  }

  public setIsCompletePolicy(isCompletePolicy: boolean, isSucceedRequestPolicy: boolean) {
    ACELog.d(
      ControlTower._pTAG,
      `setIsCompletePolicy, isCompletePolicy: ${isCompletePolicy}, isSucceedRequestPolicy: ${isSucceedRequestPolicy}`,
    )
  }

  protected isDisabled(): boolean {
    const alreadyIsCompletePolicy = this.getIsCompletePolicy()
    const isSDKEnabled = this.getIsSDKEnabled()
    ACELog.d(
      ControlTower._pTAG,
      `isDisabled, alreadyIsCompletePolicy: ${alreadyIsCompletePolicy}, isSDKEnabled: ${isSDKEnabled}`,
    )

    if (alreadyIsCompletePolicy && !isSDKEnabled) {
      ACELog.d(ControlTower._pTAG, 'SDK is disabled.')
      return true
    }

    return false
  }

  public setSDKDisable(): void {
    ACELog.d(ControlTower._pTAG, 'Set SDK disable by policy.')
    this._isSDKEnabled = false
  }

  public isEnableByPolicy(): boolean {
    const result = ACEPolicyParameters.getInstance().getCpAllow()
    if (isEmpty(result)) {
      return false
    } else {
      // console.log(`isEnableByPolicy::result: ${result}, ${POLICY.FLAG_SDK_ENABLE}`)
      // console.log(
      //   `isEnableByPolicy::>>${result}<< == >>${POLICY.FLAG_SDK_ENABLE}<<: >>${result == POLICY.FLAG_SDK_ENABLE}<<`,
      // )
      return result === POLICY.FLAG_SDK_ENABLE
    }
  }

  public getIsSDKEnabled(): boolean {
    if (this._isSDKForceStop) {
      ACELog.d(ControlTower._pTAG, 'SDK was force stopped.')
      return false
    }
    this._isSDKEnabled = this.isEnableByPolicy()
    ACELog.d(ControlTower._pTAG, `isEnable of policy: ${this._isSDKEnabled}`)

    if (!this._isSDKEnabled) {
      ACELog.d(ControlTower._pTAG, 'not found SDK policy information.')
    }

    return this._isSDKEnabled
  }

  public getSDKMode(): SDKMode {
    return this._sdk_mode
  }

  public setSDKMode(value: SDKMode): void {
    this._sdk_mode = value
    switch (value) {
      case SDKMode.production:
        this._network_mode = NetworkMode.Pro
        break
      case SDKMode.development:
        this._network_mode = NetworkMode.COMPANY_dev
        break
    }
  }

  public getNetworkMode(): NetworkMode {
    return this._network_mode
  }

  public setNetworkMode(value: NetworkMode): void {
    this._network_mode = value
  }

  public enableForceStop(): void {
    this._isSDKForceStop = true
  }

  public isEnableForceStop(): boolean {
    return this._isSDKForceStop
  }

  public setDevSDKMode(): void {
    this.setSDKMode(SDKMode.development)
    ACELog.setDevMode()
  }

  public setProductionSDKMode(): void {
    this.setSDKMode(SDKMode.production)
    ACELog.setProductionMode()
  }

  //#region static
  public static getDefaultNetworkMode(): NetworkMode {
    return NetworkMode.Pro
  }
  //#endregion
}
