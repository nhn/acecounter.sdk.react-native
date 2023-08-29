import ACEParameters from '../../common/parameter/ACEParameters'
import ACEntityForST from './ACEntityForST'
import ACEntityForVT from './ACEntityForVT'
import {isEmpty} from '../../common/util/TextUtils'
import ADID from '../../common/constant/ADID'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACOneConstant from '../constant/ACOneConstant'
import IACBuyMode from '../constant/IACBuyMode'
import {ACEGender, ACEMaritalStatus} from '../../common/constant/ACEPublicStaticConfig'
import ACOneConstantSt from '../constant/ACOneConstantSt'
import ACOneConstantVt from '../constant/ACOneConstantVt'
import SESSION from '../../common/constant/Session'
import {ACEInnerCBResultKey} from '../../common/constant/ACEInnerCBResultKey'
import ACELog from '../../common/logger/ACELog'
import ACOneConstantInteger from '../constant/ACOneConstantInteger'
import TP from '../constant/TP'
import {ResultAfterSaveInStorage} from './ResultAfterSaveInStorage'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {ResultOfStorage} from '../../common/constant/ResultOfStorage'
import JN from '../constant/JN'

export default class ACEParametersForOne extends ACEParameters {
  private static _TAG = 'paramForOne'
  private static instance: ACEParametersForOne

  private adeld: string
  private adid: string
  private ag: number
  private push: string
  private amt: string

  private ce: string
  private ct: string

  private dm: string

  private gd: string

  private _id: string

  private jn: string

  private kw: string

  private lg: string
  private ll: string

  private md: string
  private memberKey: string
  private mid: string
  private mr: string

  private onum: string

  private payMethod: string
  private pd: string
  private productId: string

  private re: number
  private ref: string
  private ri: string

  private skey: string
  private src: string
  private st: ACEntityForST
  private sts: string
  private sv: string

  private tp: string

  private udf1: number
  private udf2: number
  private udf3: number
  private url: string
  private userId: string

  private vk: number
  private vt: ACEntityForVT

  public static getInstance(): ACEParametersForOne {
    return this.instance || (this.instance = new this())
  }

  private constructor() {
    super()
  }

  public getADELD(): string {
    if (isEmpty(this.adeld)) {
      this.adeld = ADID.disable
    }
    return this.adeld
  }

  public setADELD(value: boolean): void {
    this.adeld = value ? ADID.enable : ADID.disable
  }

  public getADID(): string {
    if (isEmpty(this.adid)) {
      this.adid = ADID.defaultADID
    }
    return this.adid
  }

  public setADID(value: string): void {
    if (isEmpty(value)) {
      this.adid = ADID.defaultADID
    } else {
      this.adid = value
    }
  }

  public getAG(): number {
    if (this.ag < 0) {
      this.ag = 0
    }
    return this.ag
  }

  public setAG(value: number): void {
    if (value < 0) {
      value = 0
    }
    this.ag = value
  }

  public getAMT(): string {
    if (isEmpty(this.amt)) {
      this.amt = ACECONSTANT.EMPTY
    }
    return this.amt
  }

  public setAMT(value: string): void {
    if (isEmpty(value)) {
      this.amt = ACECONSTANT.EMPTY
    } else {
      this.amt = value
    }
  }

  public getCE(): string {
    if (isEmpty(this.ce)) {
      this.ce = ACOneConstant.DefaultCE
    }
    return this.ce
  }

  public setCE(value: string): void {
    if (isEmpty(value)) {
      this.ce = ACOneConstant.DefaultCE
    } else {
      this.ce = value
    }
  }

  public getCT(): string {
    if (isEmpty(this.ct)) {
      this.ct = ACECONSTANT.EMPTY
    }
    return this.ct
  }

  public setCT(value: string): void {
    if (isEmpty(value)) {
      this.ct = ACECONSTANT.EMPTY
    } else {
      this.ct = value
    }
  }

