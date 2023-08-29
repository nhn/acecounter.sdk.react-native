import APIForPL from './APIForPL'
import {ITaskParams} from '../../common/task/ITaskParams'
import {AxiosResponse} from 'axios'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'

export default class APIForSearch extends APIForPL {
  private static _TAG = 'APIForSearch'

  private keyword: string
  public constructor(params: ITaskParams) {
    ACELog.d(APIForSearch._TAG, 'in constructor')
    super(params)
    this.keyword = params.payload.keyword ?? ACECONSTANT.EMPTY
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork((error?: object, innerResult?: ACEResponseToCaller) => {
      ACELog.d(APIForSearch._TAG, 'in doWork::in cb')
      if (error && callback) {
        callback(error, innerResult)
      } else if (callback) {
        const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        _parameterUtilForOne.setKeyword(this.keyword)
        _parameterUtilForOne.makeInsenginetTS()
        callback(undefined, innerResult)
      }
    })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForSearch._TAG, 'didWork')
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForSearch._TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForSearch._TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForSearch._TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    //#region clear
    _parameterUtilForOne.clearKeyword()
    //#endregion
  }
}
