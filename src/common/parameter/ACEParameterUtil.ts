import {Platform} from 'react-native'
import {Dimensions} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {LIB_VERSION} from '../../version'
import ACECONSTANT from '../constant/ACEConstant'
import {VersionWithPatch} from '../constant/ACEPublicStaticConfig'
import ACELog from '../logger/ACELog'

export default class ACEParameterUtil {
  public static _TAG = 'ParamUtil'

  public static getResolution(): string {
    return `${Math.floor(Dimensions.get('window').width)}*${Math.floor(Dimensions.get('window').height)}`
  }

  public static getPackageNameOrBundleID(): string {
    return DeviceInfo.getBundleId()
  }

  public static getModel(): string {
    return DeviceInfo.getModel()
  }

  public static getSystemName(): string {
    return DeviceInfo.getSystemName()
  }

  public static getSystemVersion(): string {
    return DeviceInfo.getSystemVersion()
  }

  public static getPlatformName(): string {
    if (Platform.OS === 'ios' && !Platform.isPad) {
      return ACEParameterUtil.replace_iOS_To_iPhone_OS(ACEParameterUtil.getSystemName())
    } else {
      return ACEParameterUtil.getSystemName()
    }
  }

  public static getUserAgentForSDK(): string {
    return `${ACEParameterUtil.getPlatformName()} ${ACEParameterUtil.getSystemVersion()} ${ACEParameterUtil.getModel()} on react-native`
  }

  private static replace_iOS_To_iPhone_OS(source: string): string {
    const re = /iOS/gi

    return source.replace(re, 'iPhone OS')
  }

  public static getSdkVersionWithPatch(): VersionWithPatch {
    return {
      version: LIB_VERSION,
      patch: ACECONSTANT.PATCH,
    }
  }

  public static isEmpty(value: any): boolean {
    return (
      value === null || // check for null
      value === undefined || // check for undefined
      value === '' || // check for empty string
      (Array.isArray(value) && value.length === 0) || // check for empty array
      (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
    )
  }

  public static validateAdvertisingIdentifier(
    isAdEnabled: boolean,
    adid: string | null,
  ): {isAdEnabled: boolean; adid: string} {
    if (ACEParameterUtil.isEmpty(adid) || adid === ACECONSTANT.DEFAULT_ADID) {
      ACELog.d(
        ACEParameterUtil._TAG,
        `AdvertisingIdentifier empty or all zero::isAdEnabled: ${isAdEnabled}, >>${adid}<<`,
      )
      isAdEnabled = false
      adid = ACECONSTANT.DEFAULT_ADID
    } else {
      adid = adid ?? ACECONSTANT.DEFAULT_ADID
    }

    return {
      isAdEnabled,
      adid,
    }
  }
}
