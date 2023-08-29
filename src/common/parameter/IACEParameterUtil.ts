import {AceConfiguration} from '../../acone/aceconfiguration'
import {DetailOfSDK} from '../constant/ACEPublicStaticConfig'

export default interface IACEParameterUtil {
  loadUniqueKeyForSDK(): void
  setFirstLogParameters(): void
  setLogSource(value: number): void

  getSession(): number
  setKeepSession(): void
  setNewSession(): void

  setterForString(key: string, value: string): void

  getSdkDetails(value: AceConfiguration): DetailOfSDK

  setAdvertisingIdentifier(isAdvertisingTrackingEnabled: boolean, advertisingIdentifier: string): void

  isDuplicateInstallReferrer(value: string): Promise<boolean>
  setInstallReferrer(value: string): Promise<boolean>

  getTS(): string
}
