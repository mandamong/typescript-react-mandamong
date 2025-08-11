import {describe, expect, it} from 'vitest';
import {validateEmail} from './useLoginForm';

describe('useLoginForm', () => {
    describe('validateEmail', () => {
        it('should return true for a valid email', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('hello.world@domain.co.uk')).toBe(true);
        });

        it('should return false for an invalid email', () => {
            expect(validateEmail('plainaddress')).toBe(false);
            expect(validateEmail('@missing-local-part.com')).toBe(false);
            expect(validateEmail('local-part@missing-domain')).toBe(false);
            expect(validateEmail('local-part@.com')).toBe(false);
            expect(validateEmail('test@domain..com')).toBe(false);
        });
    });
});
