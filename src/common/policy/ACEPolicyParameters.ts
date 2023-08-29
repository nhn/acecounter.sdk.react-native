import {isEmpty} from '../util/TextUtils'
import ACECONSTANT from '../constant/ACEConstant'

export default class ACEPolicyParameters {
  private cpAllow: string
  private cpApp: number
  private cpCid: string
  private cpDebug: string
  private cpDomain: string
  private cpPrivate: string
  private cpSourceIP: string
  private toastAppKey: string
  private cpCrashDomain: string

  private static instance: ACEPolicyParameters

  public static getInstance(): ACEPolicyParameters {
    return this.instance || (this.instance = new this())
  }

  private constructor() {
    this.setCpAllow(undefined)
    this.setCpApp(0)
    this.setCpCid(undefined)
    this.setCpDebug(undefined)
    this.setCpDomain(undefined)
    this.setCpPrivate(undefined)
    this.setCpSourceIP(undefined)
    this.setToastAppKey(undefined)
  }

  public getCpAllow(): string {
    return this.cpAllow
  }

  public setCpAllow(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpAllow = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpAllow = value
      }
    }
  }

  public getCpApp(): number {
    return this.cpApp
  }

  public setCpApp(value: number | undefined): void {
    if (value === undefined || value < 0) {
      value = 0
    }
    this.cpApp = value
  }

  public getCpCid(): string {
    return this.cpCid
  }

  public setCpCid(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpCid = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpCid = value
      }
    }
  }

  public getCpDebug(): string {
    return this.cpDebug
  }

  public setCpDebug(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpDebug = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpDebug = value
      }
    }
  }

  public getCpDomain(): string {
    return this.cpDomain
  }

  public setCpDomain(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpDomain = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpDomain = value
      }
    }
  }

  public getCpPrivate(): string {
    return this.cpPrivate
  }

  public setCpPrivate(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpPrivate = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpPrivate = value
      }
    }
  }

  public getCpSourceIP(): string {
    return this.cpSourceIP
  }

  public setCpSourceIP(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpSourceIP = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpSourceIP = value
      }
    }
  }

  public getCpCrashDomain(): string {
    return this.cpCrashDomain
  }

  public setCpCrashDomain(value: string | undefined): void {
    if (isEmpty(value)) {
      this.cpCrashDomain = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.cpCrashDomain = value
      }
    }
  }

  public getToastAppKey(): string {
    return this.toastAppKey
  }

  public setToastAppKey(value: string | undefined): void {
    if (isEmpty(value)) {
      this.toastAppKey = ACECONSTANT.EMPTY
    } else {
      if (value) {
        this.toastAppKey = value
      }
    }
  }
}
