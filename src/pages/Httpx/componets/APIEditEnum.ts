import { IObjGet } from '@/api';

export const HeadersEnum: IObjGet = {
  Host: { text: 'Host', label: 'Host' },
  Accept: { text: 'Accept', label: 'Accept' },
  Authorization: { text: 'Authorization', label: 'Authorization' },
  Connection: { text: 'Connection', label: 'Connection' },
  Cookie: { text: 'Cookie', label: 'Cookie' },
  From: { text: 'From', label: 'From' },
  Referer: { text: 'Referer', label: 'Referer' },
  UserAgent: { text: 'User-Agent', label: 'User-Agent' },
};
export const FormDataTypeEnum: IObjGet = {
  'application/octet-stream': {
    text: 'application/octet-stream',
    label: 'application/octet-stream',
  },
  'application/json': { text: 'application/json', label: 'application/json' },
  'application/xml': { text: 'application/xml', label: 'application/xml' },
  'text/plain': { text: 'text/plain', label: 'text/plain' },
  'text/html': { text: 'text/html', label: 'text/html' },
};
