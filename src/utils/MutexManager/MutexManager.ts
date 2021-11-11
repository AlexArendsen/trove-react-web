let semaphores: { [key: string]: Partial<{ resolve: (value: any) => any, reject: (error: any) => any, promise: Promise<any> }> } = {}

export const MutexEnter = (key: string): Promise<any> => {
    if (semaphores[key]?.promise) {
        //@ts-ignore
        return semaphores[key].promise;
    } else {
        semaphores[key] = {}
        const p = new Promise((resolve, reject) => {
            semaphores[key] = { ...semaphores[key], resolve, reject }
        })
        semaphores[key] = { ...semaphores[key], promise: p }
        return Promise.resolve(undefined)
    }
}

export const MutexExit = (key: string, value: any) => {
    //@ts-ignore
    if (semaphores[key]?.resolve) semaphores[key]?.resolve(value)
    delete semaphores[key];
}

export const MutexFail = (key: string, error: any) => {
    //@ts-ignore
    if (semaphores[key]?.reject) semaphores[key]?.reject(value)
    delete semaphores[key]; // Note: I checked any this doesn't crash even if `key` isn't in `semaphores`
}