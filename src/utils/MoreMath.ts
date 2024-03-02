export const MoreMath = {

    Clamp: (value: number, max: number, min: number) => Math.min(max, Math.max(min, value)),
    Sum: (nums: number[]) => nums.reduce((sum, n) => sum + n, 0)

}