import https from 'https';
import http from 'http';
import crypto from 'crypto';

const BUCKET = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || '';
const CDN_URL = process.env.S3_CDN_URL || process.env.AWS_CLOUDFRONT_URL || '';
const REGION = process.env.AWS_REGION || 'us-east-1';
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || '';
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType = 'application/octet-stream'
): Promise<{ key: string; url: string }> {
  if (!BUCKET || !ACCESS_KEY) {
    // S3 not configured — return placeholder
    console.warn('[storage] S3 not configured, returning placeholder URL');
    const url = CDN_URL
      ? `${CDN_URL.replace(/\/$/, '')}/${key}`
      : `https://placeholder.zunoglass.com/${key}`;
    return { key, url };
  }

  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as string);
  const host = `${BUCKET}.s3.${REGION}.amazonaws.com`;
  const path = `/${key}`;
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dateOnly = dateStamp.slice(0, 8);

  const payloadHash = crypto.createHash('sha256').update(buf).digest('hex');
  const headers: Record<string, string> = {
    'content-type': contentType,
    'host': host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': dateStamp,
  };

  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalHeaders = Object.keys(headers).sort().map(k => `${k}:${headers[k]}`).join('\n') + '\n';
  const canonicalRequest = ['PUT', path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const credentialScope = `${dateOnly}/${REGION}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', dateStamp, credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

  const hmac = (key: Buffer | string, data: string) =>
    crypto.createHmac('sha256', key).update(data).digest();
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${SECRET_KEY}`, dateOnly), REGION), 's3'), 'aws4_request');
  const signature = hmac(signingKey, stringToSign).toString('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  await new Promise<void>((resolve, reject) => {
    const req = https.request({
      hostname: host,
      path,
      method: 'PUT',
      headers: { ...headers, 'content-length': buf.length, 'authorization': authorization },
    }, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve();
      else {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => reject(new Error(`S3 PUT failed: ${res.statusCode} ${body}`)));
      }
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });

  const url = CDN_URL
    ? `${CDN_URL.replace(/\/$/, '')}/${key}`
    : `https://${host}/${key}`;

  return { key, url };
}
