import ControlTower from '../../common/controltower/ControlTower'
import ACELog from '../../common/logger/ACELog'

export default class ACEControlTowerForOne extends ControlTower {
  private static _TAG = 'towerForOne'
  public constructor() {
    super()
  }

  public setIsCompletePolicy(isCompletePolicy: boolean, isSucceedRequestPolicy: boolean) {
    super.setIsCompletePolicy(isCompletePolicy, isSucceedRequestPolicy)
    if (this.isDisabled()) {
      return
    }

    if (isCompletePolicy && isSucceedRequestPolicy) {
      // 정상 정책 수신 후 대기큐 정리 위치
    } else if (!isSucceedRequestPolicy) {
      ACELog.d(ACEControlTowerForOne._TAG, 'failed receive policy will disable SDK.')
      this._isSDKEnabled = isSucceedRequestPolicy
    }

    this._isCompletePolicy = isCompletePolicy
  }
}
