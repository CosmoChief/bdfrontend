//const vaultApi = 'http://localhost:8031/'
const vaultApi = 'http://3.144.209.124:8031/'
var isLp = false;
var isConnected = false;
var updaterTime = 20000; //20 secs
var vaultWeb3 = null;
var accounts = [];
var tokenPrices = [];
var vaultAbi = [{"inputs": [], "stateMutability": "nonpayable", "type": "constructor"}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
        "indexed": true,
        "internalType": "uint256",
        "name": "pid",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "Deposit",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
    }, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {
        "indexed": true,
        "internalType": "uint256",
        "name": "pid",
        "type": "uint256"
    }, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "Withdraw",
    "type": "event"
}, {
    "inputs": [],
    "name": "babydoge",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    }],
    "name": "calcRewardsUser",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "key", "type": "uint256"}, {
        "internalType": "contract IERC20",
        "name": "_tokenStake",
        "type": "address"
    }, {"internalType": "contract IERC20", "name": "_tokenReward", "type": "address"}, {
        "internalType": "bool",
        "name": "_isLp",
        "type": "bool"
    }, {"internalType": "uint256", "name": "_vaultDays", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_minLockDays",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "createVault",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "_lockDays",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "value", "type": "uint256"}],
    "name": "deposit",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}, {
        "internalType": "address",
        "name": "_user",
        "type": "address"
    }],
    "name": "getUserInfo",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "key", "type": "uint256"}],
    "name": "getVaultId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}],
    "name": "getVaultInfo",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }, {"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}],
    "name": "getVaultToken",
    "outputs": [{
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
    }, {"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_taxForNonBabyDogeCoin", "type": "uint256"}],
    "name": "setTaxForNonBabyDogeCoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [],
    "name": "taxForNonBabyDogeCoin",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "name": "totalDay",
    "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "name": "userInfo",
    "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "rewardTotal", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "rewardWithdraw",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "lockTime", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "lockDays",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "lastRewardDay", "type": "uint256"}, {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "vaultInfo",
    "outputs": [{"internalType": "uint256", "name": "amountReward", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "vaultTokenTax",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "startVault", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "vaultDays",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "minLockDays", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "userCount",
        "type": "uint256"
    }, {"internalType": "uint256", "name": "usersAmount", "type": "uint256"}, {
        "internalType": "uint256",
        "name": "usersWeight",
        "type": "uint256"
    }, {"internalType": "bool", "name": "isLpVault", "type": "bool"}, {
        "internalType": "bool",
        "name": "paused",
        "type": "bool"
    }, {"internalType": "uint256", "name": "lastTotalDay", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "vaultKeys",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "vaultToken",
    "outputs": [{
        "internalType": "contract IERC20",
        "name": "tokenStake",
        "type": "address"
    }, {"internalType": "contract IERC20", "name": "tokenReward", "type": "address"}, {
        "internalType": "address",
        "name": "vaultCreator",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{"internalType": "uint256", "name": "_vid", "type": "uint256"}],
    "name": "withdrawTax",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}];

var minimalAbiToken = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]


var vaultAddress = "0xD97732fd84c9F392D0386a24259d84220035CE9a"
var token;
var tokens = [];
var vault;

function loadContract(address) {
    return new vaultWeb3.eth.Contract(minimalAbiToken, vaultWeb3.utils.toChecksumAddress(address));
}

function loadVaultContract() {
    vault = new vaultWeb3.eth.Contract(vaultAbi, vaultAddress);
    return vault;
}

async function setupEth() {
    if (window.ethereum) {
        await window.ethereum.request({method: 'eth_requestAccounts'})
        vaultWeb3 = new Web3(window.ethereum);
        accounts = await vaultWeb3.eth.getAccounts()

        vaultWeb3.eth.net.getId().then((result) => {
            if (result !== 97) {
                $('#ConnectNetworkModal').addClass('show');
            }
        })

        if (typeof accounts !== 'undefined' && accounts.length > 0) {
            refreshList(accounts[0])
        }

        window.ethereum.on('accountsChanged', function (account) {
            if (typeof account !== 'undefined' && account.length > 0) {
                $('.close-modal').click();
                $('#CreateVaultModal').modal('hide');
                accounts[0] = account[0];
                refreshList(account[0])
                return;
            } else {
                accounts[0] = 0;
                $('.connectWallet').html('Connect wallet');
                $('#ConnectWalletModal').addClass('show');
                isConnected = false;
            }
            resetView();
        })

        window.ethereum.on('chainChanged', function (networkId) {
            if (networkId !== '0x38' && networkId !== '0x61') {
                $('#ConnectNetworkModal').addClass('show');
            } else {
                $('#ConnectNetworkModal').removeClass('show');
                refreshList(accounts[0])
            }
        })

    }
}


const ethEnabled = async () => {
    if (window.ethereum) {
        await window.ethereum.request({method: 'eth_requestAccounts'})
        vaultWeb3 = new Web3(window.ethereum);
        accounts = await vaultWeb3.eth.getAccounts()

        vaultWeb3.eth.net.getId().then((result) => {
            if (result !== 97) {
                $('#ConnectNetworkModal').addClass('show');
            }
        })

        window.ethereum.on('accountsChanged', function (account) {
            if (typeof account !== 'undefined' && account.length > 0) {
                $('.close-modal').click();
                $('#CreateVaultModal').modal('hide');
                accounts[0] = account[0];
                refreshList(accounts[0])
                return;
            } else {
                accounts[0] = 0x0;
                $('.connectWallet').html('Connect wallet');
                $('#ConnectWalletModal').addClass('show');
                isConnected = false;
            }
            resetView();
        })

        window.ethereum.on('chainChanged', function (networkId) {
            if (networkId !== '0x38' && networkId !== '0x61') {
                $('#ConnectNetworkModal').addClass('show');
            } else {
                $('#ConnectNetworkModal').removeClass('show');
            }
        })

        return true;
    }
    return false;
}

getTVL();
setupEth();

function refreshList(acccount) {
    setWalletName(acccount);
    listPinned();
    listVaults();
}


const resetView = () => {
    $('#connectWallet').html('Connect Wallet');
}

const setWalletName = (address) => {
    if (address) {
        isConnected = true;
        $('#ConnectWalletModal').removeClass('show');
        $('.connectWallet').html(address.slice(0, 13).concat('...'));
        execApiShardCall('api/bind', {address}, 'POST');
    }
}

async function execApiShardCall(path, param, method = 'POST') {
    await fetch(vaultApi + path, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
    });
}

async function getVaultInfo() {
    //total staked
    //total rewards
    //end date
}

async function getUserRewards() {
    //get user rewards on vault
}

async function listPinned(search = "", sort = "", isLp = false) {
    $('.pinned-loader').removeClass('d-none')

    await fetch(vaultApi + "api/vaults/pinned", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    }).then(async (responseJson) => {
        $('.removable-pinned').remove();
        if (responseJson.data.length > 0) {
            $('#pinnedText').show();
            const vaultContract = loadVaultContract()

            for (var i = 0; i <= responseJson.data.length; i++) {
                var obj = responseJson.data[i];
                await buildPinned(obj, vaultContract)
            }
        } else {
            $('#pinnedText').hide();
        }
    });
}

function searchVaults() {
    var value = $('#search_vaults').val();
    if (value.length >= 3) {
        listVaults(value)
    }
}

