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
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Partial<Blob> & { [Symbol.toStringTag]?: unknown };
    return (
        typeof (v as Blob).type === 'string' &&
        typeof v.stream === 'function' &&
        typeof v.arrayBuffer === 'function' &&
        typeof v[Symbol.toStringTag] === 'string' &&
        v[Symbol.toStringTag] === 'Blob'
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
    } catch (_err) {
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
