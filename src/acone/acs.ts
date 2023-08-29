import {ACParams} from './acparam'
import {AceConfiguration} from './aceconfiguration'
import ACECommonStaticConfig from '../common/config/ACECommonStaticConfig'
import ACEReducerForOne from './parameter/ACEReducerForOne'
import {ACEResponseToCaller} from '..'
import ControlTowerSingleton from '../common/controltower/ControlTowerSingleton'
import {ACEConstantCallback, ACEResultCode, DetailOfSDK} from '../common/constant/ACEPublicStaticConfig'
import ACEConstantInteger from '../common/constant/ACEConstantInteger'
import ACELog from '../common/logger/ACELog'
import NetworkUtils from '../common/http/NetworkUtills'
import {EventsForWorkerEmitter} from '../common/worker/EventsForWorkerEmitter'
import {decode, getQueryForKey, isEmpty, getDeeplinkKeyInURI} from '../common/util/TextUtils'
import ACECONSTANT from '../common/constant/ACEConstant'
import ACEParameterUtil from '../common/parameter/ACEParameterUtil'

export class ACS {
  private static _TAG = 'ACS'
  private static instance: ACS
  private static _packageNameOrBundleID: string | undefined
  private static waitQueue: ACParams[]
  private static bufferQueue: ACParams[]
  private emitter: EventsForWorkerEmitter
  private static lock = false
  private _configuration?: AceConfiguration

  public static getInstance(): ACS {
    return this.instance || (this.instance = new this())
  }

  constructor() {
    this.emitter = new EventsForWorkerEmitter()
    this.emitter.on('popWaitQueue', () => {
      this.popWaitQueue()
    })
    this.emitter.on('popBufferQueue', () => {
      this.popBufferQueue()
    })
  }

  private storeConfigurationOfUser(value: AceConfiguration): void {
    this._configuration = value
  }

  //#region configure of SDK
  public static configure(
    value: AceConfiguration,
    callback: (error?: Error, result?: ACEResponseToCaller) => void,
  ): void
  public static configure(value: AceConfiguration): Promise<ACEResponseToCaller>
  public static configure(
    value: AceConfiguration,
    callback?: (error?: Error, result?: ACEResponseToCaller) => void,
  ): Promise<ACEResponseToCaller> | void {
    return ACS.getInstance().configure(value, callback)
  }

  configure(
    value: AceConfiguration,
    callback: ((error?: Error, result?: ACEResponseToCaller) => void) | undefined,
  ): void
  configure(value: AceConfiguration): Promise<ACEResponseToCaller>
  configure(
    value: AceConfiguration,
    callback?: ((error?: Error, result?: ACEResponseToCaller) => void) | undefined,
  ): Promise<ACEResponseToCaller> | void {
    this.storeConfigurationOfUser({...value})
    if (callback) {
      const callbackAtInit = (error?: object, innerResult?: ACEResponseToCaller) => {
        if (error) {
          callback(new Error('0000, Can not init SDK.'), innerResult)
        } else {
          callback(undefined, innerResult)
          this.popWaitQueueEmit()
        }
      }

      ACECommonStaticConfig.configure(value, callbackAtInit)
    } else {
      return new Promise((resolveToOut, rejectToOut) => {
        ACECommonStaticConfig.configure(value)
          .then(res => {
            resolveToOut(res)
          })
          .then(res => {
            ACELog.d(ACS._TAG, `0000::configure::then2: ${JSON.stringify(res, null, 2)}`)
            this.popWaitQueueEmit()
          })
          .catch(err => {
            ACELog.d(ACS._TAG, `0000::configure::catch2: ${JSON.stringify(err, null, 2)}`)
            rejectToOut(err)
          })
      })
    }
  }
  //#endregion

