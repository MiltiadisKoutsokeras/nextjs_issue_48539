#!/usr/bin/env bash

################################################################################
# Quick installation of Node.js 16 LTS via NVM
# Author: Miltiadis Koutsokeras <miltos@langaware.com>
################################################################################

### Script setup
_SELF_="$(basename "$(readlink -e "${BASH_SOURCE[0]}")" && echo X)" && \
readonly _SELF_="${_SELF_%$'\nX'}"
_SELFDIR_="$(dirname "$(readlink -e "${BASH_SOURCE[0]}")" && echo X)" && \
readonly _SELFDIR_="${_SELFDIR_%$'\nX'}"

### Includes
# Nothing

### Constants
readonly NVM_VERSION='v0.39.1'
readonly NVM_INSTALL_URI="https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh"
readonly NVM_INSTALL_SCRIPT="/tmp/nvm-${NVM_VERSION}-install.sh"

### Global variables
# Nothing

### Functions
echo_red_bold() {
  echo -e "\\e[1m\\e[31m${*}\\e[0m"
}

echo_green_bold() {
  echo -e "\\e[1m\\e[32m${*}\\e[0m"
}

################################################################################
# Main program

if type curl &>/dev/null;
then
    curl --output "${NVM_INSTALL_SCRIPT}" "${NVM_INSTALL_URI}"
elif type wget &>/dev/null;
then
    wget --quiet --output-document="${NVM_INSTALL_SCRIPT}" "${NVM_INSTALL_URI}"
else
    echo_red_bold 'You need to install curl or wget program! Aborting...'
    exit 1
fi

echo_green_bold "Installing NVM"
bash "${NVM_INSTALL_SCRIPT}"

echo_green_bold "Setting up NVM"
export NVM_DIR="$HOME/.nvm"
# Load NVM
[ -s "${NVM_DIR}/nvm.sh" ] && source "${NVM_DIR}/nvm.sh"
nvm --version
nvm install 16 --lts
nvm use default 16

################################################################################
