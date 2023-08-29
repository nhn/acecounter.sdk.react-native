import SafeEmitter from '../event/SafeEmitter'
import IEventForWorker from '../event/IEventForWorker'

export class EventsForWorkerEmitter extends SafeEmitter<IEventForWorker> {}
