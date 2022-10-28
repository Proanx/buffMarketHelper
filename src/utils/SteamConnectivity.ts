import ConnectStatus from "src/enum/SteamConnectStatus";
import { writable, type Writable } from 'svelte/store';

export default class Steam {
    static Connectivity: Writable<ConnectStatus> = writable(ConnectStatus.Unknow);
}