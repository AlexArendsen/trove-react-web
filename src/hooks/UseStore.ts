import { useSelector } from 'react-redux';
import { GlobalState } from "../redux/models/GlobalState";

export const useStore = <TResult>(selector: (state: GlobalState) => TResult) => {
	return useSelector(selector);
}