  //#region send of public
  public static send(value: ACParams, callback: (error?: object, result?: ACEResponseToCaller) => void): void
  public static send(value: ACParams): Promise<ACEResponseToCaller>
  public static send(
    value: ACParams,
    callback?: (error?: object, result?: ACEResponseToCaller) => void,
  ): Promise<ACEResponseToCaller> | void {
    if (!ControlTowerSingleton.isEnableByPolicy()) {
      ACS.setWaitQueue(value)
      const result: ACEResponseToCaller = {
        taskHash: `${value.type}::0404`,
        code: ACEResultCode.NotFoundPolicyInformation,
        result: ACEConstantCallback[ACEConstantCallback.Failed],
        message: 'Not found policy information.',
        apiName: value.type,
      }

      if (callback) {
        callback(undefined, result)
        return
      } else {
        return new Promise((resolveToOut, rejectToOut) => {
          rejectToOut(result)
        })
      }
    }

    ACELog.d(ACS._TAG, `send::getIsCompletePolicy: ${ControlTowerSingleton.getIsCompletePolicy()}`)
    if (!ControlTowerSingleton.getIsCompletePolicy()) {
      ACS.setWaitQueue(value)
      const result: ACEResponseToCaller = {
        taskHash: `${value.type}::0405`,
        code: ACEResultCode.NotReceivePolicy,
        result: ACEConstantCallback[ACEConstantCallback.Failed],
        message: 'Not receive policy for SDK. It will send after init.',
        apiName: value.type,
      }

      if (callback) {
        callback(undefined, result)
        return
      } else {
        return new Promise((resolveToOut, rejectToOut) => {
          rejectToOut(result)
        })
      }
    }

    ACELog.d(ACS._TAG, `send::isEnableByPolicy: ${ControlTowerSingleton.isEnableByPolicy()}`)
    if (!ControlTowerSingleton.isEnableByPolicy()) {
      ACS.setWaitQueue(value)
      const result: ACEResponseToCaller = {
        taskHash: `${value.type}::0406`,
        code: ACEResultCode.DisabledByPolicy,
        result: ACEConstantCallback[ACEConstantCallback.Failed],
        message: 'Disabled by policy of SDK. It will send after init.',
        apiName: value.type,
      }

      if (callback) {
        callback(undefined, result)
        return
      } else {
        return new Promise((resolveToOut, rejectToOut) => {
          rejectToOut(result)
        })
      }
    }

    if (ACS.isLock()) {
      ACS.setBufferQueue(value)
      const result: ACEResponseToCaller = {
        taskHash: `${value.type}::0409`,
        code: ACEResultCode.TooBusyWillSendAfterDone,
        result: ACEConstantCallback[ACEConstantCallback.Failed],
        message: 'Too busy. It will send after done.',
        apiName: value.type,
      }

      if (callback) {
        callback(undefined, result)
        return
      } else {
        return new Promise((resolveToOut, rejectToOut) => {
          rejectToOut(result)
        })
      }
    }
    return ACS._send(value, callback)
  }
  //#endregion

  //#region detail of SDK
  public static isEnableSDK(): boolean {
    return ControlTowerSingleton.getIsSDKEnabled()
  }

  public static getSdkVersion(): string {
    return JSON.stringify(ACEParameterUtil.getSdkVersionWithPatch())
  }

  public static getPackageNameOrBundleID(): string | undefined {
    return this._packageNameOrBundleID
  }

  public static setPackageNameOrBundleID(packageNameOrBundleID: string): void {
    this._packageNameOrBundleID = packageNameOrBundleID
  }

  public static getSdkDetails(): DetailOfSDK {
    const _parameterUtil = ACECommonStaticConfig.getParameterUtil()
    if (_parameterUtil) {
      return _parameterUtil.getSdkDetails(
        ACS.getInstance()._configuration ?? {
          key: 'not has configuration',
        },
      )
    }

    return {
      result: ACEConstantCallback[ACEConstantCallback.Failed],
      message: "SDK is maybe that don't initialize.",
    }
  }
  //#endregion

