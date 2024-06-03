interface RequestApiProps<T> {
    path: string
    body?: T
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
}

interface Response<T> {
    data: T
}

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
}

const RequestApi = async <T,TR>({path, body, method}: RequestApiProps<T>): Promise<Response<TR>> => {
    const fullPath = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
    
    const res = await fetch(fullPath, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            ...headers,
            "id-token": "" 
        },
    });
    
    if (!res.ok) {
        throw new Error("Failed to " + method + ", path: " + fullPath);
    }

    if (res.status > 299) {
        throw new Error("Server error " + method + ", path: " + fullPath + ", status: " + res.status, { cause: res });
    }

    const {data} = await res.json();
    return data;
};

export default RequestApi