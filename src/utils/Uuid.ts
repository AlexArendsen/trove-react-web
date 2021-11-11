// This is literally so I can just have a named import called "uuid" instead of having to remember that it's called "v4"
import { v4 } from 'uuid';
export const uuid = () => v4()