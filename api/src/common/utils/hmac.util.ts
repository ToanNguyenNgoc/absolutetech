import * as crypto from 'crypto';

export function generateSignature(payload: any, secret: string): string {
    const json = JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(json).digest('hex');
}