  public getDM(): string {
    if (isEmpty(this.dm)) {
      this.dm = ACECONSTANT.EMPTY
    }
    return this.dm
  }

  public setDM(value: string): void {
    if (isEmpty(value)) {
      this.dm = ACECONSTANT.EMPTY
    } else {
      this.dm = value
    }
  }

  public getGD(): string {
    if (isEmpty(this.gd)) {
      this.gd = ACEGender.Unknown
    }
    return this.gd
  }

  public setGD(value: string): void {
    if (isEmpty(value)) {
      this.gd = ACEGender.Unknown
    } else {
      this.gd = value
    }
  }

  public getID(): string {
    if (isEmpty(this._id)) {
      this._id = ACECONSTANT.EMPTY
    }
    return this._id
  }

  public setID(value: string): void {
    if (isEmpty(value)) {
      this._id = ACECONSTANT.EMPTY
    } else {
      this._id = value
    }
  }

  public getInstallReferrer(callback: (error?: Error | null, result?: ResultOfStorage) => void): void
  public getInstallReferrer(): Promise<ResultOfStorage>
  public getInstallReferrer(
    callback?: (error?: Error | null, result?: ResultOfStorage) => void,
  ): Promise<ResultOfStorage> | void {
    if (!global.Promise) {
      ACELog.d(ACEParametersForOne._TAG, 'getInstallReferrer not support promise.')
      AsyncStorage.getItem(ACECONSTANT.InstallReferrer, (err, result) => {
        ACELog.d(ACEParametersForOne._TAG, `${ACECONSTANT.InstallReferrer}: ${result}`)
        if (callback) {
          callback(err, {
            getKey: ACECONSTANT.InstallReferrer,
            getValue: result,
          })
        }
      })
    } else {
      ACELog.d(ACEParametersForOne._TAG, 'getInstallReferrer support promise.')
      return new Promise((resolve, reject) => {
        AsyncStorage.getItem(ACECONSTANT.InstallReferrer, (err, result) => {
          ACELog.d(ACEParametersForOne._TAG, `${ACECONSTANT.InstallReferrer}: ${result}`)
          if (callback) {
            callback(err, {
              getKey: ACECONSTANT.InstallReferrer,
              getValue: result,
            })
          } else {
            if (err) {
              reject(err)
            } else {
              resolve({
                getKey: ACECONSTANT.InstallReferrer,
                getValue: result,
              })
            }
          }
        })
      })
    }
  }

  public setInstallReferrer(value: string, callback: (error?: Error | null, result?: ResultOfStorage) => void): void
  public setInstallReferrer(value: string): Promise<ResultOfStorage>
  public setInstallReferrer(
    value: string,
    callback?: (error?: Error | null, result?: ResultOfStorage) => void,
  ): Promise<ResultOfStorage> | void {
    if (isEmpty(value)) {
      value = ACECONSTANT.EMPTY
    }

    ACELog.d(ACEParametersForOne._TAG, `${ACECONSTANT.InstallReferrer}: ${value}`)
    if (!global.Promise) {
      ACELog.d(ACEParametersForOne._TAG, 'setInstallReferrer not support promise.')
      AsyncStorage.setItem(ACECONSTANT.InstallReferrer, value, err => {
        if (callback) {
          callback(err, {
            getKey: ACECONSTANT.InstallReferrer,
            getValue: value,
          })
        }
      })
    } else {
      ACELog.d(ACEParametersForOne._TAG, 'setInstallReferrer support promise.')
      return new Promise((resolve, reject) => {
        AsyncStorage.setItem(ACECONSTANT.InstallReferrer, value, err => {
          if (callback) {
            callback(err, {
              getKey: ACECONSTANT.InstallReferrer,
              getValue: value,
            })
          } else {
            if (err) {
              reject(err)
            } else {
              resolve({
                getKey: ACECONSTANT.InstallReferrer,
                getValue: value,
              })
            }
          }
        })
      })
    }
  }