  //#region pop wait queue
  private popWaitQueueEmit(): void {
    this.emitter.emit('popWaitQueue')
  }

  private popWaitQueue(): void {
    ACELog.d(ACS._TAG, 'pop waitQueue')
    if (ACS.waitQueue && ACS.waitQueue.length > 0) {
      ACELog.d(ACS._TAG, `waitQueue: ${ACS.waitQueue.length}`)

      const callback = (error?: object, innerResult?: ACEResponseToCaller) => {
        if (error) {
          if (innerResult) {
            ACELog.d(ACS._TAG, 'error of waitQueue', innerResult)
          } else {
            ACELog.d(ACS._TAG, 'error of waitQueue', error)
          }
        } else if (innerResult) {
          ACELog.d(ACS._TAG, 'result of waitQueue', innerResult)
        }
        this.popWaitQueueEmit()
      }

      const param = ACS.waitQueue.shift()
      if (param) {
        ACS._send(param, callback)
      }
    }
  }
  //#endregion

  //#region pop buffer queue
  private popBufferQueueEmit(): void {
    this.emitter.emit('popBufferQueue')
  }

  private popBufferQueue(): void {
    ACELog.d(ACS._TAG, 'pop bufferQueue')
    if (ACS.bufferQueue && ACS.bufferQueue.length > 0) {
      ACELog.d(ACS._TAG, `bufferQueue: ${ACS.bufferQueue.length}`)

      const callback = (error?: object, innerResult?: ACEResponseToCaller) => {
        if (error) {
          ACELog.d(ACS._TAG, 'error of bufferQueue', error)
        } else if (innerResult) {
          ACELog.d(ACS._TAG, 'result of bufferQueue', innerResult)
        }
      }

      const param = ACS.bufferQueue.shift()
      if (param) {
        ACS._send(param, callback)
      }
    }
  }
  //#endregion

