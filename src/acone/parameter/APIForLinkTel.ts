import APIForPL from './APIForPL'
import {ITaskParams} from '../../common/task/ITaskParams'
import {AxiosResponse} from 'axios'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACECONSTANT from '../../common/constant/ACEConstant'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'
import ACEofAPIForOne from '../constant/ACEofAPIForOne'
import TP from '../constant/TP'

export default class APIForLinkTel extends APIForPL {
  private static _TAG = 'APIForLinkTel'

  private linkName: string
  private memberKey: string
  private tel: string
  public constructor(params: ITaskParams) {
    ACELog.d(APIForLinkTel._TAG, 'in constructor')
    super(params)
    this.linkName = params.payload.linkName ?? ACECONSTANT.EMPTY
    this.memberKey = params.payload.memberKey ?? ACECONSTANT.EMPTY
    this.tel = params.payload.tel ?? ACECONSTANT.EMPTY
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork((error?: object, innerResult?: ACEResponseToCaller) => {
      ACELog.d(APIForLinkTel._TAG, 'in doWork::in cb')
      if (error && callback) {
        callback(error, innerResult)
      } else if (callback) {
        const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        _parameterUtilForOne.setMemberKey(this.memberKey)
        switch (this.getLogSource()) {
          case ACEofAPIForOne.TrackLinkEvent:
            _parameterUtilForOne.setTP(TP.LINK)
            _parameterUtilForOne.setRefWithBundleID(this.linkName)
            break
          case ACEofAPIForOne.TrackTelEvent:
            _parameterUtilForOne.setTP(TP.TEL)
            _parameterUtilForOne.setRefForTel(this.tel)
            break
        }
        callback(undefined, innerResult)
      }
    })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForLinkTel._TAG, 'didWork')
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForLinkTel._TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForLinkTel._TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForLinkTel._TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    //#region clear
    _parameterUtilForOne.clearMemberKey()
    _parameterUtilForOne.clearREF()
    //#endregion
  }
}
