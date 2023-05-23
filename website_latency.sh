#!/usr/bin/env bash

################################################################################
# Utility for measuring Website latency.
# Authors:
# Miltiadis Koutsokeras <miltos@langaware.com>
################################################################################

### Script setup
_SELF_="$(basename "$(readlink -e "${BASH_SOURCE[0]}")" && echo X)" && \
readonly _SELF_="${_SELF_%$'\nX'}"
_SELFDIR_="$(dirname "$(readlink -e "${BASH_SOURCE[0]}")" && echo X)" && \
readonly _SELFDIR_="${_SELFDIR_%$'\nX'}"

### Includes
# Nothing

### Constants
readonly OUTPUT_FORMAT='
Testing Website Response Time for :%{url_effective}

Response code:\t\t%{http_code}
Number of redirects:\t\t%{num_redirects}
Lookup Time:\t\t%{time_namelookup}
Connect Time:\t\t%{time_connect}
AppCon Time:\t\t%{time_appconnect}
Redirect Time:\t\t%{time_redirect}
Pre-transfer Time:\t%{time_pretransfer}
Start-transfer Time:\t%{time_starttransfer}

Total Time:\t\t%{time_total}
'

### Global variables
# Nothing

### Functions

function print_usage() {
	echo "${_SELF_} WEBSITE_URL"
	echo "For example: ${_SELF_} https://www.google.com"
}

################################################################################
# Main program

if [ "${1:-NOT_SET}" = "NOT_SET" ]
then
  print_usage
  exit 1
fi

if ! type curl &>/dev/null
then
    echo "You need to install the curl program!"
    exit 1
fi

echo "Starting the latency check..."
echo "Press Ctrl+C to stop the program..."

while true
do
    curl -s -w  "${OUTPUT_FORMAT}" -o /dev/null "${1}"
done

################################################################################
