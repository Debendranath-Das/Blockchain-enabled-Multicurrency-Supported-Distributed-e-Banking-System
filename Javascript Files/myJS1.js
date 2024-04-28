
    var web3;
    var account;
    var accountAddress;
    const connect = document.getElementById("walletConnect").onclick = async ()=> {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            //window.web3 = new Web3(window.ethereum); 
            web3 = new Web3(window.ethereum);
            account = web3.eth.accounts;     //Get the current MetaMask selected/active wallet
            accountAddress = account.givenProvider.selectedAddress; 
            console.log(`Account Address: ${accountAddress}`);
            document.getElementById("walletConnect").style.display="none";
            document.getElementById("redirectToDApp").style.display="block";
            document.getElementById("address").style.display="block";
            document.getElementById("address").innerHTML="Success!! Connection has been established with MetaMask wallet.<br><br> Your public address is: <b>"+accountAddress+"</b>";
        } else {
            console.log('No wallet found!!!');
            alert("'No wallet found!!!");
        }
        return(accountAddress);
    };
    document.getElementById("redirectToDApp").onclick = ()=>{
            location.href = "../HTML Files/myBank.html";
    };
    /* 
    connect().then(()=>{
        document.getElementById("address").innerHTML="Success!! Connection established with Metamask wallet.<br><br> Your public address is: <b>"+accountAddress+"</b>";
        console.log(accountAddress);
    });  
    */