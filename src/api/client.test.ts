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

        // Second call (retry) is successful
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: 'success' }), { status: 200 }));

        // Act
        await client.get({ url: '/api/test' });

        // Assert
        // Check that refreshToken was called
        expect(authService.refreshToken).toHaveBeenCalledWith(originalRefreshToken);

        // Check that the request was retried with the new token
        const secondCall = fetchMock.mock.calls[1][0] as Request;
        expect(secondCall.headers.get('Authorization')).toBe(`Bearer ${newAccessToken}`);

        // Check that the tokens are updated in the store
        const state = useAuthStore.getState();
        expect(state.accessToken).toBe(newAccessToken);
        expect(state.refreshToken).toBe(newRefreshToken);
    });

    it('should logout the user and redirect to /login if the refresh token request fails with 401', async () => {
        // Arrange
        const originalAccessToken = 'expired-token';
        const originalRefreshToken = 'invalid-refresh-token';

        useAuthStore.setState({ accessToken: originalAccessToken, refreshToken: originalRefreshToken });

        // First call fails with 401
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));

        // Refresh token call also fails with 401
        vi.mocked(authService.refreshToken).mockRejectedValueOnce(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));

        // Act
        try {
            await client.get({ url: '/api/test' });
        } catch (_error) {
            // ignore
        }

        // Assert
        // Check that refreshToken was called
        expect(authService.refreshToken).toHaveBeenCalledWith(originalRefreshToken);

        // Check that the user is logged out
        const state = useAuthStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();

        // Check that the user is redirected to /login
        expect(window.location.href).toBe('/login');
    });
});
