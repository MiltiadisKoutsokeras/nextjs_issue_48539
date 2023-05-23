import useSWR, { Fetcher, KeyedMutator } from "swr"

export type UserData = {
    username: string
    firstName?: string
    lastName?: string
}

export type UserState = {
    userData?: UserData
    setUserData: KeyedMutator<UserData>
    isLoading: boolean
    isError: boolean
    errorMessage?: string
}

const fetchUserData: Fetcher<UserData, string> = async (
    fetchUserDataUri: string,
) => {
    try {
        // Call the API Route to update session
        const reqInfo: RequestInfo = fetchUserDataUri
        const reqInit: RequestInit = { method: "GET" }
        const response = await fetch(reqInfo, reqInit)
        const data = await response.json()

        if (response.status !== 200) {
            throw Error(
                "HTTP[" +
                response.status +
                "] User data fetch error! Details: " +
                data.message,
            )
        }

        return {
            username: data.username,
            firstName: data?.first_name,
            lastName: data?.last_name
        } as UserData
    } catch (exc) {
        // TODO: Handle error better
        throw exc as Error
    }
}

export default function useUserState(): UserState {
    // Call API Route to get the user data from the Iron Session if it exists
    // We use Stale-While-Revalidate (SWR) Hook instead of fetching every time.
    const {
        data: userData,
        error,
        isValidating,
        mutate,
    } = useSWR<UserData, Error>("/api/user_data", fetchUserData)

    return {
        userData: userData,
        setUserData: mutate,
        isLoading: (!error && !userData) || isValidating,
        isError: error ? true : false,
        errorMessage: error?.message,
    }
}