  //#region private methods
  private static _send(
    value: ACParams,
    callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined,
  ): void
  private static _send(value: ACParams): Promise<ACEResponseToCaller>
  private static _send(
    value: ACParams,
    callback?: ((error?: object, result?: ACEResponseToCaller) => void) | undefined,
  ): Promise<ACEResponseToCaller> | void {
    ACS.toggleLock()
    ACELog.i(ACS._TAG, 'ACParams is ', value)

    if (callback) {
      const callbackForCB = (error?: object, innerResult?: ACEResponseToCaller) => {
        if (error) {
          if (innerResult) {
            callback(new Error(`0001, Can not use ${value.type} api.`), innerResult)
          } else {
            callback(new Error(`0001, Can not use ${value.type} api.`))
          }
        } else {
          callback(undefined, innerResult)
        }
        ACS.toggleLock()
        ACS.getInstance().popBufferQueueEmit()
      }

      NetworkUtils.isNetworkAvailable()
        .then(isConnected => {
          ACELog.d(ACS._TAG, `isNetworkAvailable::in then::isConnected: ${isConnected}`)
          if (isConnected) {
            switch (value.type) {
              case ACParams.TYPE.APPEAR_PRODUCT:
                ACEReducerForOne.appearProduct(
                  callbackForCB,
                  value.name,
                  value.memberKey,
                  value.productId,
                  value.productName,
                  value.productCategoryName,
                  value.productPrice,
                )
                break
              case ACParams.TYPE.BUY_CANCEL:
              case ACParams.TYPE.BUY_DONE:
                ACEReducerForOne.buy(
                  value.type,
                  callbackForCB,
                  value.name,
                  value.memberKey,
                  value.orderNumber,
                  value.payMethodName,
                  value.products,
                )
                break
              case ACParams.TYPE.ADDCART:
              case ACParams.TYPE.DELCART:
                ACEReducerForOne.cart(value.type, callbackForCB, value.memberKey, value.products)
                break
              case ACParams.TYPE.EVENT:
                ACEReducerForOne.plWithPage(callbackForCB, value.name)
                break
              case ACParams.TYPE.JOIN:
                ACEReducerForOne.join(callbackForCB, value.name, value.userId)
                break
              case ACParams.TYPE.LEAVE:
                ACEReducerForOne.leave(callbackForCB, value.name, value.userId)
                break
              case ACParams.TYPE.LINK:
                ACEReducerForOne.link(callbackForCB, value.name, value.linkName, value.memberKey)
                break
              case ACParams.TYPE.LOGIN:
                ACEReducerForOne.login(
                  callbackForCB,
                  value.name,
                  value.userAge,
                  value.userGender,
                  value.userId,
                  value.userMaritalStatus,
                )
                break
              case ACParams.TYPE.PUSH:
                ACEReducerForOne.push(callbackForCB, value.data, value.push)
                break
              case ACParams.TYPE.DEEPLINK:
                const _deeplink_kw = getDeeplinkKeyInURI(
                  decode(value.keyword ?? ACECONSTANT.EMPTY),
                  ACECONSTANT.DeeplinkKeyName,
                )
                if (isEmpty(_deeplink_kw)) {
                  const result: ACEResponseToCaller = {
                    taskHash: `${value.type}::0410`,
                    code: ACEResultCode.InvalidACParamValues,
                    result: ACEConstantCallback[ACEConstantCallback.Failed],
                    message: 'Invalid value in ACParam object.',
                    apiName: value.type,
                  }

                  ACS.toggleLock()
                  ACS.getInstance().popBufferQueueEmit()
                  callback(undefined, result)
                  return
                }
                ACEReducerForOne.deeplink(callbackForCB, _deeplink_kw)
                break
              case ACParams.TYPE.REFERRER:
                const _referrer_kw = getQueryForKey(
                  decode(value.keyword ?? ACECONSTANT.EMPTY),
                  ACECONSTANT.ReferrerKeyName,
                )
                if (isEmpty(_referrer_kw)) {
                  const result: ACEResponseToCaller = {
                    taskHash: `${value.type}::0410`,
                    code: ACEResultCode.InvalidACParamValues,
                    result: ACEConstantCallback[ACEConstantCallback.Failed],
                    message: 'Invalid value in ACParam object.',
                    apiName: value.type,
                  }

                  ACS.toggleLock()
                  ACS.getInstance().popBufferQueueEmit()
                  callback(undefined, result)
                  return
                }
                ACEReducerForOne.referrer(callbackForCB, _referrer_kw)
                break
              case ACParams.TYPE.SEARCH:
                ACEReducerForOne.search(callbackForCB, value.name, value.keyword)
                break
              case ACParams.TYPE.TEL:
                ACEReducerForOne.tel(callbackForCB, value.name, value.memberKey, value.tel)
                break
            }
          } else {
            const result: ACEResponseToCaller = {
              taskHash: `${value.type}::0407`,
              code: ACEResultCode.NotConnectToTheInternet,
              result: ACEConstantCallback[ACEConstantCallback.Failed],
              message: 'Not connect to the internet.',
              apiName: value.type,
            }

            ACS.toggleLock()
            ACS.getInstance().popBufferQueueEmit()
            callback(undefined, result)
          }
        })
        .catch(err => {
          ACELog.e(ACS._TAG, 'isNetworkAvailable::in catch::err', err)
          const result: ACEResponseToCaller = {
            taskHash: `${value.type}::0408`,
            code: ACEResultCode.UnknownConnectStateToTheInternet,
            result: ACEConstantCallback[ACEConstantCallback.Failed],
            message: 'Unknown connect state to the internet.',
            apiName: value.type,
          }

          ACS.toggleLock()
          ACS.getInstance().popBufferQueueEmit()
          callback(undefined, result)
        })
    } else {
      return new Promise((resolveToOut, rejectToOut) => {
        const callbackForPromise = (error?: object, innerResult?: ACEResponseToCaller) => {
          if (error) {
            if (innerResult) {
              rejectToOut(innerResult)
            } else {
              rejectToOut(new Error(`0002, Can not use ${value.type} api.`))
            }
          } else {
            if (innerResult) {
              resolveToOut(innerResult)
            }
          }
          ACS.toggleLock()
          ACS.getInstance().popBufferQueueEmit()
        }

        NetworkUtils.isNetworkAvailable()
          .then(isConnected => {
            ACELog.d(ACS._TAG, `isNetworkAvailable::in then::isConnected: ${isConnected}`)
            if (isConnected) {
              switch (value.type) {
                case ACParams.TYPE.APPEAR_PRODUCT:
                  ACEReducerForOne.appearProduct(
                    callbackForPromise,
                    value.name,
                    value.memberKey,
                    value.productId,
                    value.productName,
                    value.productCategoryName,
                    value.productPrice,
                  )
                  break
                case ACParams.TYPE.BUY_CANCEL:
                case ACParams.TYPE.BUY_DONE:
                  ACEReducerForOne.buy(
                    value.type,
                    callbackForPromise,
                    value.name,
                    value.memberKey,
                    value.orderNumber,
                    value.payMethodName,
                    value.products,
                  )
                  break
                case ACParams.TYPE.ADDCART:
                case ACParams.TYPE.DELCART:
                  ACEReducerForOne.cart(value.type, callbackForPromise, value.memberKey, value.products)
                  break
                case ACParams.TYPE.EVENT:
                  ACEReducerForOne.plWithPage(callbackForPromise, value.name)
                  break
                case ACParams.TYPE.JOIN:
                  ACEReducerForOne.join(callbackForPromise, value.name, value.userId)
                  break
                case ACParams.TYPE.LEAVE:
                  ACEReducerForOne.leave(callbackForPromise, value.name, value.userId)
                  break
                case ACParams.TYPE.LINK:
                  ACEReducerForOne.link(callbackForPromise, value.name, value.linkName, value.memberKey)
                  break
                case ACParams.TYPE.LOGIN:
                  ACEReducerForOne.login(
                    callbackForPromise,
                    value.name,
                    value.userAge,
                    value.userGender,
                    value.userId,
                    value.userMaritalStatus,
                  )
                  break
                case ACParams.TYPE.PUSH:
                  ACEReducerForOne.push(callbackForPromise, value.data, value.push)
                  break
                case ACParams.TYPE.DEEPLINK:
                  const _deeplink_kw = getDeeplinkKeyInURI(
                    decode(value.keyword ?? ACECONSTANT.EMPTY),
                    ACECONSTANT.DeeplinkKeyName,
                  )
                  if (isEmpty(_deeplink_kw)) {
                    const result: ACEResponseToCaller = {
                      taskHash: `${value.type}::0410`,
                      code: ACEResultCode.InvalidACParamValues,
                      result: ACEConstantCallback[ACEConstantCallback.Failed],
                      message: 'Invalid value in ACParam object.',
                      apiName: value.type,
                    }

                    ACS.toggleLock()
                    ACS.getInstance().popBufferQueueEmit()
                    rejectToOut(result)
                    return
                  }
                  ACEReducerForOne.deeplink(callbackForPromise, _deeplink_kw)
                  break
                case ACParams.TYPE.REFERRER:
                  const _referrer_kw = getQueryForKey(
                    decode(value.keyword ?? ACECONSTANT.EMPTY),
                    ACECONSTANT.ReferrerKeyName,
                  )
                  if (isEmpty(_referrer_kw)) {
                    const result: ACEResponseToCaller = {
                      taskHash: `${value.type}::0410`,
                      code: ACEResultCode.InvalidACParamValues,
                      result: ACEConstantCallback[ACEConstantCallback.Failed],
                      message: 'Invalid value in ACParam object.',
                      apiName: value.type,
                    }

                    ACS.toggleLock()
                    ACS.getInstance().popBufferQueueEmit()
                    rejectToOut(result)
                    return
                  }
                  ACEReducerForOne.referrer(callbackForPromise, _referrer_kw)
                  break
                case ACParams.TYPE.SEARCH:
                  ACEReducerForOne.search(callbackForPromise, value.name, value.keyword)
                  break
                case ACParams.TYPE.TEL:
                  ACEReducerForOne.tel(callbackForPromise, value.name, value.memberKey, value.tel)
                  break
              }
            } else {
              const result: ACEResponseToCaller = {
                taskHash: `${value.type}::0407`,
                code: ACEResultCode.NotConnectToTheInternet,
                result: ACEConstantCallback[ACEConstantCallback.Failed],
                message: 'Not connect to the internet.',
                apiName: value.type,
              }

              rejectToOut(result)
              ACS.toggleLock()
              ACS.getInstance().popBufferQueueEmit()
            }
          })
          .catch(err => {
            ACELog.e(ACS._TAG, 'isNetworkAvailable::in catch::err', err)
            const result: ACEResponseToCaller = {
              taskHash: `${value.type}::0408`,
              code: ACEResultCode.UnknownConnectStateToTheInternet,
              result: ACEConstantCallback[ACEConstantCallback.Failed],
              message: 'Unknown connect state to the internet.',
              apiName: value.type,
            }

            ACS.toggleLock()
            rejectToOut(result)
          })
      })
    }
  }

