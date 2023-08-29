import APIForPL from './APIForPL'
import {ITaskParams} from '../../common/task/ITaskParams'
import {AxiosResponse} from 'axios'
import {ACEGender, ACEMaritalStatus, ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'

export default class APIForLogin extends APIForPL {
  private static _TAG = 'APIForLogin'

  private userAge: number
  private userGender: ACEGender
  private userId: string
  private userMaritalStatus: ACEMaritalStatus
  public constructor(params: ITaskParams) {
    ACELog.d(APIForLogin._TAG, 'in constructor')
    super(params)
    this.userAge = params.payload.userAge ?? 0
    this.userGender = params.payload.userGender ?? ACEGender.Unknown
    this.userId = params.payload.userId ?? ACECONSTANT.EMPTY
    this.userMaritalStatus = params.payload.userMaritalStatus ?? ACEMaritalStatus.Unknown
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork((error?: object, innerResult?: ACEResponseToCaller) => {
      ACELog.d(APIForLogin._TAG, 'in doWork::in cb')
      if (error && callback) {
        callback(error, innerResult)
      } else if (callback) {
        const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        _parameterUtilForOne.setUserAge(this.userAge)
        _parameterUtilForOne.setUserGender(this.userGender)
        _parameterUtilForOne.setLoginUserID(this.userId)
        _parameterUtilForOne.setUserMaritalStatus(this.userMaritalStatus)
        callback(undefined, innerResult)
      }
    })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForLogin._TAG, 'didWork')
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForLogin._TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForLogin._TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForLogin._TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    //#region clear
    _parameterUtilForOne.clearUserAge()
    _parameterUtilForOne.clearUserGender()
    _parameterUtilForOne.clearLoginUserID()
    _parameterUtilForOne.clearUserMaritalStatus()
    //#endregion
  }
}
