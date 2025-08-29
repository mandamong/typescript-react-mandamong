import { client } from '@/api/client.gen';
import { authService } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/AuthService', () => ({
    authService: {
        refreshToken: vi.fn(),
    },
}));

vi.mock('@/contexts/SnackbarContext', () => ({
    useSnackbar: () => ({
        showSnackbar: vi.fn(),
    }),
}));

import { setupErrorInterceptor } from './interceptor';

describe('API Client Interceptor', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        useAuthStore.setState({ accessToken: null, refreshToken: null, user: null });

        fetchMock = vi.fn();
        global.fetch = fetchMock;

        client.setConfig({ baseUrl: 'http://localhost:8080' });

        Object.defineProperty(window, 'location', {
            value: {
                href: '',
            },
            writable: true,
        });

        setupErrorInterceptor(vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should refresh token and retry the request on 401 error', async () => {
        const originalAccessToken = 'expired-token';
        const originalRefreshToken = 'valid-refresh-token';
        const newAccessToken = 'new-access-token';
        const newRefreshToken = 'new-refresh-token';

        useAuthStore.setState({ accessToken: originalAccessToken, refreshToken: originalRefreshToken });

        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));

        vi.mocked(authService.refreshToken).mockResolvedValueOnce({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            id: 1,
        });
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: 'success' }), { status: 200 }));
        await client.get({ url: '/api/test' });
        expect(authService.refreshToken).toHaveBeenCalledWith(originalRefreshToken);
        const secondCall = fetchMock.mock.calls[1][0] as Request;
        expect(secondCall.headers.get('Authorization')).toBe(`Bearer ${newAccessToken}`);
        const state = useAuthStore.getState();
        expect(state.accessToken).toBe(newAccessToken);
        expect(state.refreshToken).toBe(newRefreshToken);
    });

    it('should logout the user and redirect to /login if the refresh token request fails with 401', async () => {
        const originalAccessToken = 'expired-token';
        const originalRefreshToken = 'invalid-refresh-token';

        useAuthStore.setState({ accessToken: originalAccessToken, refreshToken: originalRefreshToken });
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
        vi.mocked(authService.refreshToken).mockRejectedValueOnce(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
        try {
            await client.get({ url: '/api/test' });
        } catch (_error) {
        }
        expect(authService.refreshToken).toHaveBeenCalledWith(originalRefreshToken);
        const state = useAuthStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(window.location.href).toBe('/login');
    });
});