async function listVaults(search = "", isMobile = false) {
    $('#accordionVaults').html("");
    $('.loader').removeClass('d-none');

    let isClosed = $('#closed').is(":checked");
    let isStaked = $('#stakedOnly').is(":checked");
    let sort = $('#sort').val()

    if (isMobile) {
        isClosed = $('#responsive_closed').is(":checked");
        isStaked = $('#responsive_stakedOnly').is(":checked");
        sort = $('#sortMobile').val()
    }


    await fetch(vaultApi + "api/vaults", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            closed: isClosed,
            staked: isStaked,
            address: accounts[0].toLowerCase(),
            search,
            sort,
            isLp
        })
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    }).then(async (responseJson) => {
        if (responseJson.data.length > 0) {
            $('#textVault').show();
            const vaultContract = loadVaultContract();
            let element = "";
            for (var i = 0; i < responseJson.data.length; i++) {
                var obj = responseJson.data[i];
                element += await buildRow(obj, vaultContract)
            }
            $('.loader').addClass('d-none');
            $('.accordion').html('')
            $('.accordion').append(element)

        } else {
            $('.loader').addClass('d-none');
            $('#textVault').hide();
        }
    });
}


async function buildRow(data, vaultContract) {
    //accordion-item
    var element = $('#template').clone(true);

    element.addClass('removable')

    const stakeContract = data.stake_contract;
    const rewardContract = data.reward_contract;

    element.find('.do-stake')
        .attr('onclick', 'stake("' + stakeContract + '", "' + data.vid + '")')

    element.find('.do-unstake')
        .attr('onclick', 'unstake("' + stakeContract + '", "' + data.vid + '")')
        .attr('id', 'do-unstake-' + data.vid)


    element.find('.stake-input')
        .attr('id', 'stake-input-' + data.vid)

    element.find('#button-stake-max-')
        .attr('id', 'button-stake-max-' + data.vid)

    element.find('#stake-button-')
        .attr('id', 'stake-button-' + data.vid)


    //vault-totat-votes-50

    var currentDate = moment().unix();

    const endDate = data.end;

    element.find('#enable-button-')
        .attr('id', 'enable-button-' + data.vid)

    if (currentDate > endDate) {
        element.find('.approved-stake')
            .prop('disabled', true)
            .html('VAULT CLOSED')

        element.find('#enable-button-' + data.vid)
            .removeClass('btn-primary')
            .addClass('btn-error')
    } else {
        element.find('.approved-stake')
            .attr('onclick', 'approveStake("' + stakeContract + '", "' + data.vid + '")')

    }

    element.find('.button-max-unstake')
        .attr('onclick', 'getMaxUnstake("' + stakeContract + '", "' + data.vid + '")')

    element.find('.do-claim')
        .attr('onclick', 'claim("' + rewardContract + '", "' + data.vid + '")')
        .attr('id', 'do-claim-' + data.vid)

    element.find('.button-max')
        .attr('onclick', 'getMax("' + stakeContract + '", "' + data.vid + '")')

    element.find('#pinned-modal-total-stake-')
        .attr('id', 'pinned-modal-total-stake-' + data.vid)

    element.find('#pinned-modal-stake-')
        .attr('id', 'pinned-modal-stake-' + data.vid)

    element.find('#heading-acc-').attr('id', 'heading-acc-' + data.vid);
    element.find('#content-acc-').attr('id', 'content-acc-' + data.vid);

    element.find('#pinned-vote-count-')
        .attr('id', 'pinned-vote-count-' + data.vid)
        .html(data.votes);

    element.find('.stake-tab-button')
        .attr('data-bs-target', '#stake-form-' + data.vid)

    element.find('#stake-form-')
        .attr('id', 'stake-form-' + data.vid)

    element.find('.unstake-tab-button')
        .attr('data-bs-target', '#unstake-form-' + data.vid)

    element.find('#unstake-form-')
        .attr('id', 'unstake-form-' + data.vid)

    element.find('.unstake-input')
        .attr('id', 'unstake-input-' + data.vid)

    element.find('#vault-vote-')
        .attr('id', 'vault-vote-' + data.vid)
        .attr('onclick', 'vote(' + data.vid + ')')

    element.find('#body-')
        .attr('id', 'body-' + data.vid)
        .attr('data-bs-target', '#content-acc-' + data.vid)
        .attr('aria-controls', 'content-acc-' + data.vid)

    element.find('.pinned-claimed')
        .attr('id', 'pinned-claimed-' + data.vid)


    let nameToken = data.name.split('Earn');
    let nameFinal = "<span class='name-token me-1 small bg-primary text-white'>"+nameToken[0]+"</span>&nbsp;<span class='name-token me-1 small bg-primary text-white'>Earn"+nameToken[1]+"</span>"


    element.find('.name-vault').html(nameFinal)

    element.find('#vault_end_date').html(moment.unix(data.end).format("MM/DD/YYYY"));

    let tokenContract = new vaultWeb3.eth.Contract(minimalAbiToken, data.reward_contract);
    let tokenStakeContract = new vaultWeb3.eth.Contract(minimalAbiToken, data.stake_contract);

    const decimals = await tokenContract.methods.decimals().call();
    const stakeDecimals = await tokenStakeContract.methods.decimals().call();

    let unit = getUnit(decimals);
    let stakeUnit = getUnit(stakeDecimals);

    const value = vaultWeb3.utils.fromWei(data.reward_amount.toString(), unit);

    let vaultInfo = await vaultContract.methods.getVaultInfo(data.vid).call()
    let userData = await vaultContract.methods.getUserInfo(data.vid, accounts[0]).call()
    let claimedTotal = vaultWeb3.utils.fromWei(userData[3].toString(), unit);

    let earned = 0;

    let userAmount = vaultWeb3.utils.fromWei(userData[0].toString(), unit);
    let totalStaked = vaultWeb3.utils.fromWei(vaultInfo[7].toString(), stakeUnit);
    let userRewards = 0;

    try {
        earned = await vaultContract.methods.calcRewardsUser(data.vid, accounts[0]).call()
        userRewards = parseFloat(vaultWeb3.utils.fromWei(earned, unit)).toFixed(2);
    } catch (e) {
        earned = 0;
        userRewards = 0;
    }

    element.find('.total-staked-row')
        .attr('id', 'pinned-modal-total-stake-' + data.vid).html(parseFloat(totalStaked).toFixed(2))

    element.find('.staked-row')
        .attr('id', 'pinned-modal-stake-' + data.vid).html(parseFloat(userAmount).toFixed(2))

    element.find('.pinned-modal-tvl-')
        .attr('id', 'pinned-modal-tvl-' + data.vid).html(data.usd_rewards_value === null ? "No Total Yet" : formatMoney(Math.floor(data.usd_rewards_value)))

    element.find('.earned-row')
        .attr('id', 'earned-row-' + data.vid).html(userRewards)


    element.find('#pinned-claimed-' + data.vid).html(claimedTotal)

    element.find('.vault-reward').html(value.toString())

    element.find('.apr')
        .attr('id', 'pinned-apr-' + data.vid)
        .html(
            data.apr == null ?
                'To be calculated' :
                parseFloat(data.apr).toFixed(2) + '%')

    let tokenImgMain = './public/icons/noimagetoken.jpeg'
    let tokenImgSecondary = './public/icons/noimagetoken.jpeg'

    //remove - testnet replacement
    switch (data.reward_contract) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            data.reward_contract = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            data.reward_contract = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            data.reward_contract = '0x55d398326f99059ff775485246999027b3197955';
            break;
        case '0x8f5e9d875254f5cc8f6d25fd88b5413e6e11811d': //fakelp
            data.reward_contract = '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0';
            break;
    }

    switch (data.stake_contract) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            data.stake_contract = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            data.stake_contract = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            data.stake_contract = '0x55d398326f99059ff775485246999027b3197955';
            break;
        case '0x8f5e9d875254f5cc8f6d25fd88b5413e6e11811d': //fakelp
            data.stake_contract = '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0';
            break;

    }
    //remove - testnet replacement

    if (data.is_lp === "false") {
        if (data.token_icon_id !== 0) {
            tokenImgMain = './public/' + data.stake_image_main;
            tokenImgSecondary = './public/' + data.stake_image_main
            if (data.stake_contract !== data.reward_contract) {
                tokenImgSecondary = './public/' + data.reward_image_main
            }
        }
    } else {
        let tokenImgMainLp
        let tokenImgSecondaryLp
        if (data.token_icon_id !== 0) {
            if (data.stake_contract === data.reward_contract) {
                tokenImgMain = './public/' + data.stake_image_main;
                tokenImgSecondary = './public/' + data.stake_image_lp_image
                tokenImgMainLp = './public/' + data.stake_image_main;
                tokenImgSecondaryLp = './public/' + data.stake_image_lp_image
            } else {
                element.find('.lp-icons').removeClass('hide');
                //both lps
                if (data.stake_image_lp_image.trim().length !== 0 && data.reward_image_lp_image.trim().length !== 0) {
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = './public/' + data.stake_image_lp_image
                    tokenImgMainLp = './public/' + data.reward_image_main;
                    tokenImgSecondaryLp = './public/' + data.reward_image_lp_image
                } else if (data.stake_image_lp_image.trim().length !== 0) {
                    element.find('.sample2-lp').hide();
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = './public/' + data.stake_image_lp_image
                    tokenImgMainLp = './public/' + data.reward_image_main
                    tokenImgSecondaryLp = '';
                } else {
                    element.find('.sample2').hide();
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = ''
                    tokenImgMainLp = './public/' + data.reward_image_main
                    tokenImgSecondaryLp = './public/' + data.reward_image_lp_image
                }
            }
        }
        element.find('.row-icon-lp').attr('src', tokenImgMainLp);
        element.find('.row-icon-secondary-lp').attr('src', tokenImgSecondaryLp);
    }

    element.find('.row-icon').attr('src', tokenImgMain);
    element.find('.row-icon-secondary').attr('src', tokenImgSecondary);


    element.show();

    return element.wrapAll("<div class='removable' />").parent().html();
}

