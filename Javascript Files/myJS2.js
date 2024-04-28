var web3;
var account;
var accountAddress;
var accountBalanceWallet_WEI;
var accountBalanceWallet_ETH;
var accountBalanceBank_WEI;
var accountBalanceBank_ETH;
var accountBalanceBank_INR;
var accountBalanceBank_INR_WEI;
var accountBalanceBank_Dollar;
var accountBalanceBank_Dollar_WEI;
var accountBalanceBank_Euro;
var accountBalanceBank_Euro_WEI;
var timestampLastUpdated;
var fromETH = [];
var myBankContract;
//Bank Admin: 0x4d77E8A6D235d540Eb5cE251f5455F2e6A100287
//const contractAddress = "0xf49D139f849419aA9275170B4048e514caFc6BAF"; For Goerli Testnet 
//const contractAddress = "0x2274AA4FfF122Ddaf5519112a43DE98B5F833b83"; 
const contractAddress = "0x459b5EC8C6C4273Ed131934CdF0F2064C563bDC0"; //For Sepolia Testnet
const abi = [
    {
        "inputs": [],
        "name": "closeAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_currencyTypeFrom",
                "type": "uint16"
            },
            {
                "internalType": "uint16",
                "name": "_currencyTypeTo",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "exchange",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_receiver_accNo",
                "type": "uint256"
            },
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "fundTransferByAccNo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "fundTransferByAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            }
        ],
        "name": "openAccount",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAccountNo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint16",
                "name": "_currencyType",
                "type": "uint16"
            }
        ],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalanceAll",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "myAccountDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalActiveCustomer",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalBankBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCustomer",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const walletConnect = window.onload = async function(){
    //Connect To Wallet..
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    account = web3.eth.accounts;     //Get the current MetaMask selected/active wallet
    accountAddress = account.givenProvider.selectedAddress;
    //Connect To Currency Exchange Rate API..
    getCurrentTimestamp();
    const API_connect_response = await fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=INR,USD,EUR,&api_key=e29c6a84eba092a65874de9f79218734ddad9cf2e1c439f5e98575407040e114');
    const response_json = await API_connect_response.json();
    fromETH.push(response_json.ETH['INR']);
    fromETH.push(response_json.ETH['USD']);
    fromETH.push(response_json.ETH['EUR']);
};

