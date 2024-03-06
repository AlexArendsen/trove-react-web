import { AssertionError } from "assert";
import { ActionNames } from "../../redux/models/ActionNames";
import { GlobalState } from "../../redux/models/GlobalState";
import { MutexEnter, MutexExit, MutexFail } from "../MutexManager/MutexManager";

export type ErrorDetails = {
    httpHint: number,
    error: any
}

/**@deprecated This implementation of the data plan concept is tied to Redux, which we no longer use */
export class DataPlan<TResult> {

    action?: () => Promise<TResult>;
    onSuccess: (result: TResult) => any;
    onError: (error: ErrorDetails) => ErrorDetails;
    uniqueKey: string;
	cacheSelector?: (s: GlobalState) => TResult | null;
    mutexReuseResult?: boolean;
    assertions: { test: (() => boolean), message: string }[];
	reduxActions?: ActionNames;
	subject: any;

    constructor(uniqueKey: string) {
        this.uniqueKey = uniqueKey;
        this.onSuccess = (_: TResult) => _;
        this.onError = (_: any) => _;
        this.mutexReuseResult = true;
        this.assertions = [];
    }

    do(action: () => Promise<TResult>): DataPlan<TResult> {
        this.action = action;
        return this;
    }

	assert(assertion: (() => boolean), errorMessage: string) {
		this.assertions.push({ test: assertion, message: errorMessage });
		return this;
	}

	withReduxActions(names: ActionNames): DataPlan<TResult> {
		this.reduxActions = names;
		return this;
	}

	withSubject(subject: any): DataPlan<TResult> {
		this.subject = subject;
		return this;
	}

    withDataHandler(handler: (data: TResult) => any): DataPlan<TResult> {
        this.onSuccess = handler
        return this;
    }

    withErrorHandler(handler: (error: ErrorDetails) => ErrorDetails): DataPlan<TResult> {
        this.onError = handler
        return this;
    }

    withCached(selector: (state: GlobalState) => TResult | null): DataPlan<TResult> {
		this.cacheSelector = selector;
        return this;
    }

    withoutMutex(): DataPlan<TResult> {
        this.mutexReuseResult = false;
        return this;
    }

    run() {

		if (!this.action) {
			const message = `${ this.uniqueKey }: cannot run(), no action provided.`;
			console.error(message);
			throw new Error(message)
		}

		return async (dispatch: (action: any) => void, getState: () => GlobalState) => {

			//const useMutex = this.mutexReuseResult !== undefined;
			const useMutex = false;

			const handleError = (e: any) => {
				const robj = { type: this.reduxActions?.failure, error: e, subject: this.subject };
				if (this.reduxActions) dispatch(robj)
				if (useMutex) MutexFail(this.uniqueKey, e)
				return this.onError({
					httpHint: typeof(e.httpHint) === 'number' ? e.httpHint : 500,
					error: e
				})
			}

			for(const a of this.assertions) if (!a.test()) return handleError(new Error(a.message))

			if (this.reduxActions) dispatch({ type: this.reduxActions.loading, subject: this.subject })

			let result: TResult | null = null;

			try {

				// Raise mutex semaphore
				if (useMutex) {
					const result = await MutexEnter(this.uniqueKey)
					if (result && this.mutexReuseResult) {
						if (this.reduxActions) dispatch({ type: this.reduxActions.success, data: result });
						return this.onSuccess(result);
					}
				}

				// Check cache
				if (!!this.cacheSelector) {
					const cached = this.cacheSelector(getState())
					if (cached) {
						if (this.reduxActions) dispatch({ type: this.reduxActions.success, data: cached });
						return this.onSuccess(cached);
					}
				}

				// Collect result
				// @ts-ignore
				result = await this.action();

				// Lower mutex semaphore
				if (useMutex) MutexExit(this.uniqueKey, result)

				//@ts-ignore
				result = this.onSuccess(result);
				if (this.reduxActions) dispatch({ type: this.reduxActions.success, data: result, subject: this.subject })

			} catch (e: any) {
				return handleError(e);
			}


		}

    }

}