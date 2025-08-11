export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};

export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

export const isStringWithValue = (value: unknown): value is string => {
    return isString(value) && value !== '';
};

export const isBlob = (value: unknown): value is Blob => {
    return (
        typeof value === 'object' &&
        value !== null &&
        'type' in value && typeof (value as Blob).type === 'string' &&
        'stream' in value && typeof (value as Blob).stream === 'function' &&
        'arrayBuffer' in value && typeof (value as Blob).arrayBuffer === 'function' &&
        typeof (value as any)[Symbol.toStringTag] === 'string' &&
        (value as any)[Symbol.toStringTag] === 'Blob'
    );
};

export const isFormData = (value: unknown): value is FormData => {
    return value instanceof FormData;
};

export const isSuccess = (status: number): boolean => {
    return status >= 200 && status < 300;
};

export const base64 = (str: string): string => {
    try {
        return btoa(str);
    } catch (err) {
        return 'An unknown error occurred.';
    }
};

export const getQueryString = (params: Record<string, unknown>): string => {
    const qs: string[] = [];

    const append = (key: string, value: unknown) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    const process = (key: string, value: unknown) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            } else if (isDefined(value) && typeof value === 'object') {
                Object.entries(value as object).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
};
