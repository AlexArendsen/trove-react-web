import { useMemo } from "react"
import { useLocation } from "react-router"

export const useQueryParams = () => {

	const location = useLocation();
	return useMemo(() => {
		if (!location) return {}
		const lookup: Record<string, string> = {}
		new URLSearchParams(location.search).forEach((val, key) => lookup[key] = val)
		return lookup;
	}, [ location?.search ])

}