  private static initWaitQueue(): void {
    if (!ACS.waitQueue) {
      ACS.waitQueue = []
    }
  }

  private static setWaitQueue(value: ACParams): void {
    ACS.initWaitQueue()
    ACELog.i(ACS._TAG, `ACS.waitQueue.length: ${ACS.waitQueue.length}`)
    if (ACS.waitQueue.length < ACEConstantInteger.QUEUE_MAX_WAITING_COUNT) {
      ACELog.i(ACS._TAG, `ACS.waitQueue.push: ${value.type}, >>${value.name}<<`)
      ACS.waitQueue.push(value)
    }
  }

  private static initBufferQueue(): void {
    if (!ACS.bufferQueue) {
      ACS.bufferQueue = []
    }
  }

  private static setBufferQueue(value: ACParams): void {
    ACS.initBufferQueue()
    ACELog.i(ACS._TAG, `ACS.bufferQueue.length: ${ACS.bufferQueue.length}`)
    if (ACS.bufferQueue.length < ACEConstantInteger.QUEUE_MAX_BUFFER_COUNT) {
      ACELog.i(ACS._TAG, `ACS.bufferQueue.push: ${value.type}, >>${value.name}<<`)
      ACS.bufferQueue.push(value)
    }
  }

  private static toggleLock(): void {
    this.lock = !this.lock
  }

  private static isLock(): boolean {
    return this.lock
  }
  //#endregion

  //#region AdvertisingIdentifier
  public static setAdvertisingIdentifier(
    isAdvertisingTrackingEnabled: boolean,
    advertisingIdentifier: string | null,
  ): void {
    const result = ACEParameterUtil.validateAdvertisingIdentifier(isAdvertisingTrackingEnabled, advertisingIdentifier)

    ACECommonStaticConfig.setAdvertisingIdentifier(result.isAdEnabled, result.adid)
  }
  //#endregion

  //#region AceWebViewInterface
  public static getKey(): string {
    return ACECommonStaticConfig.getKey()
  }

  public static getDevice(): string {
    return ACEParameterUtil.getModel()
  }

  public static getTS(): string {
    const parameterUtil = ACECommonStaticConfig.getParameterUtil()
    return parameterUtil ? parameterUtil.getTS() : '{}'
  }
  //#endregion
}