walletConnect().then(()=>{
    console.log("wallet connected");
    document.getElementById("div_userAccount").style.display="block";
    document.getElementById("userAddress").innerHTML="Your Public Address: <b>"+accountAddress+"</b>";
    setInterval(function(){
            web3.eth.getBalance(accountAddress).then((res) => {
                accountBalanceWallet_WEI = BigInt(res);
                accountBalanceWallet_ETH = web3.utils.fromWei(res,"ether");
                document.getElementById("walletBalance").innerHTML = "Your MetaMask Wallet Balance: <b>"+accountBalanceWallet_WEI+" Wei / "+accountBalanceWallet_ETH+" ETH<b>"; 
            //localStorage.setItem("currentWalletBalance") = res;
        });
    },10);
    console.log("Deployed Contract Address (Sepolia Test Net): "+contractAddress);
    console.log("Contract ABI: "+abi);
    console.log("Timestamp of calling API:"+timestampLastUpdated);
    console.log("1 ETH = " + fromETH[0] + " INR");
    console.log("1 ETH = " + fromETH[1] + " USD");
    console.log("1 ETH = " + fromETH[2] + " EUR");
    myBankContract = new web3.eth.Contract(abi,contractAddress);
    //console.log(myBankContract);
    
    myBankContract.methods.getAccountNo().call({from: accountAddress}).then(function(res){
        if(res == 0) //user doesn't have a bank account.
        {
            document.getElementById("display").innerHTML = "<b>You don't have a Bank Account.</b><br><br>";
            document.getElementById("div_openNewAcc").style.display = "block";
        }
        else // user has a bank account.
        {   
            myBankContract.methods.myAccountDetails().call({from: accountAddress}).then(function(res){
                console.log("Account Number: "+res[0]);
                console.log("Name: "+res[1]);
                console.log("Bank Account Balance (WEI): "+res[2]);
                console.log("Bank Account Balance (INR_WEI): "+res[3]);
                console.log("Bank Account Balance (Dollar_WEI): "+res[4]);
                console.log("Bank Account Balance (Euro_WEI): "+res[5]);
                document.getElementById("display").innerHTML = "Account No: <b>"+res[0]+"</b><br><br>Account Holder Name: <b>"+res[1]+"<b><br>";
                document.getElementById("div_bankingOptions").style.display = "block";
            });
            //Fetching User's Bank Account Balance in a regular interval..
            setInterval(()=>{
            myBankContract.methods.getBalanceAll().call({from: accountAddress}).then(function(res){
                accountBalanceBank_WEI = BigInt(res[0]);
                accountBalanceBank_ETH = web3.utils.fromWei(res[0],"ether");
                accountBalanceBank_INR_WEI = BigInt(res[1]);
                accountBalanceBank_Dollar_WEI = BigInt(res[2]);
                accountBalanceBank_Euro_WEI = BigInt(res[3]);
                // document.getElementById("bankBalance").innerHTML = "Account Balance: <b>"+res+" Wei<b>";
                });
            },10);
        }
    });
    
    document.getElementById("openNewAcc").onclick = ()=>{
        document.getElementById("div_openNewAcc").style.display = "none";
        document.getElementById("div_form1").style.display = "block";
    };

    document.getElementById("form1_cancel").onclick = ()=>{
        document.forms["form1"].reset();
        document.getElementById("div_openNewAcc").style.display = "block";
        document.getElementById("div_form1").style.display = "none";
    };

    document.getElementById("form1_submit").onclick = ()=>{
        const _name = document.getElementById("form1_name").value;
        const _val = document.getElementById("form1_amount").value;
        const _radio = document.getElementsByName("form1_unit");
        if( validateName(_name) == true && validateAmount(_val) == true )
        {	
            var _unit;
            var _con_val = _val;
            for(i=0;i<_radio.length;i++)
            {
                if(_radio[i].checked)
                {
                    _unit = _radio[i].value;
                    break;
                }
            }
            checkCurrencyExchangeRate().then(()=>{
                _con_val = convertToWei(_val,_unit);
                if( validateBalanceAgainstWallet(_con_val) == true )
                {
                    if(_unit!="wei")
                    {
                        alert("Attention!! \n\nCurrent Currency Exchange Rate ( "+timestampLastUpdated+" ):\n\u25C6 1 ETH = \u20B9 "+fromETH[0]+" INR = $ "+fromETH[1]+" Dollar = \u20AC "+fromETH[2]+" Euro\n\nAs per the exchange rate, your wallet will be debited by "+_con_val+" WEI.\n\nTransaction will be declined if you have insufficient wallet balance.");
                    }
                    document.getElementById("div_form1").style.display = "none";                            
                    document.getElementById("div_openNewAcc").style.display = "none";
                    document.getElementById("display").innerHTML = "<b>Please wait. We will notify you once the accout is opened !</b>"
                    console.log(_name);
                    console.log(_val);
                    console.log(_con_val);
                    //console.log(unitMap(_unit));
                    let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                    startTimestamp = Date.now();							//console.log(typeof(unitMap(_unit)));
                    myBankContract.methods.openAccount(_name,unitMap(_unit)).send({from: accountAddress,value: Number(_con_val)})
                    .once('transactionHash', (hash) => {
                        metamaskConfirmationTimestamp = Date.now();
                        const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                        console.log("Transaction Hash Received: " + hash);
                        console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                    })
                    .then((receipt)=>{
                        endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                        const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                        console.log(receipt);	
                        console.log("Transaction Confirmed!");
                        console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                        document.getElementById("display").innerHTML = "<b>Your bank account has been created successfully!!</b>";
                        setTimeout(()=>{
                            location.reload();
                        },4000);
                    })
                    .catch((error)=>{
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_openNewAcc").style.display = "block";
                        document.getElementById("display").innerHTML = "<b>You don't have a Bank Account.</b><br><br>";
                        document.forms["form1"].reset(); 
                    });
                    /* myBankContract.methods.openAccount(_name).send({from: accountAddress,value: _val})
                    .on('transactionHash', function (hash){
                        document.getElementById("display").innerHTML = "<b>Your bank account has been created successfully!!</b>";
                        setTimeout(()=>{
                            //location.reload();
                            myBankContract.methods.myAccountDetails().call({from: accountAddress}).then(function(res){
                            document.getElementById("display").innerHTML = "Account No: <b>"+res[0]+"</b><br><br>Account Holder Name: <b>"+res[1]+"<b><br>";    									document.getElementById("div_bankingOptions").style.display = "block";	
                            });                         
                        },4000);
                    })
                    .on('error', function (error, receipt) {
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_openNewAcc").style.display = "block";
                        //location.reload();
                    }); */
                }
                document.forms["form1"].reset();		
            });
        }
    };
    
    document.getElementById("showBalance").onclick = ()=>{
        
        checkCurrencyExchangeRate().then(()=>{
            console.log(accountBalanceBank_WEI);
            console.log(accountBalanceBank_INR_WEI);
            console.log(accountBalanceBank_Dollar_WEI);
            console.log(accountBalanceBank_Euro_WEI);
            accountBalanceBank_INR = convertToFiat("inr").toFixed(2);
            accountBalanceBank_Dollar = convertToFiat("dollar").toFixed(2);
            accountBalanceBank_Euro = convertToFiat("euro").toFixed(2);
            document.getElementById("balanceHeading").innerHTML = "Bank Account Balance (as of now: "+timestampLastUpdated+" )";
            document.getElementById("td_Ether").innerHTML = "&#9670 " + accountBalanceBank_ETH;
            document.getElementById("td_Ether_WEI").innerHTML = accountBalanceBank_WEI;
            document.getElementById("td_INR").innerHTML = "&#x20B9 " + accountBalanceBank_INR;
            document.getElementById("td_INR_WEI").innerHTML = accountBalanceBank_INR_WEI;
            document.getElementById("td_Dollar").innerHTML = "&#x24 " + accountBalanceBank_Dollar;
            document.getElementById("td_Dollar_WEI").innerHTML = accountBalanceBank_Dollar_WEI;
            document.getElementById("td_Euro").innerHTML = "&#x20ac  " + accountBalanceBank_Euro;
            document.getElementById("td_Euro_WEI").innerHTML = accountBalanceBank_Euro_WEI;
            document.getElementById("exchangeRate").innerHTML = "Current Currency Exchange Rate: &#9670 1 ETH = &#x20B9 "+fromETH[0]+" INR = &#x24 "+fromETH[1]+" Dollar = &#x20ac "+fromETH[2]+" Euro";
            document.getElementById("showBalance").style.display = "none";
            document.getElementById("bankBalance").style.display = "block";
            setTimeout(()=>{
                document.getElementById("bankBalance").style.display = "none";
                document.getElementById("showBalance").style.display = "block";
            },20000);	
        });
        
    };

    document.getElementById("deposit").onclick = ()=>{
        document.getElementById("div_form2").style.display = "block";
        document.getElementById("div_bankingOptions").style.display = "none";
    };

    document.getElementById("form2_cancel").onclick = ()=>{
        document.getElementById("div_form2").style.display = "none";
        document.getElementById("div_bankingOptions").style.display = "block";
        document.forms["form2"].reset(); 
    };

    document.getElementById("form2_submit").onclick = ()=>{
        const _val = document.getElementById("form2_amount").value;
        if(validateAmount(_val)==true)
        {
            const _radio = document.getElementsByName("form2_unit");
            var _unit;
            var _con_val;
            console.log(_val);
            for(i=0;i<_radio.length;i++)
            {
                if(_radio[i].checked)
                {
                    _unit = _radio[i].value;
                    break;
                }
            }
            checkCurrencyExchangeRate().then(()=>{
                _con_val = convertToWei(_val,_unit);
                if(validateBalanceAgainstWallet(_con_val) == true)
                {
                    document.getElementById("div_form2").style.display = "none";
                    if(_unit!="wei")
                    {
                        alert("Attention!! \n\nCurrent Currency Exchange Rate ( "+timestampLastUpdated+" ):\n\u25C6 1 ETH = \u20B9 "+fromETH[0]+" INR = $ "+fromETH[1]+" Dollar = \u20AC  "+fromETH[2]+" Euro \n\nAs per the exchange rate, your wallet will be debited by "+_con_val+" WEI.\n\nTransaction will be declined if you have insufficient wallet balance.");
                    }
                    let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                    startTimestamp = Date.now();
                    myBankContract.methods.deposit(unitMap(_unit)).send({ from: accountAddress, value: Number(_con_val) })
                    .once('transactionHash', (hash) => {
                        metamaskConfirmationTimestamp = Date.now();
                        const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                        console.log("Transaction Hash Received: " + hash);
                        console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                    })
                    .then((receipt) => {
                        endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                        const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                        console.log(receipt);
                        console.log("Transaction Confirmed!");
                        console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                        alert("Amount deposited successfully!!\nPlease note transaction hash for future reference:\n" + receipt.transactionHash);
                        document.getElementById("div_bankingOptions").style.display = "block";
                    })
                    .catch((error) => {
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_bankingOptions").style.display = "block";
                    });
                    /* 
                    myBankContract.methods.deposit().send({ from: accountAddress, value: _val })
                    .on('transactionHash', function (hash) {
                        alert("Amount deposited successfully!!\nPlease note transaction hash for future reference:\n" + hash);
                        document.getElementById("div_bankingOptions").style.display = "block";
                    })
                    .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_bankingOptions").style.display = "block";
                        //location.reload();
                    }); 
                    */
                    document.forms["form2"].reset();
                }
            });
        }
    };

    document.getElementById("withdraw").onclick = ()=>{
        document.getElementById("div_form3").style.display = "block";
        document.getElementById("div_bankingOptions").style.display = "none";
    };

    document.getElementById("form3_cancel").onclick = ()=>{
        document.getElementById("div_form3").style.display = "none";
        document.getElementById("div_bankingOptions").style.display = "block";
        document.forms["form3"].reset(); 
    };

    document.getElementById("form3_submit").onclick = ()=>{
        const _val = document.getElementById("form3_amount").value;
        if(validateAmount(_val)==true)
        {
            const _radio = document.getElementsByName("form3_unit");
            var _unit;
            var _con_val;
            for(i=0;i<_radio.length;i++)
            {
                if(_radio[i].checked)
                {
                    _unit = _radio[i].value;
                    break;
                }
            }
            checkCurrencyExchangeRate().then(()=>{
                _con_val = convertToWei(_val,_unit);
                if(validateBalanceAgainstBank(_con_val,_unit) == true)
                {
                    if(_unit!="wei")
                    {
                        alert("Attention!! \n\nCurrent Currency Exchange Rate ( "+timestampLastUpdated+" ):\n\u25C6  1 ETH = \u20B9 "+fromETH[0]+" INR = $ "+fromETH[1]+" Dollar = \u20AC "+fromETH[2]+" Euro\n\nAs per the exchange rate, your wallet will be credited by "+_con_val+" WEI.");
                    }
                    document.getElementById("div_form3").style.display = "none";
                    let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                    startTimestamp = Date.now();
                    myBankContract.methods.withdraw(unitMap(_unit),_con_val).send({from: accountAddress})
                    .once('transactionHash', (hash) => {
                        metamaskConfirmationTimestamp = Date.now();
                        const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                        console.log("Transaction Hash Received: " + hash);
                        console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                    })
                    .then((receipt)=>{
                        endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                        const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                        console.log(receipt);	
                        console.log("Transaction Confirmed!");
                        console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                        alert("Amount is withdrawn successfully!!\nPlease note transaction hash for future reference:\n" + receipt.transactionHash);
                        document.getElementById("div_bankingOptions").style.display = "block";
                    })
                    .catch((error)=>{
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_bankingOptions").style.display = "block";

                    }); 
                    /*
                    myBankContract.methods.withdraw(_val).send({from: accountAddress})
                    .on('transactionHash', function (hash) {
                        alert("Amount is withdrawn successfully!!\nPlease note transaction hash for future reference:\n" + hash);
                        document.getElementById("div_bankingOptions").style.display = "block";
                    })
                    .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                        alert("Transaction is rejected from Wallet!!\n" + error.message);
                        document.getElementById("div_bankingOptions").style.display = "block";
                        //location.reload();
                    });
                    */
                }
            });
        }
        document.forms["form3"].reset(); 
    };

    document.getElementById("fundTransfer").onclick = ()=>{
        document.getElementById("div_form4").style.display = "block";
        document.getElementById("div_bankingOptions").style.display = "none";
    };

    document.getElementById("form4_cancel").onclick = ()=>{
        document.getElementById("div_form4").style.display = "none";
        document.getElementById("div_bankingOptions").style.display = "block";
        document.forms["form4"].reset(); 
    };

    document.getElementById("form4_submit").onclick = ()=>{
        const _recipient = document.getElementById("form4_receiver").value;
        const _radio1 = document.getElementsByName("form4_recipient_selector");
        var _recipient_type;
        for(i=0;i<_radio1.length;i++)
        {
            if(_radio1[i].checked)
            {
                _recipient_type = _radio1[i].value;
                break;
            }
        }
        const _val = document.getElementById("form4_amount").value;
        const _radio2 = document.getElementsByName("form4_unit");
        var _unit;
        for(i=0;i<_radio2.length;i++)
        {
            if(_radio2[i].checked)
            {
                _unit = _radio2[i].value;
                break;
            }
        }
        if(validateAmount(_val)==true)
        {
            var _con_val;
            _con_val = convertToWei(_val,_unit);
            console.log(_con_val);
            if(validateBalanceAgainstBank(_con_val,_unit) == true)
            {
                if(_recipient_type=="addr")
                {
                    if(validateAddress(_recipient) == true)
                    {
                        document.getElementById("div_form4").style.display = "none";
                        console.log(_con_val);
                        let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                        startTimestamp = Date.now();
                        myBankContract.methods.fundTransferByAddress(_recipient,unitMap(_unit),_con_val).send({from: accountAddress})
                        .once('transactionHash', (hash) => {
                            metamaskConfirmationTimestamp = Date.now();
                            const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                            console.log("Transaction Hash Received: " + hash);
                            console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                        })
                        .then((receipt)=>{
                            endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                            const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                            console.log(receipt);	
                            console.log("Transaction Confirmed!");
                            console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                            alert("Amount transferred successfully!! Please note transaction hash for future reference:\n" + receipt.transactionHash);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        })
                        .catch((error)=>{
                            alert("Transaction is rejected from Wallet!!\n" + error.message);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        });
                    }
                }
                else //_recipient_type=="accNo"
                {
                    if(validateAccNo(_recipient)==true)
                    {
                        document.getElementById("div_form4").style.display = "none";
                        console.log(_con_val);
                        let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                        startTimestamp = Date.now();
                        myBankContract.methods.fundTransferByAccNo(_recipient,unitMap(_unit),_con_val).send({from: accountAddress})
                        .once('transactionHash', (hash) => {
                            metamaskConfirmationTimestamp = Date.now();
                            const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                            console.log("Transaction Hash Received: " + hash);
                            console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                        })
                        .then((receipt)=>{
                            endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                            const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                            console.log(receipt);	
                            console.log("Transaction Confirmed!");
                            console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                            alert("Amount transferred successfully!! Please note transaction hash for future reference:\n" + receipt.transactionHash);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        })
                        .catch((error)=>{
                            alert("Transaction is rejected from Wallet!!\n" + error.message);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        });
                    }
                }
            }
        }
        document.forms["form4"].reset(); 
    };

    document.getElementById("currencyExchange").onclick = ()=>{
        document.getElementById("div_form5").style.display = "block";
        document.getElementById("div_bankingOptions").style.display = "none";
    };

    document.getElementById("form5_cancel").onclick = ()=>{
        document.getElementById("div_form5").style.display = "none";
        document.getElementById("div_bankingOptions").style.display = "block";
        document.forms["form5"].reset(); 
    };
    
    document.getElementById("form5_submit").onclick = ()=>{
        const _val = document.getElementById("form5_amount").value;
        if(validateAmount(_val)==true)
        {	
            const selectedUnitFrom = document.getElementById("form5_currency_from");
            const currencyUnitFrom = selectedUnitFrom.value;
            const unit_from = selectedUnitFrom.options[selectedUnitFrom.selectedIndex].text;

            const selectedUnitTo = document.getElementById("form5_currency_to");
            const currencyUnitTo = selectedUnitTo.value;
            const unit_to = selectedUnitTo.options[selectedUnitTo.selectedIndex].text;
            
            if(currencyUnitFrom == currencyUnitTo)
            {
                alert("Currency exchange 'from' and 'to' must be different!");
            }
            else
            {
                var _unit = currencyUnitFrom;
                var _con_val;
                var _after_convert;
                checkCurrencyExchangeRate().then(()=>{
                    _con_val = convertToWei(_val,_unit);
                    if(validateBalanceAgainstBank(_con_val,_unit) == true)
                    {
                        _after_convert = convert2Fiat(_con_val,currencyUnitTo);
                        alert("Attention!! \n\nCurrent Currency Exchange Rate ( "+timestampLastUpdated+" ):\n\u25C6  1 ETH = \u20B9 "+fromETH[0]+" INR = $ "+fromETH[1]+" Dollar = \u20AC "+fromETH[2]+" Euro\n\nAs per the exchange rate,\nyour bank account will be debited by "+_val+" "+unit_from+"\nand credited by "+_after_convert+" "+unit_to+"!!");
                        document.getElementById("div_form5").style.display = "none";
                        let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                        startTimestamp = Date.now();
                        myBankContract.methods.exchange(unitMap(currencyUnitFrom),unitMap(currencyUnitTo),_con_val).send({from: accountAddress})
                        .once('transactionHash', (hash) => {
                            metamaskConfirmationTimestamp = Date.now();
                            const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                            console.log("Transaction Hash Received: " + hash);
                            console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                        })
                        .then((receipt)=>{
                            endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                            const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                            console.log(receipt);	
                            console.log("Transaction Confirmed!");
                            console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                            alert("Currency exchange successful!!\nPlease note transaction hash for future reference:\n" + receipt.transactionHash);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        })
                        .catch((error)=>{
                            alert("Transaction is rejected from Wallet!!\n" + error.message);
                            document.getElementById("div_bankingOptions").style.display = "block";
                        }); 
                    }
                });
            } 
        }
        document.forms["form5"].reset();
    }

    document.getElementById("closeAccount").onclick = ()=>{
        if(confirm("Attention!!\nYou are going to close your bank account.\n\nPlease confirm to proceed."))
        {
            document.getElementById("div_bankingOptions").style.display = "none";
            var totalwei;
            totalwei = accountBalanceBank_WEI+accountBalanceBank_INR_WEI+accountBalanceBank_Dollar_WEI+accountBalanceBank_Euro_WEI;
            checkCurrencyExchangeRate().then(()=>{
                accountBalanceBank_INR = convertToFiat("inr");
                accountBalanceBank_Dollar = convertToFiat("dollar");
                accountBalanceBank_Euro = convertToFiat("euro");
                alert("Attention!!\n\nYou are holding the following balances in your bank account:\n"+accountBalanceBank_WEI+" WEI\n\u20B9"+accountBalanceBank_INR+" INR\n$"+accountBalanceBank_Dollar+" Dollar\n\u20AC "+accountBalanceBank_Euro+" Euro\n\nCurrent Currency Exchange Rate ( as of now: "+timestampLastUpdated+" )\n\u25C6 ETH = \u20B9"+fromETH[0]+" INR = $"+fromETH[1]+" Dollar = \u20AC "+fromETH[2]+" Euro\n\nAs per the exchange rate, your wallet will be credited by "+totalwei+" WEI at the time of closing bank account.");
                let startTimestamp, metamaskConfirmationTimestamp, endTimestamp;
                startTimestamp = Date.now();
                myBankContract.methods.closeAccount().send({from: accountAddress})
                .once('transactionHash', (hash) => {
                    metamaskConfirmationTimestamp = Date.now();
                    const userInteractionTime = metamaskConfirmationTimestamp - startTimestamp;
                    console.log("Transaction Hash Received: " + hash);
                    console.log("User Interaction Time (i.e. time taken to click on the confirm button in Metamask): " + userInteractionTime + " ms");
                })
                .then((receipt)=>{
                    endTimestamp = Date.now(); // Record the end time after receiving the confirmation
                    const transactionLatency = endTimestamp - metamaskConfirmationTimestamp; // Calculate the transaction latency in milliseconds
                    console.log(receipt);	
                    console.log("Transaction Confirmed!");
                    console.log("Transaction Latency (i.e time taken to include the transaction in a block after getting confirmation in Metamask): " + transactionLatency + " ms");
                    alert("Your account is closed!!\nPlease note transaction hash for future reference:\n" + receipt.transactionHash);
                    location.reload();
                })
                .catch((error)=>{
                    alert("Transaction is rejected from Wallet!!\n" + error.message);
                    document.getElementById("div_bankingOptions").style.display = "block";
                });
            });
        }
        else
        {
            document.getElementById("div_bankingOptions").style.display = "block";
        }
    };
});

