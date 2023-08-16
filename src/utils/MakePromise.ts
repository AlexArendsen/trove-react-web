export const MakePromise = <TData = void>(): {
    promise: Promise<TData>
    reject: (reason: any) => void
    resolve: (result: TData) => void
} => {

    let resolve: ((result: TData) => void) | undefined = undefined
    let reject: ((reason: any) => void) | undefined = undefined
    const promise = new Promise<TData>((res, rej) => {
        reject = rej
        resolve = res
    })
    while (resolve === null) {
        console.log('Waiting for resolve...')
    }

    return { promise, reject: reject as any, resolve: resolve as any }

}