  public getJN(): string {
    if (isEmpty(this.jn)) {
      this.jn = JN.Unknown
    }
    return this.jn
  }

  public setJN(value: string): void {
    if (isEmpty(value)) {
      this.jn = JN.Unknown
    } else {
      this.jn = value
    }
  }

  public getKW(): string {
    if (isEmpty(this.kw)) {
      this.kw = ACECONSTANT.EMPTY
    }
    return this.kw
  }

  public setKW(value: string): void {
    if (isEmpty(value)) {
      this.kw = ACECONSTANT.EMPTY
    } else {
      this.kw = value
    }
  }

  public getLG(): string {
    if (isEmpty(this.lg)) {
      this.lg = ACECONSTANT.EMPTY
    }
    return this.lg
  }

  public setLG(value: string): void {
    if (isEmpty(value)) {
      this.lg = ACECONSTANT.EMPTY
    } else {
      this.lg = value
    }
  }

  public getLL(): string {
    if (isEmpty(this.ll)) {
      this.ll = ACECONSTANT.EMPTY
    }
    return this.ll
  }

  public setLL(value: string): void {
    if (isEmpty(value)) {
      this.ll = ACECONSTANT.EMPTY
    } else {
      this.ll = value
    }
  }

  public getMD(): string {
    if (isEmpty(this.md)) {
      this.md = IACBuyMode.Unknown
    }
    return this.md
  }

  public setMD(value: string): void {
    this.md = value
  }

  public getMemberKey(): string {
    if (isEmpty(this.memberKey)) {
      this.memberKey = ACECONSTANT.EMPTY
    }
    return this.memberKey
  }

  public setMemberKey(value: string): void {
    if (isEmpty(value)) {
      this.memberKey = ACECONSTANT.EMPTY
    } else {
      this.memberKey = value
    }
  }

  public getMID(): string {
    if (isEmpty(this.mid)) {
      this.mid = ACECONSTANT.EMPTY
    }
    return this.mid
  }

  public setMID(value: string): void {
    if (isEmpty(value)) {
      this.mid = ACECONSTANT.EMPTY
    } else {
      this.mid = value
    }
  }

  public getMR(): string {
    if (isEmpty(this.mr)) {
      this.mr = ACEMaritalStatus.Unknown
    }
    return this.mr
  }

  public setMR(value: string): void {
    if (isEmpty(value)) {
      this.mr = ACEMaritalStatus.Unknown
    } else {
      this.mr = value
    }
  }

  public getONUM(): string {
    if (isEmpty(this.onum)) {
      this.onum = ACECONSTANT.EMPTY
    }
    return this.onum
  }

  public setONUM(value: string): void {
    if (isEmpty(value)) {
      this.onum = ACECONSTANT.EMPTY
    } else {
      this.onum = value
    }
  }

  public getPayMethod(): string {
    if (isEmpty(this.payMethod)) {
      this.payMethod = ACECONSTANT.EMPTY
    }
    return this.payMethod
  }

  public setPayMethod(value: string): void {
    if (isEmpty(value)) {
      this.payMethod = ACECONSTANT.EMPTY
    } else {
      this.payMethod = value
    }
  }

  public getPD(): string {
    if (isEmpty(this.pd)) {
      this.pd = ACECONSTANT.EMPTY
    }
    return this.pd
  }

  public setPD(value: string): void {
    if (isEmpty(value)) {
      this.pd = ACECONSTANT.EMPTY
    } else {
      this.pd = value
    }
  }

  public getProductId(): string {
    if (isEmpty(this.productId)) {
      this.productId = ACECONSTANT.EMPTY
    }
    return this.productId
  }

  public setProductId(value: string): void {
    if (isEmpty(value)) {
      this.productId = ACECONSTANT.EMPTY
    } else {
      this.productId = value
    }
  }

