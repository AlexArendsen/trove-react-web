type TokenResolver = () => Promise<string>
let _resolver: TokenResolver | null = null;
export const SetTokenResolver = (resolver: TokenResolver): void => { _resolver = resolver; }

export const GetToken = async (): Promise<string | null> => {
    if (!_resolver) return null;
    return await _resolver();
}