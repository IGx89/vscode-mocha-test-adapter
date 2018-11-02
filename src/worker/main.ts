import { WorkerArgs } from '../util';
import { createClient } from '../ipc/client';
import { loadTests } from './loadTests';
import { runTests } from './runTests';

const workerArgs = <WorkerArgs>JSON.parse(process.argv[2]);
const { action, ipcPort } = workerArgs;

if (ipcPort) {
	createClient(ipcPort).then(ipcClient => {
		const sendMessage = (message: any) => ipcClient.sendMessage(message);
		doWorkerAction(sendMessage, () => ipcClient.dispose());
	});
} else {
	const sendMessage = process.send ? (message: any) => process.send!(message) : console.log;
	doWorkerAction(sendMessage);
}

function doWorkerAction(sendMessage: (message: any) => void, onFinished?: () => void) {
	({ loadTests, runTests })[action](workerArgs, sendMessage, onFinished);
}