  public getPush(): string {
    if (isEmpty(this.push)) {
      this.push = ACECONSTANT.EMPTY
    }
    return this.push
  }

  public setPush(value: string): void {
    if (isEmpty(value)) {
      this.push = ACECONSTANT.EMPTY
    } else {
      this.push = value
    }
  }

  public getRE(): number {
    if (this.re < 0) {
      this.re = 0
    }
    return this.re
  }

  public setRE(value: number): void {
    if (value < 0) {
      value = 0
    }
    this.re = value
  }

  public clearREF(): void {
    this.ref = ACECONSTANT.EMPTY
  }

  public getREF(): string {
    if (isEmpty(this.ref)) {
      this.ref = ACECONSTANT.BOOKMARK
    }
    return this.ref
  }

  public setREF(value: string): void {
    if (isEmpty(value)) {
      this.ref = ACECONSTANT.BOOKMARK
    } else {
      this.ref = value
    }
  }

  public getRI(): string {
    if (isEmpty(this.ri)) {
      this.ri = ACOneConstant.DefaultRI
    }
    return this.ri
  }

  public setRI(value: string): void {
    if (isEmpty(value)) {
      this.ri = ACOneConstant.DefaultRI
    } else {
      this.ri = value
    }
  }

  public getSKEY(): string {
    if (isEmpty(this.skey)) {
      this.skey = ACECONSTANT.EMPTY
    }
    return this.skey
  }

  public setSKEY(value: string): void {
    if (isEmpty(value)) {
      this.skey = ACECONSTANT.EMPTY
    } else {
      this.skey = value
    }
  }

  public getSRC(): string {
    if (isEmpty(this.src)) {
      this.src = ACECONSTANT.EMPTY
    }
    return this.src
  }

  public setSRC(value: string): void {
    if (isEmpty(value)) {
      this.src = ACECONSTANT.EMPTY
    } else {
      this.src = value
    }
  }

  public getST(): ACEntityForST {
    if (!this.st) {
      this.st = new ACEntityForST()
    }
    return this.st
  }

  public setST(value: ACEntityForST): void {
    if (!this.st) {
      this.st = new ACEntityForST()
    } else {
      this.st.setDeepCopy(value.getMap())
    }
  }