function validateAddress(x)
{
    if(x.length==0 || x==null || x=="")
    {
        alert("Recipient's Address can't be empty !!");
        return false;
    }
    var regx = /^0[x,X][\d,a-f,A-F]{40}$/;
    if(!regx.test(x))
    {
        alert("Invalid Recipient's Address !! Please Re-check.");
        return false;
    }
    if(x==accountAddress)
    {
        alert("Recipient's address must be different from your own address !!");
        return false;
    }
    return true;
}

function validateAccNo(x)
{
    if(x.length==0 || x==null || x=="")
    {
        alert("Recipient's Account Number can't be empty !!");
        return false;
    }
    var regx = /^[1-9]\d*$/;
    if(!regx.test(x))
    {
        alert("Invalid Recipient's Account Number!! Only numeric value is allowed.");
        return false;
    }
    if(x<=0)
    {
        alert("Invalid Receiver's Account Number!!");
        return false;
    }
    return true;
}

function validateAmount(x)
{
    var regx = /^\d*$/;
    if(x==null || x=="")
    {
        alert("Amount field must be non empty !!")
        return false;
    }
    else if(x<=0)
    {
        alert("Value in Amount field must be greater than 0 !!");
        return false;
    }
    else if(!regx.test(x))
    {
        alert("Only numeric integer value is allowed in Amount field !!");
        return false;
    }
    else
    {
        return true;
    }
}

