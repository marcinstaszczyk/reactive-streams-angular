import { Base } from '../../angular/Base';
import { Selector } from './Selector';

export function autoSubscribeAllSelectors(componentOrService: Base) {
    Object.getOwnPropertyNames(componentOrService).forEach((property: string) => {
        const fieldValue: unknown = (componentOrService as any)[property];
        if (fieldValue instanceof Selector) {
            fieldValue.autoSubscribe(
                (componentOrService as any).destroy$,
                (value: unknown) => {
                    globalConsoleLogger(componentOrService, property, value);
                    (componentOrService as any)['_last_value_' + property] = value;
                }
            );
        }
    })
}

type SelectorValueListener = (componentOrService: Base, property: string, value: unknown) => void;
const NOOP = () => {};

let globalConsoleLogger: SelectorValueListener = NOOP;

class AppBrowserConsole {

    private fullLoggingEnabled = false;
    private classesToLog = new Set<string>();
    private objectsToLog = new WeakSet<Base>();

    constructor() {
        this.#loadAndEnableLastLogger()
    }

    enableFullLogging(): void {
        this.fullLoggingEnabled = true;
        this.#saveConfig();
        this.#enableGlobalLogger();
    }

    disableFullLogging(): void {
        this.fullLoggingEnabled = false;
        this.#saveAndEnableConditionalLogger();
    }

    clearAllLogging(): void {
        this.fullLoggingEnabled = false;
        this.classesToLog = new Set<string>();
        this.objectsToLog = new WeakSet<Base>();
        this.#saveConfig();
        this.#disableLogger();
    }

    enableClassLogging(objectOrClassName: Base | string): void {
        this.classesToLog.add(typeof objectOrClassName === 'string' ? objectOrClassName : objectOrClassName.constructor.name);
        this.fullLoggingEnabled = false;
        this.#saveAndEnableConditionalLogger();
    }

    disableClassLogging(objectOrClassName: Base | string): void {
        this.classesToLog.delete(typeof objectOrClassName === 'string' ? objectOrClassName : objectOrClassName.constructor.name);
        this.fullLoggingEnabled = false;
        this.#saveAndEnableConditionalLogger();
    }

    enableObjectLogging(object: Base): void {
        this.objectsToLog.add(object);
        this.fullLoggingEnabled = false;
        this.#saveAndEnableConditionalLogger();
    }

    disableObjectLogging(object: Base): void {
        this.objectsToLog.delete(object);
        this.fullLoggingEnabled = false;
        this.#saveAndEnableConditionalLogger();
    }

    #saveAndEnableConditionalLogger(): void {
        this.#saveConfig();
        this.#enableConditionalLogger();
    }

    #loadAndEnableLastLogger(): void {
        this.#restoreConfig();

        if (this.fullLoggingEnabled) {
            this.#enableGlobalLogger();
        } else if (this.classesToLog.size > 0) {
            this.#enableConditionalLogger();
        }
    }

    #enableConditionalLogger(): void {
        globalConsoleLogger = (componentOrService: Base, property: string, value: unknown) => {
            if (this.objectsToLog.has(componentOrService) || this.classesToLog.has(componentOrService.constructor.name)) {
                AppBrowserConsole.logToConsole(componentOrService, property, value);
            }
        };
    }

    #enableGlobalLogger(): void {
        globalConsoleLogger = AppBrowserConsole.logToConsole;
    }

    #disableLogger(): void {
        globalConsoleLogger = NOOP;
    }

    static LOCAL_STORAGE_KEY = 'SelectorsLogging';

    #saveConfig(): void {
        localStorage.setItem(AppBrowserConsole.LOCAL_STORAGE_KEY, JSON.stringify({
            fullLoggingEnabled: this.fullLoggingEnabled,
            classesToLog: Array.from(this.classesToLog)
        }));
    }

    #restoreConfig(): void {
        const state: string | null = localStorage.getItem(AppBrowserConsole.LOCAL_STORAGE_KEY);
        if (!state) {
            return;
        }
        const parsed: any = JSON.parse(state);
        this.fullLoggingEnabled = parsed.fullLoggingEnabled;
        this.classesToLog = new Set(parsed.classesToLog);
    }

    static logToConsole(componentOrService: Base, property: string, value: unknown): void {
        console.log(componentOrService.constructor.name, property, value);
    }
}

(window as any)['MaS'] = new AppBrowserConsole();
