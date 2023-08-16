export const MakePrintingStack = (maxDepth: number, maxPushes: number) => {
    let data: any[] = []
    let pushes = 0
    return {
        push: (value: string) => {
            if (++pushes > maxPushes) throw new Error('Maximum number of pushes exceeded')
            data.push(value)
            console.log(data.join(' > '))
            if (data.length > maxDepth) throw new Error('Maximum stack depth exceeded')
        },
        pop: (comment?: string) => {
            if (comment) console.log(data.join(' < ') + ` // ${comment}`)
            else console.log(data.join(' < '))
            data.pop()
        }
    }
}