function validateName(x)
{
    var regex = /^[A-Z][a-z,A-Z, ]{2,29}$/;
    if(x==null || x=="" || x.length==0)
    {
        alert("Name can't be empty !!");
        return false;
    }
    if(!regex.test(x))
    {
        alert("Name must be a valid string of alphabets.\nFirst character should be in capital.\n3<= Length <=30");
        return false;
    }
    return true;
}

function validateBalanceAgainstWallet(x) //x :value..
{
    console.log("inside validateBalanceAgainstWallet: "+typeof(x));
    console.log("inside validateBalanceAgainstWallet: "+ x);
    
    if(x>accountBalanceWallet_WEI)
    {
        alert("Insufficient Wallet Balance !!");
        return false;
    }
    else
    {
        return true;
    }
    
}

function validateBalanceAgainstBank(x,y) //x: value in wei, y:unit
{
    if(x>accountBalanceBank_WEI && y=='wei')
    {
        alert("Insufficient Bank Account Balance !! Please check your WEI balance.");
        return false;
    }
    else if(x>accountBalanceBank_INR_WEI && y=='inr')
    {
        alert("Insufficient Bank Account Balance !! Please check your INR balance.");
        return false;
    }
    else if(x>accountBalanceBank_Dollar_WEI && y=='dollar')
    {
        alert("Insufficient Bank Account Balance !! Please check your Dollar balance.");
        return false;
    }
    else if(x>accountBalanceBank_Euro_WEI && y=='euro')
    {
        alert("Insufficient Bank Account Balance !! Please check your Euro balance.");
        return false;
    }
    else
    {
        return true;
    }
}

