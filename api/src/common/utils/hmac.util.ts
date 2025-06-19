import * as crypto from 'crypto';

export function generateSignature(payload: any, secret: string): string {
    const json = JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(json).digest('hex');
}

export function generateSyncSignature(
    payload: any,
    timestamp: string,
    nonce: string,
    secret: string,
): string {
    const normalizedPayload = normalizeEmptyStringsToNull(payload);
    const sortedPayload = sortObject(normalizedPayload);
    console.log('Sorted Payload:', sortedPayload);
    const jsonPayload = JSON.stringify(sortedPayload);
    const message = jsonPayload + timestamp + nonce;

    return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function sortObject(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj)
            .sort()
            .reduce((result: any, key: string) => {
                result[key] = sortObject(obj[key]);
                return result;
            }, {});
    }
    return obj;
}

function normalizeEmptyStringsToNull(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(normalizeEmptyStringsToNull);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            newObj[key] = val === '' ? null : normalizeEmptyStringsToNull(val);
        }
        return newObj;
    }
    return obj;
}
