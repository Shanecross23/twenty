// src/utils/ip-utils.ts
import { isIPv4, isIPv6 } from 'net';

/**
 * Determines family
 * @param ip - The IP address
 * @returns 4 for IPv4, 6 for IPv6, or throws an error
 */
export const getIpFamily = (ip: string): 4 | 6 => {
  if (isIPv4(ip)) {
    return 4;
  } else if (isIPv6(ip)) {
    return 6;
  } else {
    throw new Error(`Invalid IP address: ${ip}`);
  }
};