function getCurrentTimestamp()
{
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    timestampLastUpdated = date+' '+time;
}

async function checkCurrencyExchangeRate()
{
    getCurrentTimestamp();
    var API_connect_response = await fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=INR,USD,EUR,&api_key=e29c6a84eba092a65874de9f79218734ddad9cf2e1c439f5e98575407040e114');
    var response_json = await API_connect_response.json();
    fromETH[0] = response_json.ETH['INR'];
    fromETH[1] = response_json.ETH['USD'];
    fromETH[2] = response_json.ETH['EUR'];
    
}

function convertToWei(val,unit)
{
    //console.log("inside convertToWei: "+ val);
    var x,converted_val;	
    switch(unit)
    {
        case "inr": //from INR to WEI..
                x = BigInt(val)*BigInt(Math.pow(10,18));
                converted_val = BigInt(Math.round(Number(x)/fromETH[0]));
                break;
        case "dollar": //from  Dollar to WEI..
                x = BigInt(val)*BigInt(Math.pow(10,18));
                converted_val = BigInt(Math.round(Number(x)/fromETH[1]));
                break;
        case "euro": //from Euro to WEI..
                x = BigInt(val)*BigInt(Math.pow(10,18));
                converted_val = BigInt(Math.round(Number(x)/fromETH[2]));
                break;
        default://Val is already in WEI.. 
                converted_val = BigInt(val);
                break;
    }
    return(converted_val);
}

