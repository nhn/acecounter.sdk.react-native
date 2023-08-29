import {isEmpty} from '../util/TextUtils'
import ACECONSTANT from '../../common/constant/ACEConstant'

export default class ACEParameters {
  protected isNeedSetNewSession: boolean
  protected patch: string

  public getIsNeedSetNewSession(): boolean {
    return this.isNeedSetNewSession
  }

  public setIsNeedSetNewSession(value: boolean): void {
    this.isNeedSetNewSession = value
  }

  public getPatch(): string {
    if (isEmpty(this.patch)) {
      this.patch = ACECONSTANT.PATCH
    }
    return this.patch
  }

  public setPatch(value: string): void {
    if (isEmpty(value)) {
      this.patch = ACECONSTANT.PATCH
    } else {
      this.patch = value
    }
  }
}