async function buildPinned(data, vaultContract) {

    if (data === undefined) {
        return false;
    }

    var element = $('#pinned-item-:first').clone(true);

    let tokenContract = new vaultWeb3.eth.Contract(minimalAbiToken, data.reward_contract);
    let tokenStakeContract = new vaultWeb3.eth.Contract(minimalAbiToken, data.stake_contract);

    const decimals = await tokenContract.methods.decimals().call();
    const stakeDecimals = await tokenStakeContract.methods.decimals().call();

    let unit = getUnit(decimals);
    let stakeUnit = getUnit(stakeDecimals);

    let value = vaultWeb3.utils.fromWei(data.reward_amount.toString(), unit);

    let vaultInfo = await vaultContract.methods.getVaultInfo(data.vid).call()
    let userData = await vaultContract.methods.getUserInfo(data.vid, accounts[0]).call()
    let claimedTotal = vaultWeb3.utils.fromWei(userData[3].toString(), unit);

    let earned = 0;

    let userAmount = vaultWeb3.utils.fromWei(userData[0].toString(), unit);
    let totalStaked = vaultWeb3.utils.fromWei(vaultInfo[7].toString(), stakeUnit);

    let userRewards = 0;

    try {
        earned = await vaultContract.methods.calcRewardsUser(data.vid, accounts[0]).call()
        userRewards = parseFloat(vaultWeb3.utils.fromWei(earned, unit)).toFixed(2);
    } catch (e) {
        earned = 0;
        userRewards = 0;
    }

    element.addClass('removable-pinned')

    element.find('#pinned-modal-')
        .attr('id', 'pinned-modal-' + data.vid)
        .attr('data-bs-target', '#VaultPinnedModal' + data.vid)

    element.find('#pinned-vote-count-')
        .attr('id', 'pinned-vote-count-' + data.vid)

    let endDate = moment.unix(data.end).format("MM/DD/YYYY");

    let nameToken = data.name.split('Earn');
    let nameFinal = "<span class='name-token me-1 small'>"+nameToken[0]+"</span><span class='name-token me-1 small'>Earn"+nameToken[1]+"</span>"

    element.find('.pinned-token-name').html(nameFinal);

    let aprVal = "to be calculated"
    if (!isNaN(data.apr) && data.apr !== null) {
        aprVal = parseFloat(data.apr).toFixed(2) + '%'
    }

    element.find('.pinned-apr')
        .attr('id', 'pinned-apr-' + data.vid)
        .html(aprVal)

    element.find('.pinned-votes').html(data.votes);
    element.find('.pinned-end-date').html(endDate);
    element.show();
    element.insertAfter(".pinned-item:last");

    var modal = $('#VaultPinnedModal:first').clone(true);

    const stakeContract = data.stake_contract;
    const rewardContract = data.reward_contract;

    modal.find('.do-stake')
        .attr('onclick', 'stake("' + stakeContract + '", "' + data.vid + '")')

    modal.find('.do-unstake')
        .attr('onclick', 'unstake("' + stakeContract + '", "' + data.vid + '")')
        .attr('id', 'do-unstake-' + data.vid)

    modal.find('.button-max-unstake')
        .attr('onclick', 'getMaxUnstake("' + stakeContract + '", "' + data.vid + '")')

    modal.find('.do-claim')
        .attr('onclick', 'claim("' + rewardContract + '", "' + data.vid + '")')
        .attr('id', 'do-claim-' + data.vid)

    var currentDate = moment().unix();

    if (currentDate > data.end) {
        modal.find('.approved-stake')
            .prop('disabled', true)
            .html('VAULT CLOSED')

        modal.find('#enable-button-' + data.vid)
            .removeClass('btn-primary')
            .addClass('btn-error')
    } else {
        modal.find('.approved-stake')
            .attr('onclick', 'approveStake("' + stakeContract + '", "' + data.vid + '")')
    }

    modal.find('.button-max')
        .attr('onclick', 'getMax("' + stakeContract + '", "' + data.vid + '")')

    modal.find('#stake-pinned-tab-button')
        .attr('data-bs-target', '#stake-pinned-form-' + data.vid)

    modal.find('#pinned-modal-stake-')
        .attr('id', 'pinned-modal-stake-' + data.vid)

    modal.find('#stake-pinned-form-')
        .attr('id', 'stake-pinned-form-' + data.vid)

    modal.find('#button-stake-max-')
        .attr('id', 'button-stake-max-' + data.vid)

    //
    modal.find('#enable-button-')
        .attr('id', 'enable-button-' + data.vid)

    modal.find('#stake-button-')
        .attr('id', 'stake-button-' + data.vid)

    modal.find('#unstake-pinned-tab-button')
        .attr('data-bs-target', '#unstake-pinned-form-' + data.vid)

    modal.find('#unstake-pinned-form-')
        .attr('id', 'unstake-pinned-form-' + data.vid)

    modal.find('.stake-input')
        .attr('id', 'stake-input-' + data.vid)

    modal.find('.unstake-input')
        .attr('id', 'unstake-input-' + data.vid)

    modal.find('.earned-input')
        .attr('id', 'earned-input-' + data.vid)

    modal.find('#pinned-vote-')
        .attr('id', 'vault-vote-' + data.vid)
        .attr('onclick', 'vote(' + data.vid + ')')

    modal.find('.error-list')
        .attr('id', 'error-' + data.vid)

    modal.find('.pinned-modal-earned')
        .attr('id', 'pinned-modal-earned-' + data.vid)

    modal.find('.pinned-claimed')
        .attr('id', 'pinned-claimed-' + data.vid)

    modal.find('.pinned-modal-stake')
        .attr('id', 'pinned-modal-stake-' + data.vid)

    modal.find('.pinned-modal-tvl')
        .attr('id', 'pinned-modal-tvl-' + data.vid)


    modal.attr('id', 'VaultPinnedModal' + data.vid)
    modal.addClass('removable-pinned')


    modal.find('.pinned-modal-name').html(nameFinal);
    modal.find('.total-staked-row')
        .attr('id', 'pinned-modal-total-stake-' + data.vid).html(parseFloat(totalStaked).toFixed(2))


    modal.find('.total-staked-row')
        .attr('id', 'pinned-modal-total-stake-' + data.vid).html(parseFloat(totalStaked).toFixed(2))

    modal.find('#pinned-modal-stake-' + data.vid).html(parseFloat(userAmount).toFixed(2));
    modal.find('#pinned-modal-earned-' + data.vid).html(userRewards);
    modal.find('#pinned-claimed-' + data.vid).html(parseFloat(claimedTotal).toFixed(2));
    modal.find('#pinned-modal-tvl-' + data.vid).html(data.usd_rewards_value === null ? "No Total Yet" : formatMoney(Math.floor(data.usd_rewards_value)));
    //modal.find('.pinned-modal-earned').html(data.name);
    //modal.find('.pinned-modal-stake').html(data.name);
    modal.find('.pinned-modal-end-date').html(endDate);


    element.find('.pinned-rewards').html(value.toString());
    //modal.find('.pinned-modal-apr').html(d);
    modal.find('.pinned-modal-votes').html(data.votes);

    let tokenImgMain = './public/icons/noimagetoken.jpeg'
    let tokenImgSecondary = './public/icons/noimagetoken.jpeg'

    //remove - testnet replacement
    switch (data.reward_contract) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            data.reward_contract = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            data.reward_contract = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            data.reward_contract = '0x55d398326f99059ff775485246999027b3197955';
            break;
        case '0x8f5e9d875254f5cc8f6d25fd88b5413e6e11811d': //fakelp
            data.reward_contract = '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0';
            break;
    }

    switch (data.stake_contract) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            data.stake_contract = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            data.stake_contract = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            data.stake_contract = '0x55d398326f99059ff775485246999027b3197955';
            break;
        case '0x8f5e9d875254f5cc8f6d25fd88b5413e6e11811d': //fakelp
            data.stake_contract = '0xc736ca3d9b1e90af4230bd8f9626528b3d4e0ee0';
            break;

    }

    if (data.is_lp === "false") {
        if (data.token_icon_id !== 0) {
            tokenImgMain = './public/' + data.stake_image_main;
            tokenImgSecondary = './public/' + data.stake_image_main
            if (data.stake_contract !== data.reward_contract) {
                tokenImgSecondary = './public/' + data.reward_image_main
            }
        }
    } else {
        let tokenImgMainLp
        let tokenImgSecondaryLp
        if (data.token_icon_id !== 0) {
            element.find('.lp-icons').removeClass('hide');
            modal.find('.lp-icons').removeClass('hide');
            if (data.stake_contract === data.reward_contract) {
                tokenImgMain = './public/' + data.stake_image_main;
                tokenImgSecondary = './public/' + data.stake_image_lp_image
                tokenImgMainLp = './public/' + data.stake_image_main;
                tokenImgSecondaryLp = './public/' + data.stake_image_lp_image
            } else {
                //both lps
                let lpSkateImage = data.stake_image_lp_image.trim() || "";
                let rewardImage = data.reward_image_lp_image.trim() || "";

                if (lpSkateImage.length !== 0 && rewardImage.length !== 0) {
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = './public/' + data.stake_image_lp_image
                    tokenImgMainLp = './public/' + data.reward_image_main;
                    tokenImgSecondaryLp = './public/' + data.reward_image_lp_image
                } else if (lpSkateImage.trim().length !== 0) {
                    element.find('.sample2-lp').hide();
                    modal.find('.sample2-lp').hide();
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = './public/' + data.stake_image_lp_image
                    tokenImgMainLp = './public/' + data.reward_image_main
                    tokenImgSecondaryLp = '';
                } else {
                    element.find('.sample2').hide();
                    modal.find('.sample2').hide();
                    tokenImgMain = './public/' + data.stake_image_main;
                    tokenImgSecondary = ''
                    tokenImgMainLp = './public/' + data.reward_image_main
                    tokenImgSecondaryLp = './public/' + data.reward_image_lp_image
                }
            }
        }
        element.find('.row-icon-lp').attr('src', tokenImgMainLp);
        element.find('.row-icon-secondary-lp').attr('src', tokenImgSecondaryLp);
        modal.find('.row-icon-lp').attr('src', tokenImgMainLp);
        modal.find('.row-icon-secondary-lp').attr('src', tokenImgSecondaryLp);
    }

    element.find('.row-icon').attr('src', tokenImgMain);
    element.find('.row-icon-secondary').attr('src', tokenImgSecondary);
    modal.find('.row-icon').attr('src', tokenImgMain);
    modal.find('.row-icon-secondary').attr('src', tokenImgSecondary);

    modal.insertAfter(".modal:last");
}