  public loadST(callback: ((error?: Error | null, result?: object) => void) | undefined): void
  public loadST(): Promise<object>
  public loadST(callback?: ((error?: Error | null, result?: object) => void) | undefined): Promise<object> | void {
    if (!global.Promise) {
      ACELog.d(ACEParametersForOne._TAG, 'loadST not support promise.')

      AsyncStorage.getItem(ACOneConstantSt.KeyInStorage, (err, result) => {
        ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${result}`)
        if (result) {
          this.setST(JSON.parse(result))
        }

        if (callback) {
          callback(err, {
            getKey: ACOneConstantSt.KeyInStorage,
            getValue: result,
          })
        }
      })
    } else {
      ACELog.d(ACEParametersForOne._TAG, 'loadST support promise.')

      return new Promise((resolve, reject) => {
        AsyncStorage.getItem(ACOneConstantSt.KeyInStorage, (err, result) => {
          ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${result}`)
          if (callback) {
            if (result) {
              this.setST(JSON.parse(result))
            }

            callback(err, {
              getKey: ACOneConstantSt.KeyInStorage,
              getValue: result,
            })
          } else {
            if (err) {
              reject(err)
            } else {
              if (result) {
                this.setST(JSON.parse(result))
              }

              resolve({
                getKey: ACOneConstantSt.KeyInStorage,
                getValue: result,
              })
            }
          }
        })
      })
    }
  }

  public saveST_toInStorage(
    st: ACEntityForST,
    callback: ((error?: Error | null, result?: ResultAfterSaveInStorage) => void) | undefined,
  ): void
  public saveST_toInStorage(st: ACEntityForST): Promise<ResultAfterSaveInStorage>
  public saveST_toInStorage(
    st: ACEntityForST,
    callback?: ((error?: Error | null, result?: ResultAfterSaveInStorage) => void) | undefined,
  ): Promise<ResultAfterSaveInStorage> | void {
    const _json = JSON.stringify(st)
    if (!global.Promise) {
      AsyncStorage.setItem(ACOneConstantSt.KeyInStorage, _json, err => {
        // ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${_json}`)
        if (callback) {
          callback(err, {
            getKey: ACOneConstantSt.KeyInStorage,
            getValue: _json,
          })
        }
      })
    } else {
      return new Promise((resolve, reject) => {
        AsyncStorage.setItem(ACOneConstantSt.KeyInStorage, _json, err => {
          // ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${_json}`)
          if (callback) {
            callback(err, {
              getKey: ACOneConstantSt.KeyInStorage,
              getValue: _json,
            })
          } else {
            if (err) {
              reject(err)
            } else {
              resolve({
                getKey: ACOneConstantSt.KeyInStorage,
                getValue: _json,
              })
            }
          }
        })
      })
    }
  }

  public getSTS(): string {
    if (isEmpty(this.sts)) {
      this.sts = ACECONSTANT.ZERO
    }
    return this.sts
  }

  public setSTS(value: string): void {
    if (isEmpty(value)) {
      this.sts = ACECONSTANT.ZERO
    } else {
      this.sts = value
    }
  }

  public getSV(): string {
    if (isEmpty(this.sv)) {
      this.sv = ACECONSTANT.EMPTY
    }
    return this.sv
  }

  public setSV(value: string): void {
    if (isEmpty(value)) {
      this.sv = ACECONSTANT.EMPTY
    } else {
      this.sv = value
    }
  }

  public getTP(): string {
    if (isEmpty(this.tp)) {
      this.tp = ACECONSTANT.EMPTY
    }
    return this.tp
  }

  public setTP(value: string): void {
    if (isEmpty(value)) {
      this.tp = TP.UNKNOWN
    } else {
      this.tp = value
    }
  }

  public getTZ(): string {
    var _timezoneOffset = new Date().getTimezoneOffset() / 60 + ACOneConstantInteger.TimezoneArrayIndexAtAceServer
    if (_timezoneOffset > 24) {
      _timezoneOffset -= 24
    }

    return _timezoneOffset.toString()
  }

  public getUDF1(): number {
    if (this.udf1 < 0) {
      this.udf1 = 0
    }
    return this.udf1
  }

  public setUDF1(value: number): void {
    if (value < 0) {
      value = 0
    }
    this.udf1 = value
  }

  public getUDF2(): number {
    if (this.udf2 < 0) {
      this.udf2 = 0
    }
    return this.udf2
  }

  public setUDF2(value: number): void {
    if (value < 0) {
      value = 0
    }
    this.udf2 = value
  }

  public getUDF3(): number {
    if (this.udf3 < 0) {
      this.udf3 = 0
    }
    return this.udf3
  }

  public setUDF3(value: number): void {
    if (value < 0) {
      value = 0
    }
    this.udf3 = value
  }

  public getURL(): string {
    if (isEmpty(this.url)) {
      this.url = ACECONSTANT.BOOKMARK
    }
    return this.url
  }

  public setURL(value: string): void {
    if (isEmpty(value)) {
      this.url = ACECONSTANT.BOOKMARK
    } else {
      this.url = value
    }
  }

  public getUserID(): string {
    if (isEmpty(this.userId)) {
      this.userId = ACECONSTANT.EMPTY
    }
    return this.userId
  }

  public setUserID(value: string): void {
    if (isEmpty(value)) {
      this.userId = ACECONSTANT.EMPTY
    } else {
      this.userId = value
    }
  }

  public getVK(): number {
    if (this.vk < 0) {
      this.vk = SESSION.NEW
    }
    return this.vk
  }

  public setVK(value: number): void {
    if (value > SESSION.NEW) {
      value = SESSION.NEW
    } else if (value < SESSION.KEEP) {
      value = SESSION.KEEP
    }

    this.vk = value
  }

  // #region VT
  public getVT(): ACEntityForVT {
    if (!this.vt) {
      this.vt = new ACEntityForVT()
    }
    return this.vt
  }

  public setVT(value: ACEntityForVT): void {
    // ACELog.d(ACEParametersForOne._TAG, `setVT::value`, value)
    // ACELog.d(ACEParametersForOne._TAG, `setVT::before this.vt`, this.vt)
    if (!this.vt) {
      this.vt = new ACEntityForVT()
    }
    this.vt.setDeepCopy(value.getMap())

    // ACELog.d(ACEParametersForOne._TAG, `setVT::after this.vt`, this.vt)
  }

  public setJSONtoVT(value: JSON): void {
    // ACELog.d(ACEParametersForOne._TAG, `setJSONtoVT::value: ${JSON.stringify(value, null, 2)}`)
    // ACELog.d(ACEParametersForOne._TAG, `setJSONtoVT::before this.vt`, this.vt)
    if (!this.vt) {
      this.vt = new ACEntityForVT()
    }
    this.vt.setDeepCopyForJSON(value)

    // ACELog.d(ACEParametersForOne._TAG, `setJSONtoVT::after this.vt`, this.vt)
  }

  public setPcStampWhenNotStored() {
    if (this.vt) {
      this.vt.setPcStampWhenNotStored()
    }
  }

  public loadVT(callback: ((error?: Error | null, result?: object) => void) | undefined): void
  public loadVT(): Promise<object>
  public loadVT(callback?: ((error?: Error | null, result?: object) => void) | undefined): Promise<object> | void {
    if (!global.Promise) {
      AsyncStorage.getItem(ACOneConstantVt.KeyInStorage, (err, result) => {
        ACELog.d(ACEParametersForOne._TAG, 'in loadVT::in cb::result', JSON.parse(result ?? '{"result":"undefined"}'))
        if (callback) {
          if (err) {
            callback(err, {
              code: ACEInnerCBResultKey.FailGetVT,
              result: ACEInnerCBResultKey[ACEInnerCBResultKey.FailGetVT],
            })
          } else {
            if (result) {
              this.setJSONtoVT(JSON.parse(result))
              callback(err, {
                code: ACEInnerCBResultKey.Success,
                result: ACEInnerCBResultKey[ACEInnerCBResultKey.Success],
              })
            } else {
              callback(err, {
                code: ACEInnerCBResultKey.NotExistKey,
                result: ACEInnerCBResultKey[ACEInnerCBResultKey.NotExistKey],
              })
            }
          }
        }
      })
    } else {
      return new Promise((resolve, reject) => {
        AsyncStorage.getItem(ACOneConstantVt.KeyInStorage, (err, result) => {
          ACELog.d(
            ACEParametersForOne._TAG,
            'in loadVT::in Promise::result',
            JSON.parse(result ?? '{"result":"undefined"}'),
          )
          if (callback) {
            if (err) {
              callback(err, {
                code: ACEInnerCBResultKey.FailGetVT,
                result: ACEInnerCBResultKey[ACEInnerCBResultKey.FailGetVT],
              })
            } else {
              if (result) {
                this.setJSONtoVT(JSON.parse(result))
                callback(err, {
                  code: ACEInnerCBResultKey.Success,
                  result: ACEInnerCBResultKey[ACEInnerCBResultKey.Success],
                })
              } else {
                callback(err, {
                  code: ACEInnerCBResultKey.NotExistKey,
                  result: ACEInnerCBResultKey[ACEInnerCBResultKey.NotExistKey],
                })
              }
            }
          } else {
            if (err) {
              reject(err)
            } else {
              if (result) {
                this.setJSONtoVT(JSON.parse(result))
                resolve({
                  code: ACEInnerCBResultKey.Success,
                  result: ACEInnerCBResultKey[ACEInnerCBResultKey.Success],
                })
              } else {
                resolve({
                  code: ACEInnerCBResultKey.NotExistKey,
                  result: ACEInnerCBResultKey[ACEInnerCBResultKey.NotExistKey],
                })
              }
            }
          }
        })
      })
    }
  }

  public saveVT_toInStorage(
    vt: ACEntityForVT,
    callback: ((error?: Error | null, result?: ResultAfterSaveInStorage) => void) | undefined,
  ): void
  public saveVT_toInStorage(vt: ACEntityForVT): Promise<ResultAfterSaveInStorage>
  public saveVT_toInStorage(
    vt: ACEntityForVT,
    callback?: ((error?: Error | null, result?: ResultAfterSaveInStorage) => void) | undefined,
  ): Promise<ResultAfterSaveInStorage> | void {
    const _json = JSON.stringify(vt)
    if (!global.Promise) {
      AsyncStorage.setItem(ACOneConstantVt.KeyInStorage, _json, err => {
        // ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${_json}`)
        if (callback) {
          callback(err, {
            getKey: ACOneConstantVt.KeyInStorage,
            getValue: _json,
          })
        }
      })
    } else {
      return new Promise((resolve, reject) => {
        AsyncStorage.setItem(ACOneConstantVt.KeyInStorage, _json, err => {
          // ACELog.d(ACEParametersForOne._TAG, `${ACOneConstantSt.KeyInStorage}: ${_json}`)
          if (callback) {
            callback(err, {
              getKey: ACOneConstantVt.KeyInStorage,
              getValue: _json,
            })
          } else {
            if (err) {
              reject(err)
            } else {
              resolve({
                getKey: ACOneConstantVt.KeyInStorage,
                getValue: _json,
              })
            }
          }
        })
      })
    }
  }
  // #endregion

  protected getParamsToObject(): ParamsForNetwork {
    return {
      adeld: this.adeld,
      adid: this.adid,
      ag: this.ag,
      push: this.push,
      amt: this.amt,

      ce: this.ce,
      ct: this.ct,

      dm: this.dm,

      gd: this.gd,

      id: this._id,

      jid: this.userId,
      jn: this.jn,

      kw: this.kw,

      lg: this.lg,
      ll: this.ll,

      md: this.md,
      member_key: this.memberKey,
      mid: this.mid,
      mr: this.mr,

      onum: this.onum,

      pay: this.payMethod,
      pd: this.pd,
      pdid: this.productId,

      re: this.re,
      ref: this.ref,
      ri: this.ri,

      skey: this.skey,
      src: this.src,
      st: this.st.getAssembleParams(),
      sts: this.sts,
      sv: this.sv,

      tp: this.tp,
      tz: this.getTZ(),

      udf1: this.udf1,
      udf2: this.udf2,
      udf3: this.udf3,
      url: this.url,

      vk: this.vk,
      vt: this.vt.getAssembleParams(),
    }
  }

  public getParamsToObjectForLogSend(): ParamsForNetwork {
    var toParamsObject = this.getParamsToObject()
    delete toParamsObject.push
    return toParamsObject
  }
}

type ParamsForNetwork = {
  adeld: string
  adid: string
  ag: number
  push?: string
  amt: string

  ce: string
  ct: string

  dm: string

  gd: string

  id: string

  jid: string
  jn: string

  kw: string

  lg: string
  ll: string

  md: string
  member_key: string
  mid: string
  mr: string

  onum: string

  pay: string
  pd: string
  pdid: string

  re: number
  ref: string
  ri: string

  skey: string
  src: string
  st: string
  sts: string
  sv: string

  tp: string
  tz: string

  udf1: number
  udf2: number
  udf3: number
  url: string

  vk: number
  vt: string
}
