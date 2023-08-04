export const TASK_ITEM_DATA_SUBKEY = '_task_data'

export interface SymbolicDate {
    year: number
    month: number // 1 = January
    day: number // 1 = 1st
}
 
export interface TaskItemData {
    nTimes: number // 1 = "Once", 2 = "Twice", etc.
    interval: 'day' | 'week' | 'month' | 'year' | 'ever'
    each: number // "Every" = 1, "Every other" = 2, "Every third" = 3, etc.
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime'
    daysOfWeek?: number[] // 0 = Monday, 6 = Sunday
    startDate: SymbolicDate
    endDate?: SymbolicDate
}

const now = new Date()
export const DEFAULT_TASK_ITEM_DATA: TaskItemData = {
    nTimes: 1,
    interval: 'day',
    each: 1,
    timeOfDay: 'anytime',
    daysOfWeek: [0,1,2,3,4],
    startDate: {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate()
    }
}