async function estimatePrize() {
    const isDifferentToken = $('#requires_different_reward_token').is(':checked')
    let contract = getCurrentReward(isDifferentToken)
    let isLp = $('#isLp').is(':checked')

    //remove - testnet replacement

    let oldToken = contract;
    switch (contract) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            contract = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            contract = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            contract = '0x55d398326f99059ff775485246999027b3197955';
            break;
    }
    //remove - testnet replacement

    if (contract.length === 0) {
        return false;
    }

    if (tokenPrices[contract] === undefined) {

        let isLpToken;
        const lpToken = loadContract(contract);
        try {
            const token0 = await lpToken.methods.token0().call();
            const token1 = await lpToken.methods.token1().call();
            isLp = true;
            showToastMessage('LP token detected', 'info');
        } catch (e) {
            isLp = false;
        }

        if (isLp) {
            let decimals = await lpToken.methods.decimals().call();
            let lpSupply = await lpToken.methods.totalSupply().call();
            let supplyF = vaultWeb3.utils.fromWei(lpSupply, getUnit(decimals));
            let reserve = await lpToken.methods.getReserves().call();
            let token0 = await lpToken.methods.token0().call();
            let token1 = await lpToken.methods.token1().call();
            const contractToken0 = loadContract(token0)
            const contractToken1 = loadContract(token1)
            let decimalsToken0 = await contractToken0.methods.decimals().call();
            let decimalsToken1 = await contractToken1.methods.decimals().call();
            let reserve0 = reserve._reserve0;
            let reserveF0 = vaultWeb3.utils.fromWei(reserve0, getUnit(decimalsToken0));
            let reserve1 = reserve._reserve1;
            let reserveF1 = vaultWeb3.utils.fromWei(reserve1, getUnit(decimalsToken1));


            //remove - testnet replacement
            switch (token0) {
                case '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd': //wbnb
                    token0 = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
                    break;
                case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
                    token0 = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
                    break;
                case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
                    token0 = '0xc748673057861a797275cd8a068abb95a902e8de';
                    break;
                case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
                    token0 = '0x55d398326f99059ff775485246999027b3197955';
                    break;
            }

            switch (token1) {
                case '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd': //wbnb
                    token1 = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
                    break;
                case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
                    token1 = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
                    break;
                case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
                    token1 = '0xc748673057861a797275cd8a068abb95a902e8de';
                    break;
                case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
                    token1 = '0x55d398326f99059ff775485246999027b3197955';
                    break;
            }
            //remove - testnet replacement

            await fetch("https://api.pancakeswap.info/api/v2/tokens/" + token0)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        tokenPrices[contract] = 0;
                    }
                })
                .then(async (responseJson) => {
                    if (responseJson) {
                        let priceToken0 = responseJson['data'].price;
                        let url = "https://api.pancakeswap.info/api/v2/tokens/" + token1

                        await fetch(url)
                            .then((response) => {
                                if (response.ok) {
                                    return response.json();
                                }
                            })
                            .then((responseJson) => {
                                if (responseJson) {
                                    let priceToken1 = responseJson['data'].price;
                                    let valueToken0 = reserveF0 * priceToken0;
                                    let valueToken1 = reserveF1 * priceToken1;
                                    let totalSum = valueToken0 + valueToken1;
                                    tokenPrices[contract] = totalSum / supplyF;
                                    //remove - testnet replacement
                                    tokenPrices[oldToken] = tokenPrices[contract];
                                    //
                                    setEstimatePrize(contract);
                                }
                            });
                    } else {
                        //error1
                    }
                });
        } else {
            await fetch("https://api.pancakeswap.info/api/v2/tokens/" + contract)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((responseJson) => {
                    if (responseJson) {
                        tokenPrices[contract] = responseJson.data.price;
                        setEstimatePrize(contract);
                    }
                });
        }

    } else {
        setEstimatePrize(contract);
    }
}

