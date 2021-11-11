import { ApiError } from "./ApiError"

export class ApiData<TData> {

	loading: boolean
	data: TData | null
    error: any

	constructor(initialData: TData | null = null) {
        this.loading = false
        this.data = initialData
        this.error = null
	}

    startLoading(data: TData | null = null) {
        const out = new ApiData<TData>()
        out.loading = true;
        out.data = data;
        out.error = null;
        return out;
    }

    succeeded(data: TData) {
        const out = new ApiData<TData>()
        out.loading = false;
        out.data = data;
        out.error = null;
        return out;
    }

    failed(error: ApiError) {
        const out = new ApiData<TData>()
        out.loading = false;
        out.error = error;
        return out;
    }

}