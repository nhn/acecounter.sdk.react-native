import {ACEConstantCallback, ACEResponseToCaller, ACEResultCode} from '../constant/ACEPublicStaticConfig'
import {isEmpty} from './TextUtils'
import Task from '../task/Task'

export function printConsoleMap(map: Map<string, string | object>): void {
  for (var i = 0, keys = Object.keys(map), ii = keys.length; i < ii; i++) {
    console.log(keys[i] + '|' + map[keys[i]].list)
  }
}

export function mapValueObjectToObject(map: Map<string, object>) {
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}

export function mapValueStringToObject(map: Map<string, string>) {
  return Array.from(map).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {})
}

export function makeSuccessCallbackParams(task: Task): ACEResponseToCaller
export function makeSuccessCallbackParams(task: Task, message: string): ACEResponseToCaller
export function makeSuccessCallbackParams(task: Task, message?: string): ACEResponseToCaller {
  var innerMsg: string = ACEConstantCallback.DefaultMessage
  if (!isEmpty(message) && message) {
    innerMsg = message
  }

  const _response = task.getNetworkResult()
  if (_response) {
    return {
      taskHash: task.getTaskHash(),
      code: ACEResultCode.Success,
      result: ACEConstantCallback[ACEConstantCallback.Success],
      message: innerMsg,
      apiName: task.getDescription(),
      reseponse: task.getNetworkResultToResponseToCaller(),
    }
  } else {
    return {
      taskHash: task.getTaskHash(),
      code: ACEResultCode.Success,
      result: ACEConstantCallback[ACEConstantCallback.Success],
      message: innerMsg,
      apiName: task.getDescription(),
      reseponse: {
        message: '_response is undefined.',
      },
    }
  }
}

export function makeFailCallbackParams(task: Task): ACEResponseToCaller
export function makeFailCallbackParams(task: Task, message: string): ACEResponseToCaller
export function makeFailCallbackParams(task: Task, message?: string): ACEResponseToCaller {
  var innerMsg: string = ACEConstantCallback.DefaultMessage
  if (message && !isEmpty(message)) {
    innerMsg = message
  }

  const _err = task.getNetworkError()
  if (_err) {
    return {
      taskHash: task.getTaskHash(),
      code: ACEResultCode.FailAfterRequest,
      result: ACEConstantCallback[ACEConstantCallback.Failed],
      message: innerMsg,
      apiName: task.getDescription(),
      reseponse: task.getNetworkErrorToResponseToCaller(),
    }
  } else {
    return {
      taskHash: task.getTaskHash(),
      code: ACEResultCode.FailAfterRequest,
      result: ACEConstantCallback[ACEConstantCallback.Failed],
      message: innerMsg,
      apiName: task.getDescription(),
      reseponse: {
        message: 'err is undefined.',
      },
    }
  }
}