async function getTVL() {
    await fetch(vaultApi + 'api/tvl')
        .then((response) => response.json())
        .then((responseJson) => {
            $('#tvl_meter').html(formatMoney(Math.floor(responseJson.data)));
        });
}


async function runUpdater() {
    await fetch(vaultApi + 'api/updater')
        .then((response) => response.json())
        .then((responseJson) => {
            responseJson.data.forEach(response => {
                let element = $('#pinned-apr-'+response.vid);
                if (element.length) {
                    let tvl = response.usd_rewards_value === null ?
                        "No Total Yet" : formatMoney(Math.floor(response.usd_rewards_value));

                    let apr = parseFloat(response.apr).toFixed(2).toString()+"%";
                    $('#pinned-modal-tvl-' + response.vid).html(tvl);
                    element.html(apr);
                }

            })
        });
}


function formatMoney(number) {
    if (number !== null) {
        return number.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    return "$0.00"
}

function setEstimatePrize(contract) {
    let times = $('#reward_amount').val();

    if (parseFloat(times) > 0) {
        let total = (parseFloat(times) * tokenPrices[contract]);
        $('#reward_est_value').html(formatMoney(total));
    } else {
        $('#reward_est_value').html(formatMoney(0));
    }
}

function generateNewId() {
    return Math.floor(Math.random() * (99999999 - 100000 + 1)) + 100000;
}

async function approveTokens(contract, amount) {
    contract = contract.toLowerCase();

    const approveButton = $('#approve_vault');
    approveButton.html('APPROVING...')
    approveButton.prop("disabled", true);

    if (!vaultWeb3.utils.isAddress(contract)) {
        showToastMessage("Invalid contract", 'error');
        approveButton.html('APPROVE');
        approveButton.prop("disabled", false);
        return false;
    }

    const byteCode = await vaultWeb3.eth.getCode(contract);
    if (byteCode === '0x') {
        showToastMessage("Invalid contract", 'error');
        approveButton.html('APPROVE');
        approveButton.prop("disabled", false);
        return false;
    }
    const tokenContract = loadContract(contract);
    const decimals = await tokenContract.methods.decimals().call();
    let balance = await tokenContract.methods.balanceOf(accounts[0]).call();

    if (balance === '0') {
        showToastMessage("Insufficient balance", 'error');
        approveButton.html('APPROVE');
        approveButton.prop("disabled", false);
        return false;
    }

    const value = vaultWeb3.utils.toWei(amount, getUnit(decimals));
    disableForm();


    showToastMessage('Approving tokens please wait', 'info', false, 15000);

    await tokenContract.methods.approve(vaultAddress, value).send({
        from: accounts[0]
    }).then(
        () => {
            showToastMessage('Tokens Approved', 'info');
            approveButton.hide();
            $("#create_vault").show();
        },
        () => {
            showToastMessage('Canceled', 'Error');
            resetForm();
        })
        .catch(function (e) {
            console.log('error')
        })
}

function disableForm() {
    $("#addVaultForm :input").prop("disabled", true);
}

function enableForm() {
    $("#addVaultForm :input").prop("disabled", false);
}

function resetForm() {
    enableForm();

    $("#approve_vault").prop("disabled", false);
    $("#create_vault").prop("disabled", false);
    $("#create_vault").html('CREATE VAULT');
    $("#approve_vault").html('APPROVE TOKENS');
    $("#approve_vault").show();
    $("#create_vault").hide();
    $("#reward_token").hide();
    $('#addVaultForm').trigger("reset");
}

async function approveVault() {
    let willUseDifferentToken = $('#requires_different_reward_token').is(":checked");
    let isLptoken = $('#isLp').is(":checked");
    let data = {
        stake_contract: $('#stake_contract').val(),
        reward_contract: willUseDifferentToken ? $('#reward_contract').val() : $('#stake_contract').val(),
        reward_amount: $('#reward_amount').val(),
        days: $('#vault_end_days').val(),
    }

    if (validate(data)) {
        await approveTokens(data.reward_contract, data.reward_amount)
    }
}

function showToastMessage(message, type = "info", focusInput = false, timeout = 10000) {
    $('#info-toast').removeClass('show');
    $('#error-toast').removeClass('show');
    $('#success-toast').removeClass('show');

    let toastDiv = $('#' + type + '-toast');
    let toastMessage = $('#' + type + '-toast-message');

    if (focusInput !== false) {
        focusInput.focus();
    }

    toastMessage.html(message);
    toastDiv.addClass('show');
    setTimeout(function () {
        toastDiv.removeClass('show');
    }, timeout)

}

async function getMax(token, vid) {
    let contract = loadContract(token);
    let balance = await contract.methods.balanceOf(accounts[0]).call();
    let decimals = await contract.methods.decimals().call();
    const total = vaultWeb3.utils.fromWei(balance.toString(), getUnit(decimals));
    $('#stake-input-' + vid).val(total);
}

async function getTokenMax(token) {
    let contract = 0;

    try {
        contract = loadContract(token);
    } catch (e) {
        showToastMessage('Contract is not valid', 'error');
        return false;
    }

    let balance = await contract.methods.balanceOf(accounts[0]).call();

    if (balance == 0) {
        showToastMessage('Insufficient balance', 'error');
        return false;
    }

    let decimals = await contract.methods.decimals().call();
    const total = vaultWeb3.utils.fromWei(balance.toString(), getUnit(decimals));

    $('#reward_amount').val(total);
    estimateAPR()
}

async function validateStake(stake_token, vid) {
    let tokenContract = loadContract(stake_token);
    let balance = await tokenContract.methods.balanceOf(accounts[0]).call();
    let decimals = await tokenContract.methods.decimals().call();
    let stakeVolume = $('#stake-input-' + vid).val();
    const stakeTotal = await vaultWeb3.utils.toWei(stakeVolume, getUnit(decimals));

    if (parseFloat(stakeTotal) > parseFloat(balance)) {
        stakeError(vid, "You don't have enough funds")
        return false;
    }

    return true;
}

async function stakeError(vid, message, fieldToFocus = false) {
    let errorElement = $('#error-' + vid);
    errorElement.find('#error_list').html(message);
    errorElement.removeClass('d-none');

    if (fieldToFocus) {
        fieldToFocus.focus();
    }

    setTimeout(function () {
        errorElement.addClass('d-none');
    }, 15000)
}

async function releaseStakeButton(button) {
    button.prop("disabled", false);
    button.html("ENABLE");
}

async function approveStake(stake_token, vid) {
    const enableButton = $('#enable-button-' + vid)
    enableButton.prop("disabled", true);
    enableButton.html("ENABLING...")

    let tokenContract = loadContract(stake_token);
    let input = $('#stake-input-' + vid);
    let stakeAmount = input.val();

    let userBalance = await tokenContract.methods.balanceOf(accounts[0]).call();

    if (parseFloat(userBalance) === 0) {
        showToastMessage("Insuficient balance", 'error')
        releaseStakeButton(enableButton);
        return false;
    }

    if (stakeAmount.length === 0) {
        showToastMessage("Please fill in the value to stake", 'error')
        releaseStakeButton(enableButton);
        return false;
    }

    if (parseFloat(stakeAmount) <= 0) {
        stakeError(vid, "Can't stake zero tokens", input)
        releaseStakeButton(enableButton);
        return false;
    }


    if (await validateStake(stake_token, vid)) {

        showToastMessage('Approving tokens please wait', 'info')

        const stakeButton = $('#stake-button-' + vid)
        const decimals = await tokenContract.methods.decimals();
        let formattedBalance = await vaultWeb3.utils.fromWei(userBalance, getUnit(decimals));

        if (parseFloat(stakeAmount) > parseFloat(formattedBalance)) {
            showToastMessage('Insufficient balance', 'error')
            releaseStakeButton(enableButton);
            return;
        }

        let maxButton = $('#button-stake-max-' + vid);

        stakeAmount = await vaultWeb3.utils.toWei(stakeAmount, getUnit(decimals));

        input.prop("disabled", true);
        maxButton.prop("disabled", true);
        await tokenContract.methods.approve(vaultAddress, stakeAmount).send({
            from: accounts[0]
        }).then(
            () => {
                enableButton.hide();
                stakeButton.show();
                showToastMessage('Tokens approved', 'info')
            },
            () => {
                releaseStakeButton(enableButton);
                stakeButton.hide();
                stakeButton.html('STAKE');
                input.prop("disabled", false);
                maxButton.prop("disabled", false);

            }
        )
    } else {
        showToastMessage('Insufficient balance', 'error')
        releaseStakeButton(enableButton);
        return;
    }

}

async function claim(earn_token, vid) {

    const buttonElement = $('#do-claim-' + vid);
    const unstakeButton = $('.do-unstake');
    const maxButton = $('.button-max-unstake');

    buttonElement.prop('disabled', true);
    unstakeButton.prop('disabled', true);
    maxButton.prop('disabled', true);
    buttonElement.html('CLAIMING....');

    const vaultContract = loadVaultContract()
    showToastMessage("Requesting rewards...", 'info')


    try {
        let toClaim = await vaultContract.methods.calcRewardsUser(vid, accounts[0]).call()
        const tokenContract = loadContract(earn_token);
        const decimals = await tokenContract.methods.decimals();
        let oldClaimed = await vaultWeb3.utils.fromWei(toClaim, getUnit(decimals));

        if (oldClaimed === '0') {
            showToastMessage('No rewards to claim', 'error')
            unstakeButton.prop('disabled', false);
            maxButton.prop('disabled', false);
            buttonElement.prop('disabled', false);
            buttonElement.html('CLAIM');
            return false;
        }

        const earnedElement = $('#pinned-modal-earned-' + vid);
        const claimedElement = $('#pinned-claimed-' + vid);
        const claimed = claimedElement.html();
        try {
            await vaultContract.methods.claimRewards(vid).send({
                from: accounts[0]
            }).then(
                async () => {
                    showToastMessage("Tokens claimed", 'success')
                    earnedElement.html(0);
                    claimedElement.html(parseFloat(oldClaimed) + parseFloat(claimed));
                },
                async () => {
                    showToastMessage('Error requesting rewards', 'error')
                }
            )
        } catch (e) {
            showToastMessage("Can't claim balance", 'error')
        }
    } catch (e) {
        console.log(e.toString())
        showToastMessage('No rewards to claim', 'error')
        unstakeButton.prop('disabled', false);
        maxButton.prop('disabled', false);
        buttonElement.prop('disabled', false);
        buttonElement.html('CLAIM');
        return;
    }
    unstakeButton.prop('disabled', false);
    maxButton.prop('disabled', false);
    buttonElement.prop('disabled', false);
    buttonElement.html('CLAIM');
}

async function unstake(stake_token, vid, isPinned = true) {
    const buttonClaim = $('#do-claim-' + vid);
    const buttonUnstake = $('#do-unstake-' + vid);
    const inputUnstake = $('#unstake-input-' + vid);
    const buttonMaxUnstake = $('.button-max-unstake');
    buttonMaxUnstake.prop('disabled', true);
    buttonClaim.prop('disabled', true);
    buttonUnstake.html('Unstaking...');
    buttonUnstake.prop('disabled', true);
    showToastMessage("Unstaking tokens...", 'info')


    let unstakeAmount = inputUnstake.val();
    if (unstakeAmount === undefined || parseFloat(unstakeAmount) === 0 || unstakeAmount == 0) {
        showToastMessage('Please enter the amount of tokens to unstake', 'error', buttonUnstake)
        buttonUnstake.html('Unstake');
        buttonClaim.prop('disabled', false);
        buttonMaxUnstake.prop('disabled', false);
        buttonUnstake.prop('disabled', false);
        return;
    }

    const vaultContract = loadVaultContract()

    let userData = await vaultContract.methods.getUserInfo(vid, accounts[0]).call()

    if (userData[0] === 0) {
        showToastMessage('No tokens to unstake', 'error')
        buttonUnstake.html('Unstake');
        buttonClaim.prop('disabled', false);
        buttonUnstake.prop('disabled', false);
        buttonMaxUnstake.prop('disabled', false);
        return;
    }

    const tokenContract = loadContract(stake_token)
    const decimals = await tokenContract.methods.decimals().call();


    let value = await vaultWeb3.utils.toWei(unstakeAmount, getUnit(decimals));

    if (parseFloat(value) > parseFloat(userData[0])) {
        showToastMessage("Insufficient balance.", 'error')
        buttonUnstake.html('Unstake');
        buttonClaim.prop('disabled', false);
        buttonUnstake.prop('disabled', false);
        buttonMaxUnstake.prop('disabled', false);
        return;
    }

    try {

        await vaultContract.methods.withdraw(vid, value).send({
            from: accounts[0]
        }).then(
            async () => {
                showToastMessage("Tokens unstaked.", 'success')
            },
            async () => {
                showToastMessage("Can't unstake tokens.", 'error')
            }
        )
        if (isPinned) {
            $('#pinned-modal-earned-' + vid).html('0');
            $('#pinned-modal-stake-' + vid).html('0');
        } else {
            //row
        }
    } catch (e) {
        showToastMessage("Can't claim balance", 'error')
    }

    buttonUnstake.html('Unstake');
    buttonClaim.prop('disabled', false);
    buttonUnstake.prop('disabled', false);
    buttonMaxUnstake.prop('disabled', false);

}

async function getMaxUnstake(stake_token, vid) {
    const vaultContract = loadVaultContract()
    const tokenContract = loadContract(stake_token);
    const input = $('#unstake-input-' + vid);

    let userData = await vaultContract.methods.getUserInfo(vid, accounts[0]).call()
    const decimals = await tokenContract.methods.decimals().call();
    const value = await vaultWeb3.utils.fromWei(userData[0], getUnit(decimals));

    input.val(value);
}

async function filterModal() {

}


async function stake(stake_token, vid, isPinned = false) {
    const stakeButton = $('#stake-button-' + vid)
    stakeButton.prop("disabled", true);
    stakeButton.html("STAKING...");

    let vaultContract = loadVaultContract()
    let tokenContract = loadContract(stake_token);
    let input = $('#stake-input-' + vid);
    let balance = input.val();
    let lockDays = 0;

    if (balance.length === 0) {
        showToastMessage('Please fill in the value to stake', 'error')
        releaseStakeButton(stakeButton);
        return false;
    }

    if (parseFloat(balance) <= 0) {
        showToastMessage("Can't stake zero tokens", 'error')
        releaseStakeButton(stakeButton);

        return false;
    }


    if (await validateStake(stake_token, vid)) {

        showToastMessage('Sending transaction, plese wait', 'info')

        const enableButton = $('#enable-button-' + vid)
        const decimals = await tokenContract.methods.decimals().call();
        const value = await vaultWeb3.utils.toWei(balance, getUnit(decimals));

        let maxButton = $('#button-stake-max-' + vid);

        await vaultContract.methods.deposit(vid, lockDays, value).send({
            from: accounts[0]
        }).then(
            () => {
                //update stake number
                showToastMessage('Processed, stake done', 'success')
                let divStaked = $('#pinned-modal-stake-' + vid);
                let divTotalStaked = $('#pinned-modal-total-stake-' + vid);
                let oldValue = divStaked.html()
                let oldTotalValue = divTotalStaked.html()
                let newValue = parseFloat(oldValue) + parseFloat(balance)
                let newTotal = parseFloat(oldTotalValue) + parseFloat(balance)
                divStaked.html(parseFloat(newValue).toFixed(2))
                divTotalStaked.html(parseFloat(newTotal).toFixed(2))
                stakeTransaction(vid);
            },
            () => {
                showToastMessage('Error staking tokens', 'error')
            }
        )
        $('.close-modal').click()
        setupDepositScreen(stakeButton, enableButton, input, maxButton)

    }
}

function setupDepositScreen(stakeButton, enableButton, input, maxButton) {
    stakeButton.html('STAKE');
    enableButton.html("ENABLE")
    stakeButton.prop("disabled", false);
    enableButton.prop("disabled", false);
    input.val("");
    input.prop("disabled", false);
    stakeButton.hide();
    enableButton.show();
    maxButton.prop("disabled", false);
}

async function stakeTransaction(vid) {
    fetch(vaultApi + "api/vault/stake/" + vid, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: accounts[0]
        })
    });
}

