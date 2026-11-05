/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * CommunityBond Development DNS Bootstrap
 *
 * PURPOSE:
 * Configure custom DNS servers before
 * Next.js and Better Auth initialize.
 *
 * CommonJS uses require() instead of import.
 */

const dns = require("node:dns");
const dnsPromises = require("node:dns/promises");

const dnsServers = ["1.1.1.1", "8.8.8.8"];

dns.setServers(dnsServers);
dnsPromises.setServers(dnsServers);

console.log(
  "[CommunityBond] DNS configured:",
  dnsPromises.getServers().join(", ")
);