function convert2Fiat(val,unit)
{
    var x,converted_val;	
    switch(unit)
    {
        case "inr": //from WEI to INR..
                x = Number(val)*fromETH[0];
                converted_val = x/Math.pow(10,18);
                break;
        case "dollar": //from WEI to Dollar..
                x = Number(val)*fromETH[1];
                converted_val = x/Math.pow(10,18);
                break;
        case "euro": //from WEI to Euro..
                x = Number(val)*fromETH[2];
                converted_val = x/Math.pow(10,18);
                break;
        default://Val is already in WEI.. 
                converted_val = val;
                break;
    }
    return(converted_val);
}

function convertToFiat(unit)
{
    var x,converted_val;	
    switch(unit)
    {
        case "inr": //from WEI to INR..
                x = Number(accountBalanceBank_INR_WEI)*fromETH[0];
                converted_val = x/Math.pow(10,18);
                break;
        case "dollar": //from WEI to Dollar..
                x = Number(accountBalanceBank_Dollar_WEI)*fromETH[1];
                converted_val = x/Math.pow(10,18);
                break;
        case "euro": //from WEI to Euro..
                x = Number(accountBalanceBank_Euro_WEI)*fromETH[2];
                converted_val = x/Math.pow(10,18);
                break;
        default://Val is already in WEI.. 
                break;
    }
    return(converted_val);
}

function unitMap(x)
{
    switch(x)
    {
        case "wei": return(0);
        case "inr": return(1);
        case "dollar": return(2);
        case "euro": return(3);
        default: console.log("UnitMap error!");
                 break;
    }
}