async function vote(vid) {
    await fetch(vaultApi + "api/vault/vote/" + vid, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: accounts[0]
        })
    }).then(async (response) => {
        let status = await response.json();
        showToastMessage(status.data, status.message)

        if (status.message === 'success') {
            let div = $('#pinned-vote-count-' + vid);
            let oldCount = div.html();
            let newCount = parseFloat(oldCount) + 1;
            div.html(newCount);
        }
    });
}

async function createVault() {
    let willUseDifferentToken = $('#requires_different_reward_token').is(":checked");

    let data = {
        stake_contract: $('#stake_contract').val(),
        reward_contract: willUseDifferentToken ? $('#reward_contract').val() : $('#stake_contract').val(),
        reward_amount: $('#reward_amount').val(),
        days: $('#vault_end_days').val(),
        min_lock_days: $('#vault_minimal_lock_days').val()
    }


    if (validate(data)) {
        $('#create_vault').html('CREATING...')
        $("#create_vault").prop("disabled", true);

        const token = loadContract(data.reward_contract)
        const vaultContract = loadVaultContract();
        const decimals = await token.methods.decimals().call();
        const value = vaultWeb3.utils.toWei(data.reward_amount, getUnit(decimals));

        const key = generateNewId();
        data.reward_amount = value;

        try {
            await token.methods.token0().call();
            data.is_lp = "true";
            showToastMessage('LP token Rewards', 'info');
        } catch (e) {
            data.is_lp = "false";
        }

        if (data.is_lp == "false") {
            try {
                const tokenStake = loadContract(data.stake_contract)
                await tokenStake.methods.token0().call();
                data.is_lp = "true";
                showToastMessage('LP Stake detected', 'info');
            } catch (e) {
                data.is_lp = "false";
            }
        }

        showToastMessage('Adding new vault', 'info', false, 10000000);

        await vaultContract.methods.createVault(
            key,
            data.stake_contract,
            data.reward_contract,
            data.is_lp,
            data.days,
            data.min_lock_days === "" ? 0 : data.min_lock_days,
            value
        ).send({
            from: accounts[0]
        }).then(
            async () => {
                data.vid = await vaultContract.methods.getVaultId(key).call();
                await execApiShardCall('api/vault', data, 'POST');
                showToastMessage('Vault created', 'success');
                resetSearchBar();
                listVaults();
                $('#cancel_vault').click();
                if (data.is_lp === 'true') {
                    $('.lp-tab').click()
                }
            },
            () => {
                resetForm();
            })


    } else {
        showToastMessage('Invalid Vault Info', 'error');
    }
}

