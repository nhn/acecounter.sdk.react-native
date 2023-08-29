import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {HTTP_METHOD, BASE_URL, HTTP_URL, ACENetworkParams} from '../constant/Network'
import POLICY from '../constant/Policy'
import {NetworkMode, NetworkRequestType} from '../constant/SDKMode'
import ACECommonStaticConfig from '../config/ACECommonStaticConfig'
import {Platform} from 'react-native'
import {ACS} from '../../acone/acs'
import {mapValueStringToObject} from '../util/MapUtil'
import ACELog from '../logger/ACELog'

import ControlTowerSingleton from '../controltower/ControlTowerSingleton'
import ACEParameterUtilForOne from '../../acone/parameter/ACEParameterUtilForOne'
import ACEPolicyParameters from '../policy/ACEPolicyParameters'
import ACEParameterUtil from '../parameter/ACEParameterUtil'
import {LIB_VERSION} from '../../version'

export class ACENetwork {
  private static _TAG = 'Net'

  private static networkRequestTypeToParams(requestType: NetworkRequestType): ACENetworkParams {
    const currentNetworkMode = ControlTowerSingleton.getInstance().getNetworkMode()
    ACELog.d(
      ACENetwork._TAG,
      `networkRequestTypeToParams requestType: ${NetworkRequestType[requestType]}, currentNetworkMode:${NetworkMode[currentNetworkMode]}`,
    )
    return {
      baseUrl: this.networkRequestTypeToBaseURLs(currentNetworkMode, requestType),
      requestHeaders: this.networkRequestTypeToHeaders(currentNetworkMode, requestType),
      url: this.networkRequestTypeToURLs(currentNetworkMode, requestType),
      params: this.networkRequestTypeToURLParams(requestType),
    }
  }

  //#region base url
  private static logToBaseURL(networkMode: NetworkMode): string {
    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
        return BASE_URL.COMPANY_LOCAL_LOG
      case NetworkMode.HOME_dev:
        return BASE_URL.HOME_LOCAL_LOG
      case NetworkMode.Pro:
        return ACEPolicyParameters.getInstance().getCpDomain()
    }
  }

  private static policyToBaseURL(networkMode: NetworkMode): string {
    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
        return BASE_URL.COMPANY_LOCAL_POLICY
      case NetworkMode.HOME_dev:
        return BASE_URL.HOME_LOCAL_POLICY
      case NetworkMode.Pro:
        return BASE_URL.PRO_POLICY
    }
  }

  private static networkRequestTypeToBaseURLs(networkMode: NetworkMode, requestType: NetworkRequestType): string {
    switch (requestType) {
      case NetworkRequestType.LOG:
        return this.logToBaseURL(networkMode)
      case NetworkRequestType.POLICY:
        return this.policyToBaseURL(networkMode)
    }
  }
  //#endregion

  //#region request headers
  private static logToRequestHeaders(networkMode: NetworkMode): Map<string, string> {
    const _map = new Map<string, string>()
    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
        return _map
      case NetworkMode.HOME_dev:
        return _map
      case NetworkMode.Pro:
        return _map
    }
  }

  private static policyToRequestHeaders(networkMode: NetworkMode): Map<string, string> {
    const _map = new Map<string, string>()

    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
      case NetworkMode.HOME_dev:
      case NetworkMode.Pro:
        _map.set(POLICY.REQUEST_APPLICATION_ID, ACS.getPackageNameOrBundleID() ?? 'no packageName')

        _map.set(POLICY.REQUEST_CID, ACECommonStaticConfig.getKey())
        _map.set(POLICY.REQUEST_PLATFORM, `${Platform.OS} with react-native`)
        _map.set(POLICY.REQUEST_SERVICE_ID, ACECommonStaticConfig.getKey())
        _map.set(POLICY.REQUEST_TIME, Date.now().toString())
        _map.set(POLICY.REQUEST_VERSION, LIB_VERSION)
        break
    }

    return _map
  }

  private static networkRequestTypeToHeaders(
    networkMode: NetworkMode,
    requestType: NetworkRequestType,
  ): Map<string, string> {
    switch (requestType) {
      case NetworkRequestType.LOG:
        return this.logToRequestHeaders(networkMode)
      case NetworkRequestType.POLICY:
        return this.policyToRequestHeaders(networkMode)
    }
  }
  //#endregion

  //#region url
  private static logToURL(networkMode: NetworkMode): string {
    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
        return HTTP_URL.COMPANY_LOCAL_LOG
      case NetworkMode.HOME_dev:
        return HTTP_URL.HOME_LOCAL_LOG
      case NetworkMode.Pro:
        return HTTP_URL.PRO_LOG
    }
  }

  private static policyToURL(networkMode: NetworkMode): string {
    switch (networkMode) {
      case NetworkMode.COMPANY_dev:
        return HTTP_URL.COMPANY_LOCAL_POLICY
      case NetworkMode.HOME_dev:
        return HTTP_URL.HOME_LOCAL_POLICY
      case NetworkMode.Pro:
        return HTTP_URL.PRO_POLICY
    }
  }

  private static networkRequestTypeToURLs(networkMode: NetworkMode, requestType: NetworkRequestType): string {
    switch (requestType) {
      case NetworkRequestType.LOG:
        return this.logToURL(networkMode)
      case NetworkRequestType.POLICY:
        return this.policyToURL(networkMode)
    }
  }

  private static networkRequestTypeToURLParams(requestType: NetworkRequestType): object {
    switch (requestType) {
      case NetworkRequestType.LOG:
        return ACEParameterUtilForOne.getInstance().getParamsToObjectForLogSend()
      case NetworkRequestType.POLICY:
        return {}
    }
  }
  //#endregion

  //#region request
  public static requestToPolicy(completed?: (response: AxiosResponse) => void, failed?: (err: object) => void): void {
    ACENetwork.request(ACENetwork.networkRequestTypeToParams(NetworkRequestType.POLICY), completed, failed)
  }

  public static requestToLog(completed?: (response: AxiosResponse) => void, failed?: (err: object) => void): void {
    ACENetwork.request(ACENetwork.networkRequestTypeToParams(NetworkRequestType.LOG), completed, failed)
  }

  private static request(
    networkParam: ACENetworkParams,
    completed?: (response: AxiosResponse) => void,
    failed?: (err: object) => void,
    method: HTTP_METHOD = HTTP_METHOD.GET,
  ): void {
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
    axios.defaults.headers.common['User-Agent'] = ACEParameterUtil.getUserAgentForSDK()

    const requestHeaders = mapValueStringToObject(networkParam.requestHeaders)
    ACELog.d(ACENetwork._TAG, `ACEParameterUtil.getUserAgentForSDK(): ${ACEParameterUtil.getUserAgentForSDK()}`)
    // ACELog.d(ACENetwork._TAG, 'request requestHeaders:', requestHeaders)
    const requestConfig: AxiosRequestConfig = {
      url: networkParam.url,
      method: method,
      baseURL: networkParam.baseUrl,
      headers: requestHeaders,
      timeout: 1000,
      params: networkParam.params,
    }

    ACELog.d(ACENetwork._TAG, 'requestConfig', requestConfig)
    axios
      .create()
      .request(requestConfig)
      .then(response => {
        if (completed) {
          completed(response)
        }
      })
      .catch(error => {
        if (failed) {
          failed(error)
        }
      })
  }
  //#endregion
}
