import {SDKMode, NetworkMode} from '../constant/SDKMode'
import {ACEPlatform, AceConfiguration} from '../../acone/aceconfiguration'
import ControlTower from './ControlTower'
import ACEControlTowerForOne from '../../acone/controltower/ACEControlTowerForOne'
import ACELog from '../logger/ACELog'

export default class ControlTowerSingleton {
  private static _TAG = 'towerSingle'
  private _platform: ACEPlatform
  private _controlTower: ControlTower

  private static instance: ControlTowerSingleton

  public static getInstance(): ControlTowerSingleton
  public static getInstance(platform?: ACEPlatform): ControlTowerSingleton {
    return this.instance || (this.instance = new this(platform))
  }

  public constructor(platform: ACEPlatform = AceConfiguration.PLATFORM.DEFAULT) {
    if (platform) {
      this._platform = platform
    }

    switch (this._platform) {
      default:
        this._controlTower = new ACEControlTowerForOne()
        break
    }
  }

  public getIsCompletePolicy(): boolean {
    return this._controlTower.getIsCompletePolicy()
  }

  public setIsCompletePolicy(isCompletePolicy: boolean, isSucceedRequestPolicy: boolean) {
    this._controlTower.setIsCompletePolicy(isCompletePolicy, isSucceedRequestPolicy)
  }

  protected isDisabled(): boolean {
    const currentIsCompletePolicy = this.getIsCompletePolicy()
    const currentIsSDKEnabled = this.getIsSDKEnabled()
    ACELog.d(
      ControlTowerSingleton._TAG,
      `getIsCompletePolicy(): ${currentIsCompletePolicy}, getIsSDKEnabled(): ${currentIsSDKEnabled}`,
    )

    if (currentIsCompletePolicy && !currentIsSDKEnabled) {
      ACELog.d(ControlTowerSingleton._TAG, 'SDK is disabled.')
      return true
    }

    return false
  }

  protected getIsSDKEnabled(): boolean {
    return this._controlTower.getIsSDKEnabled()
  }

  public setSDKDisable(): void {
    this._controlTower.setSDKDisable()
  }

  public isEnableByPolicy(): boolean {
    return this._controlTower.isEnableByPolicy()
  }

  public getSDKMode(): SDKMode {
    return this._controlTower.getSDKMode()
  }

  public setSDKMode(value: SDKMode): void {
    this._controlTower.setSDKMode(value)
  }

  public getNetworkMode(): NetworkMode {
    return this._controlTower.getNetworkMode()
  }

  public setNetworkMode(value: NetworkMode): void {
    this._controlTower.setNetworkMode(value)
  }

  public enableForceStop(): void {
    this._controlTower.enableForceStop()
  }

  public isEnableForceStop(): boolean {
    return this._controlTower.isEnableForceStop()
  }

  public setDevSDKMode(): void {
    this._controlTower.setDevSDKMode()
  }

  public setProductionSDKMode(): void {
    this._controlTower.setProductionSDKMode()
  }

  public setHomeDevNetworkMode(): void {
    this._controlTower.setNetworkMode(NetworkMode.HOME_dev)
  }

  public succeedRequestPolicy(): void {
    this._controlTower.setIsCompletePolicy(true, true)
  }

  public failedRequestPolicy(): void {
    this._controlTower.setIsCompletePolicy(true, false)
  }

  public reset(): void {
    return this._controlTower.reset()
  }

  //#region static
  public static getIsSDKEnabled(): boolean {
    return ControlTowerSingleton.getInstance().getIsSDKEnabled()
  }

  public static getCurrentSDKkModeName(): string {
    return SDKMode[ControlTowerSingleton.getInstance().getSDKMode()]
  }

  public static getCurrentNetworkModeName(): string {
    return NetworkMode[ControlTowerSingleton.getInstance().getNetworkMode()]
  }

  public static getDefaultNetworkMode(): NetworkMode {
    return ControlTower.getDefaultNetworkMode()
  }

  public static setDefaultNetworkMode(): void {
    ControlTowerSingleton.getInstance().setNetworkMode(ControlTowerSingleton.getDefaultNetworkMode())
  }

  public static setDevSDKMode(): void {
    ControlTowerSingleton.getInstance().setDevSDKMode()
  }

  public static getIsCompletePolicy(): boolean {
    return ControlTowerSingleton.getInstance().getIsCompletePolicy()
  }

  public static isEnableByPolicy(): boolean {
    return ControlTowerSingleton.getInstance().isEnableByPolicy()
  }

  public static isEnableForceStop(): boolean {
    return ControlTowerSingleton.getInstance().isEnableForceStop()
  }

  public static reset(): void {
    return ControlTowerSingleton.getInstance().reset()
  }
  //#endregion
}
