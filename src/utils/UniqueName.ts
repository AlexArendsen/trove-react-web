export const UniqueName = (desiredName: string, takenNames: Set<string>) => {

    if (!takenNames.has(desiredName)) return desiredName
    let attempts = 2
    while (takenNames.has(`${desiredName} (${attempts})`)) {
        ++attempts;
        if (attempts >= 100) return `${desiredName}#${new Date().getTime()}`
    }
    return `${desiredName} (${attempts})`

}