function validate(data) {
    let errors = ['Please fill the following fields']

    if (data.stake_contract.length === 0) {
        errors.push(['Stake contract'])
    }

    if (!vaultWeb3.utils.isAddress(data.stake_contract.toLowerCase())) {
        errors.push(['Invalid stake contract'])
    }

    if (data.min_lock_days !== undefined) {
        if (data.min_lock_days.length > 0 && data.min_lock_days < 0) {
            errors.push(['Please inform a valid minimal lock time'])
        }
    } else {
        data.min_lock_days = 0;
    }

    if (data.reward_amount.length === 0 || data.reward_amount < 0) {
        errors.push(['Please inform this vault reward amount'])
    }

    if (data.days === undefined || data.days.trim() === "") {
        errors.push(["Days can't be empty"])
    } else if (parseInt(data.days) <= 2 || data.days > 365) {
        errors.push(['Vault days min 3 & max 365'])
    }

    if (errors.length > 1) {
        $('#alert').removeClass('hide');
        $('#error_list').html(errors.join('<br>'))
        return false;
    }

    $('#alert').addClass('hide');
    $('#error_list').html('')
    return true;
}

function estimateAPR() {
    const isDifferentToken = $('#requires_different_reward_token').is(':checked')
    let token = getCurrentReward(isDifferentToken)

    //remove - testnet replacement
    switch (token) {
        case '0x04C7393e4CC11FE9177aCa68594Aef72a40166d9': //bnb
            token = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
            break;
        case '0x9224c6e69c2237c9620eb1F4b7cBB8E53D21ea46': //babydoge
            token = '0xc748673057861a797275cd8a068abb95a902e8de';
            break;
        case '0xfF6AB02b94a830a9f8d2272001c2adA7C8035068': //usdt
            token = '0x55d398326f99059ff775485246999027b3197955';
            break;
    }
    //remove - testnet replacement

    const rewardAmount = $('#reward_amount').val();
    const numberOfDays = $('#vault_end_days').val();

    if (rewardAmount.trim().length == 0 || numberOfDays.trim().length == 0) {
        return false;
    }

    if (parseInt(numberOfDays) === 0) {
        $('#est_apr').html('0%')
        return false;
    }

    if (parseInt(numberOfDays) <= 0 || numberOfDays.trim().length == 0) {
        $('#est_apr').html('0%')
        return false;
    }

    const totalRewards = rewardAmount * tokenPrices[token];
    const dailyRate = totalRewards / numberOfDays;
    const annualizedYield = dailyRate * 365;
    const initialPoolAlloc = 1;

    const apr = annualizedYield / initialPoolAlloc * 100;

    let value = parseFloat(apr).toFixed(2);

    if (isNaN(value)) {
        value = "Couldn't calculate"
    } else {
        value += '%'
    }

    $('#est_apr').html(value)
}

