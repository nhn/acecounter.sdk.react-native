export default interface IEventForWorker {
  // onStartForAPI: (params?: ITaskParams) => void
  // onFinish: (message: string, logsource?: number) => void
  // onError: (err: string) => void
  popWaitQueue: () => void
  popBufferQueue: () => void
}
