import APIForPL from './APIForPL'
import {ITaskParams} from '../../common/task/ITaskParams'
import {AxiosResponse} from 'axios'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'

export default class APIForJoinLeave extends APIForPL {
  private static _TAG = 'APIForJoinLeave'

  private userId: string
  public constructor(params: ITaskParams) {
    ACELog.d(APIForJoinLeave._TAG, 'in constructor')
    super(params)
    this.userId = params.payload.userId ?? ACECONSTANT.EMPTY
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork((error?: object, innerResult?: ACEResponseToCaller) => {
      ACELog.d(APIForJoinLeave._TAG, 'in doWork::in cb')
      if (error && callback) {
        callback(error, innerResult)
      } else if (callback) {
        const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        _parameterUtilForOne.setJN(this._logSource)
        _parameterUtilForOne.setJoinOrLeaveUserID(this.userId)
        callback(undefined, innerResult)
      }
    })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForJoinLeave._TAG, 'didWork')
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForJoinLeave._TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForJoinLeave._TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForJoinLeave._TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    //#region clear
    _parameterUtilForOne.clearJn()
    _parameterUtilForOne.clearJoinOrLeaveUserID()
    //#endregion
  }
}