function resetSearchBar() {
    $('#closed').prop("checked", false)
    $('#stakedOnly').prop("checked", false)
    $('#search_vaults').val('')
    $('#sort').val('new_to_old')
}


function resetMobileSearchBar() {
    /*
    $('#closed').prop("checked", false)
    $('#stakedOnly').prop("checked", false)
    $('#search_vaults').val('')
    $('#sort').val('new_to_old')
    */
}

function getCurrentReward(isDifferentToken = false) {
    const stakeContract = $('#stake_contract');
    const rewardContract = $('#reward_contract');

    if (isDifferentToken) {
        return rewardContract.val();
    }

    return stakeContract.val();
}

$(document).ready(function () {

    if (!isConnected) {
        $('#connectWalletModal').addClass('show');
    }

    $('#max-create-button').on('click', function () {
        const isDifferentToken = $('#requires_different_reward_token').is(':checked')
        let reward = getCurrentReward(isDifferentToken);
        if (!reward.trim().length > 0) {
            if (isDifferentToken) {
                $('#reward_contract').focus();
            } else {
                $('#stake_contract').focus();
            }
            $('#reward_amount').val('');
            showToastMessage('Please fill in your token contract token', 'error')
        } else {
            getTokenMax(reward);
        }
    });

    $('#button-max-days').on('click', function () {
        $('#vault_end_days').val('365')
        if ($('#reward_amount').val().trim().length > 0) {
            estimateAPR();
        }
    });

    $('#filter').on('click', function () {
        const search = $('#search_vaults_mobile').val();
        listVaults(search, true)
    });


    $('#reward_contract').on('keyup', function () {
        $('#reward_amount').val('');
    });

    $('#stake_contract').on('keyup', function () {
        if (!$('#requires_different_reward_token').is(':checked')) {
            $('#reward_amount').val('');
        }
    });

    $('#search_vaults').on('keyup', function () {
        if ($(this).val().trim().length === 0) {
            listVaults();
        }
    });

    $('.lp-tab').on('click', function () {
        let hasClass = $('.lp-tab').hasClass('.active')
        if (!hasClass) {
            isLp = true;
            listVaults();
            $('#search_vaults').val('');
        }
    });

    $('#unstake-pinned-tab-button').on('click', function () {
        $('.error-list').addClass('d-none');
    });

    $('.token-tab').on('click', function () {
        let hasClass = $('.token-tab').hasClass('.active')
        if (!hasClass) {
            isLp = false;
            listVaults();
            $('#search_vaults').val('');
        }
    });


    $('.connectWallet').one('click', function () {
        location.reload();
    });

    $('#approve_vault').click(function () {
        approveVault()
    });

    $('#create_vault').click(function () {
        createVault()
    });

    $('#cancel_vault').click(function () {
        $('#alert').addClass('hide');
        resetForm();
        $('#isLp').attr('value', false);
        $('#requires_different_reward_token').attr('value', false);
        $('#requires_locked_time').attr('value', false);
        $('#lock_days').hide();
        $('#reward_est_value').html('$0.00');
    });


    $("#vault_end_days").keyup(function () {

        var vals = $(this).val();

        if (vals < 0) {
            $(this).val('')
            $(this).focus()
            return false;
        }

        if (vals > 365) {
            vals = 365
        }

        if (/[0-9]/.test(vals)) {
            $(this).val(vals);
        } else {
            vals = vals.replace(/.$/, "");
        }

        $('#vault_minimal_lock_days').val('');
        $(this).val(vals);
    });

    $("#vault_minimal_lock_days").keyup(function () {
        var vals = $(this).val();
        let fullLockElement = $('#vault_end_days');
        let fullLockElementSize = fullLockElement.val().trim().length;

        if (vals < 0) {
            $(this).val('')
            $(this).focus()
            return false;
        }


        if (fullLockElementSize == 0) {
            showToastMessage('Please inform the correct number of days for this vault.', 'error')
            return false;
        }


        if (parseInt(vals) > parseInt(fullLockElement.val())) {
            $(this).val('')
            showToastMessage('Minimal locked time is supposed to be bigger then full lock', 'error')
            return false;
        }

        if (/[0-9]/.test(vals)) {
            $("#testId").val(vals);
        } else {
            vals = vals.replace(/.$/, "");
        }

        $(this).val(vals);
    });


    $("#reward_amount").keyup(function () {

        var vals = $(this).val();

        if (vals < 0) {
            $(this).val('')
            $(this).focus()
            return false;
        }

        if (/([0-9]+[.,]*)+/.test(vals)) {
            $("#testId").val(vals);
        } else {
            vals = vals.replace(/.$/, "");
        }

        $(this).val(vals);
        estimateAPR();
    });


    $('#stakedOnly').on('change', function () {
        var value = $('#search_vaults').val();
        if (value.length <= 3) {
            value = '';
            $('#search_vaults').val(value);
        }

        listVaults(value);
    });

    $('#closed').on('change', function () {
        var value = $('#search_vaults').val();
        if (value.length <= 3) {
            value = '';
            $('#search_vaults').val(value);
        }

        listVaults(value);
    });

    $('#sort').on('change', function () {
        var value = $('#search_vaults').val();
        if (value.length <= 3) {
            value = '';
            $('#search_vaults').val(value);
        }

        listVaults(value);
    });


    $('#requires_locked_time').on('change', function () {
        if ($(this).is(':checked')) {
            $('#vault_minimal_lock_days').show();
        } else {
            $('#vault_minimal_lock_days').hide();
        }
    });

    $('#requires_different_reward_token').on('change', function () {
        if ($(this).is(':checked')) {
            $('#reward_token').show();
        } else {
            $('#reward_token').hide();
        }
        $('#reward_amount').val('');
        $('#reward_est_value').html('$0.00');
    });

    $('#requires_locked_time').on('change', function () {
        if ($(this).is(':checked')) {
            $('#lock_days').show();
        } else {
            $('#lock_days').hide();
        }
    });


    class Slider {
        constructor(rangeElement, valueElement, options) {
            this.rangeElement = rangeElement
            this.valueElement = valueElement
            this.options = options

            // Attach a listener to "change" event
            this.rangeElement.addEventListener('input', this.updateSlider.bind(this))
        }

        // Initialize the slider
        init() {
            this.rangeElement.setAttribute('min', options.min)
            this.rangeElement.setAttribute('max', options.max)
            this.rangeElement.value = options.cur

            this.updateSlider()
        }

        // Format the money
        asMoney(value) {
            return parseFloat(value)
                .toLocaleString('en-US', {maximumFractionDigits: 2})
        }

        generateBackground(rangeElement) {
            if (this.rangeElement.value === this.options.min) {
                return
            }

            let percentage = (this.rangeElement.value - this.options.min) / (this.options.max - this.options.min) * 100
            return 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)'
        }

        updateSlider(newValue) {
            this.valueElement.innerHTML = this.asMoney(this.rangeElement.value)
            // this.rangeElement.style = this.generateBackground(this.rangeElement.value)
        }
    }

    let rangeElement = document.querySelector('.range [type="range"]')
    let valueElement = document.querySelector('.range .range__value span')

    let options = {
        min: 20,
        max: 365,
        cur: 20
    }

    if (rangeElement) {
        let slider = new Slider(rangeElement, valueElement, options)

        slider.init()
    }
    // range slider

    //close toast
    $('*[data-bs-dismiss="toast"]').click(function () {
        $(this).parents('.toast').toggleClass("show hide");
    })//close toast

});


function getUnit(decimals) {
    switch (decimals) {
        case '3':
            return "finney"
        case '6':
            return "szabo"
        case '9':
            return "gwei"
        case '18':
            return "ether"
    }
}

setInterval(async function () {
    await runUpdater();
}, updaterTime);
