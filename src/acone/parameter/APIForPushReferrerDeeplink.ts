import Task from '../../common/task/Task'
import {ITaskParams} from '../../common/task/ITaskParams'
import {ACENetwork} from '../../common/http/ACENetwork'
import {AxiosResponse} from 'axios'
import {makeSuccessCallbackParams, makeFailCallbackParams} from '../../common/util/MapUtil'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import ACEParameterUtilForOne from './ACEParameterUtilForOne'
import TP from '../constant/TP'
import ACECONSTANT from '../../common/constant/ACEConstant'
import {ACEResultCode, ACEConstantCallback} from '../../common/constant/ACEPublicStaticConfig'
import ACEntityForVT from './ACEntityForVT'
import ACEntityForST from './ACEntityForVT'
import ACEofAPIForOne from '../constant/ACEofAPIForOne'
import SRC from '../../common/constant/SRC'

export default class APIForPushReferrerDeeplink extends Task {
  private static _p1TAG = 'APIForPushReferrerDeeplink'
  protected _willUpdateVt?: ACEntityForVT
  protected _willUpdateSt?: ACEntityForST
  protected _kw: string

  public constructor(params: ITaskParams) {
    super(params)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'in constructor, params:', params)
    this._kw = params.payload.keyword ?? ACECONSTANT.EMPTY
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork(callback)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'doWork')

    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    _parameterUtilForOne.setTP(TP.MCLICK)
    _parameterUtilForOne.updateUrlToRef(ACECONSTANT.EMPTY)
    _parameterUtilForOne.setKW(this._kw)
    switch (this.getLogSource()) {
      case ACEofAPIForOne.DeepLink:
        _parameterUtilForOne.setSRC(SRC.Deeplink)
        break
      case ACEofAPIForOne.InstallReferrer:
        _parameterUtilForOne.setSRC(SRC.InstallReferrer)
        break
      case ACEofAPIForOne.Push:
        _parameterUtilForOne.setSRC(SRC.Push)
        break
    }

    _parameterUtilForOne
      .loadVT()
      .then(response => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'Done load vt.', response)
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'vt after loadVT()', _parameterUtilForOne.getVT())
        return _parameterUtilForOne.updateSTnVT(this.assignWillUpdateVt())
      })
      .then(response => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'Done update st and vt.', response)
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'vt after updateSTnVT()', _parameterUtilForOne.getVT())
      })
      .then(() => {
        if (this.getLogSource() === ACEofAPIForOne.InstallReferrer) {
          ACELog.d(APIForPushReferrerDeeplink._p1TAG, `SDK will update install referrer to: ${this._kw}`)
          _parameterUtilForOne.setInstallReferrer(this._kw)
        }
      })
      .then(() => {
        if (callback) {
          const res: ACEResponseToCaller = {
            taskHash: `${this._logSource}::0011`,
            code: ACEResultCode.Success,
            result: ACEConstantCallback[ACEConstantCallback.Success],
            message: 'Done update st, vt and set referrer.',
            apiName: this.getDescription(),
          }
          callback(undefined, res)
        }
      })
      .catch(err => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'Fail load st and vt.', err)
        if (callback) {
          const res: ACEResponseToCaller = {
            taskHash: `${this._logSource}::0012`,
            code: ACEResultCode.FailLoadVT,
            result: ACEConstantCallback[ACEConstantCallback.Failed],
            message: 'Fail load vt.',
            apiName: this.getDescription(),
          }
          callback(err, res)
        }
      })
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'didWork')

    ACENetwork.requestToLog(
      response => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'in requestToLog, completed')
        this.completed(response)
        this.doneWork(callback)
      },
      err => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'in requestToLog, failed')
        this.failed(err)
        this.doneWork(callback)
      },
    )
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'completed')
  }

  public failed(err: any) {
    super.failed(err)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'failed')
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    ACELog.d(APIForPushReferrerDeeplink._p1TAG, 'doneWork')
    const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
    _parameterUtilForOne
      .resetSessionAndParameterAfterSendWithParams({
        vt: this.assignWillUpdateVt(),
      })
      .then(result => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, `resetSessionAndParameterAfterSendWithParams::result: ${result}`)
        //#region clear
        const __parameterUtilForOne = ACEParameterUtilForOne.getInstance()
        __parameterUtilForOne.clearSRC()
        __parameterUtilForOne.clearKW()
        //#endregion

        if (callback) {
          if (this._error) {
            callback(this.getNetworkError(), makeFailCallbackParams(this))
          } else {
            callback(undefined, makeSuccessCallbackParams(this))
          }
        }
      })
      .catch(err => {
        ACELog.d(APIForPushReferrerDeeplink._p1TAG, `resetSessionAndParameterAfterSendWithParams::err: ${err}`)
        if (callback) {
          if (this._error) {
            callback(this.getNetworkError(), makeFailCallbackParams(this))
          } else {
            callback(undefined, makeSuccessCallbackParams(this))
          }
        }
      })
  }

  protected assignWillUpdateSt(): ACEntityForST {
    if (!this._willUpdateSt) {
      const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
      this._willUpdateSt = new ACEntityForST()
      this._willUpdateSt.setDeepCopy(_parameterUtilForOne.getST().getMap())
    }

    return this._willUpdateSt
  }

  protected assignWillUpdateVt(): ACEntityForVT {
    if (!this._willUpdateVt) {
      const _parameterUtilForOne = ACEParameterUtilForOne.getInstance()
      this._willUpdateVt = new ACEntityForVT()
      this._willUpdateVt.setDeepCopy(_parameterUtilForOne.getVT().getMap())
    }

    return this._willUpdateVt
  }
}
