import useBreakpoint from "use-breakpoint"

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 }
export const useWindowSize = () => {
    const { breakpoint, minWidth, maxWidth } = useBreakpoint(BREAKPOINTS);
    const scale = breakpoint === 'mobile' ? 0.87 : 0.93
    return {
        size: breakpoint,
        scale,
        isMobile: breakpoint === 'mobile',
        isNonMobile: breakpoint !== 'mobile',
        minWidth, maxWidth
    }
}