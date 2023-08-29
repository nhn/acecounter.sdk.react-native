import Task from '../../common/task/Task'
import {ITaskParams} from '../../common/task/ITaskParams'
import {ACENetwork} from '../../common/http/ACENetwork'
import {AxiosResponse} from 'axios'
import ACEPolicyParameterUtil from '../../common/policy/ACEPolicyParameterUtil'
import ControlTowerSingleton from '../../common/controltower/ControlTowerSingleton'
import {makeSuccessCallbackParams, makeFailCallbackParams} from '../../common/util/MapUtil'
import {ACEResponseToCaller} from '../../common/constant/ACEPublicStaticConfig'
import ACELog from '../../common/logger/ACELog'
import {ACEResultCode, ACEConstantCallback} from '../../common/constant/ACEPublicStaticConfig'

export default class APIForPolicy extends Task {
  private static _TAG = 'APIForPolicy'
  public constructor(params: ITaskParams) {
    super(params)
  }

  public doWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doWork(callback)
    if (callback) {
      const res: ACEResponseToCaller = {
        taskHash: `${this._logSource}::0011`,
        code: ACEResultCode.Success,
        result: ACEConstantCallback[ACEConstantCallback.Success],
        message: 'Done doWork to policy.',
        apiName: this.getDescription(),
      }
      callback(undefined, res)
    }
  }

  public didWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined): void {
    super.didWork(callback)

    ACENetwork.requestToPolicy(
      response => {
        ACELog.d(APIForPolicy._TAG, 'in requestToPolicy, completed')
        this.completed(response)
        this.doneWork(callback)
      },
      err => {
        ACELog.d(APIForPolicy._TAG, 'in requestToPolicy, failed')
        this.failed(err)
        this.doneWork(callback)
      },
    )
  }

  public doneWork(callback: ((error?: object, result?: ACEResponseToCaller) => void) | undefined) {
    super.doneWork(callback)
    if (callback) {
      if (this._error) {
        callback(this.getNetworkError(), makeFailCallbackParams(this))
      } else {
        callback(undefined, makeSuccessCallbackParams(this))
      }
    }
  }

  public completed(response: AxiosResponse) {
    super.completed(response)
    ACELog.d(APIForPolicy._TAG, 'completed, before savePolicy')
    ACEPolicyParameterUtil.getInstance().savePolicy(this._response)
    ACELog.d(APIForPolicy._TAG, 'completed, after savePolicy')
    ControlTowerSingleton.getInstance().succeedRequestPolicy()
  }

  public failed(err: any) {
    super.failed(err)
    ControlTowerSingleton.getInstance().failedRequestPolicy()
  }
}
