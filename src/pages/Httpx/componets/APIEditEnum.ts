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
  1: { text: 'application/octet-stream', label: 'application/octet-stream' },
  2: { text: 'application/json', label: 'application/json' },
  3: { text: 'application/xml', label: 'application/xml' },
  4: { text: 'text/plain', label: 'text/plain' },
  5: { text: 'text/html', label: 'text/html' },
};
