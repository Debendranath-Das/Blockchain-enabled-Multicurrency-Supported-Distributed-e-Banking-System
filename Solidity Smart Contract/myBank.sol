// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract myBank
{
  using SafeMath for uint256;
  address admin;
  uint256 no_of_customer;
  uint256 no_of_active_customer;
  struct Customer{
    uint256 accNo;
    string name;
    uint256 balance_WEI;
    uint256 balance_INR_WEI;
    uint256 balance_Dollar_WEI;
    uint256 balance_Euro_WEI;
    bool active;
    uint256 timestamp_account_open;
    uint256 timestamp_account_close;
  }
  Customer[] customer;
  mapping(address=>uint256) accountNo;

  modifier onlyAdmin
  {
    require(msg.sender==admin,"Unauthorized Access!");
    _;
  }

  constructor()
  {
  	admin = msg.sender;
  	no_of_customer = 0;
    no_of_active_customer = 0;
  }

  //currecnyType:[0: WEI, 1: INR, 2: Dollar, 3: Euro]
  function openAccount(string memory _name, uint16 _currencyType) external payable
  {
    require(accountNo[msg.sender]==0,"Bank Account already exist for this address!");
    require(msg.value>0,"Deposit value must be positive!");
    uint256 _value = msg.value;
    no_of_customer++;
    no_of_active_customer++;
    accountNo[msg.sender] = no_of_customer;
    if(_currencyType == 0)
    { 
      customer.push(Customer(no_of_customer,_name,_value,0,0,0,true,block.timestamp,0));
    } 
    else if(_currencyType == 1)
    {
      customer.push(Customer(no_of_customer,_name,0,_value,0,0,true,block.timestamp,0));
    }
    else if(_currencyType == 2)
    {
      customer.push(Customer(no_of_customer,_name,0,0,_value,0,true,block.timestamp,0));
    }
    else
    {
      customer.push(Customer(no_of_customer,_name,0,0,0,_value,true,block.timestamp,0));
    }
  }

  function deposit(uint16 _currencyType) external payable
  {
    require(accountNo[msg.sender]!=0,"Bank account doesn't exist for this address!");
    require(msg.value>0,"Deposit value must be positive!");
    uint256 i = accountNo[msg.sender]-1;
    require(customer[i].active==true,"Customer's account is not active!");
    uint256 _value = msg.value;
    if(_currencyType == 0)
    {
      customer[i].balance_WEI += _value;
    }
    else if(_currencyType == 1)
    {
      customer[i].balance_INR_WEI += _value;
    }
    else if(_currencyType == 2)
    {
      customer[i].balance_Dollar_WEI += _value;
    }
    else
    {
      customer[i].balance_Euro_WEI += _value;
    }
  }

  function withdraw(uint16 _currencyType, uint256 _value) external
  {
    require(accountNo[msg.sender]!=0,"Bank account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    require(customer[i].active==true,"Customer's account is not active!");
    if(_currencyType == 0)
    {
      require(customer[i].balance_WEI >= _value,"Insufficient WEI balance to withdraw the amount!");
      customer[i].balance_WEI -= _value;
    }
    else if(_currencyType == 1)
    {
      require(customer[i].balance_INR_WEI >= _value,"Insufficient INR balance to withdraw the amount!");
      customer[i].balance_INR_WEI -= _value;
    }
    else if(_currencyType == 2)
    {
      require(customer[i].balance_Dollar_WEI >= _value,"Insufficient Dollar balance to withdraw the amount!");
      customer[i].balance_Dollar_WEI -= _value;
    }
    else
    {
      require(customer[i].balance_Euro_WEI >= _value,"Insufficient Euro balance to withdraw the amount!");
      customer[i].balance_Euro_WEI -= _value;
    }
    payable(msg.sender).transfer(_value);
  }

  function fundTransferByAccNo(uint256 _receiver_accNo, uint16 _currencyType, uint256  _value) external
  {
    require(accountNo[msg.sender]!=0,"Sender's bank account doesn't exist!");
    require(_receiver_accNo<=no_of_customer,"Receiver's Bank Account No is invalid!");
    uint256 i = accountNo[msg.sender] - 1;
    uint256 j = _receiver_accNo - 1;
    require(customer[i].active==true,"Sender's account is not active!");
    require(customer[j].active==true,"Receiver's account is not active!");
    if(_currencyType == 0)
    {
      require(customer[i].balance_WEI >= _value, "Sender has insufficient WEI balance for this transaction!");
      customer[i].balance_WEI -= _value;
      customer[j].balance_WEI += _value;
    }
    else if(_currencyType == 1)
    {
      require(customer[i].balance_INR_WEI >= _value, "Sender has insufficient INR balance for this transaction!");
      customer[i].balance_INR_WEI -= _value;
      customer[j].balance_INR_WEI += _value;
    }
    else if(_currencyType == 2)
    {
      require(customer[i].balance_Dollar_WEI >= _value, "Sender has insufficient Dollar balance for this transaction!");
      customer[i].balance_Dollar_WEI -= _value;
      customer[j].balance_Dollar_WEI += _value;
    }
    else
    {
      require(customer[i].balance_Euro_WEI >= _value, "Sender has insufficient Euro balance for this transaction!");
      customer[i].balance_Euro_WEI -= _value;
      customer[j].balance_Euro_WEI += _value;
    }
  }

  function fundTransferByAddress(address _receiver, uint16 _currencyType, uint256 _value) external
  {
    require(accountNo[msg.sender]!=0,"Sender's bank account doesn't exist!"); 
    require(accountNo[_receiver]!=0,"Receiver's bank account doesn't exist!");
    uint256 i = accountNo[msg.sender] - 1;
    uint256 j = accountNo[_receiver] - 1;
    require(customer[i].active==true,"Sender's account is not active!");
    require(customer[j].active==true,"Receiver's account is not active!");
    if(_currencyType == 0)
    {
      require(customer[i].balance_WEI >= _value, "Sender has insufficient WEI balance for this transaction!");
      customer[i].balance_WEI -= _value;
      customer[j].balance_WEI += _value;
    }
    else if(_currencyType == 1)
    {
      require(customer[i].balance_INR_WEI >= _value, "Sender has insufficient INR balance for this transaction!");
      customer[i].balance_INR_WEI -= _value;
      customer[j].balance_INR_WEI += _value;
    }
    else if(_currencyType == 2)
    {
      require(customer[i].balance_Dollar_WEI >= _value, "Sender has insufficient Dollar balance for this transaction!");
      customer[i].balance_Dollar_WEI -= _value;
      customer[j].balance_Dollar_WEI += _value;
    }
    else
    {
      require(customer[i].balance_Euro_WEI >= _value, "Sender has insufficient Euro balance for this transaction!");
      customer[i].balance_Euro_WEI -= _value;
      customer[j].balance_Euro_WEI += _value;
    }
  }

  function exchange(uint16 _currencyTypeFrom, uint16 _currencyTypeTo, uint256 _value) external
  {
    require(accountNo[msg.sender]!=0,"Bank account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    require(customer[i].active==true,"Customer's account is not active!");
    if(_currencyTypeFrom == 0)
    {
      require(customer[i].balance_WEI >= _value,"Insufficient balance for exchange!");
      customer[i].balance_WEI -= _value;
      if(_currencyTypeTo == 1)
      {
        customer[i].balance_INR_WEI += _value;
      }
      else if(_currencyTypeTo == 2)
      {
        customer[i].balance_Dollar_WEI += _value;
      }
      else //_currencyTypeTo == 3
      {
        customer[i].balance_Euro_WEI += _value;
      }
    }
    else if(_currencyTypeFrom == 1)
    {
      require(customer[i].balance_INR_WEI >= _value,"Insufficient balance for exchange!");
      customer[i].balance_INR_WEI -= _value;
      if(_currencyTypeTo == 0)
      {
        customer[i].balance_WEI += _value;
      }
      else if(_currencyTypeTo == 2)
      {
        customer[i].balance_Dollar_WEI += _value;
      }
      else //_currencyTypeTo == 3
      {
        customer[i].balance_Euro_WEI += _value;
      }
    }
    else if(_currencyTypeFrom == 2)
    {
      require(customer[i].balance_Dollar_WEI >= _value,"Insufficient balance for exchange!");
      customer[i].balance_Dollar_WEI -= _value;
      if(_currencyTypeTo == 0)
      {
        customer[i].balance_WEI += _value;
      }
      else if(_currencyTypeTo == 1)
      {
        customer[i].balance_INR_WEI += _value;
      }
      else //_currencyTypeTo == 3
      {
        customer[i].balance_Euro_WEI += _value;
      }
    }
    else //_currencyTypeFrom == 3
    {
      require(customer[i].balance_Euro_WEI >= _value,"Insufficient balance for exchange!");
      customer[i].balance_Euro_WEI -= _value;
      if(_currencyTypeTo == 0)
      {
        customer[i].balance_WEI += _value;
      }
      else if(_currencyTypeTo == 1)
      {
        customer[i].balance_INR_WEI += _value;
      }
      else //_currencyTypeTo == 2
      {
        customer[i].balance_Dollar_WEI += _value;
      }
    }
  }

  function closeAccount() external
  {
    require(accountNo[msg.sender]!=0,"Account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    uint256 _value = customer[i].balance_WEI + customer[i].balance_INR_WEI + customer[i].balance_Dollar_WEI + customer[i].balance_Euro_WEI;
    require(_value<=address(this).balance,"Insuffcient Contract's Fund!!");
    customer[i].balance_WEI = 0;
    customer[i].balance_INR_WEI = 0;
    customer[i].balance_Dollar_WEI = 0;
    customer[i].balance_Euro_WEI = 0;
    customer[i].active = false;
    customer[i].timestamp_account_close = block.timestamp;
    accountNo[msg.sender] = 0;
    no_of_active_customer--;
    payable(msg.sender).transfer(_value);
  } 

  function myAccountDetails() external view returns(uint256,string memory,uint256,uint256,uint256,uint256,bool)
  {
    require(accountNo[msg.sender]!=0,"Account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    return(customer[i].accNo,customer[i].name,customer[i].balance_WEI,customer[i].balance_INR_WEI,customer[i].balance_Dollar_WEI,customer[i].balance_Euro_WEI,customer[i].active);
  }

  function getAccountNo() external view returns(uint256)
  {
    return(accountNo[msg.sender]);
  }

  function getBalance(uint16 _currencyType) external view returns(uint256)
  {
    require(accountNo[msg.sender]!=0,"Account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    if(_currencyType == 0)
    {
      return(customer[i].balance_WEI);
    }
    else if(_currencyType == 1)
    {
      return(customer[i].balance_INR_WEI);
    }
    else if(_currencyType == 2)
    {
      return(customer[i].balance_Dollar_WEI);
    }
    else
    {
      return(customer[i].balance_Euro_WEI);
    }
  }

  function getBalanceAll() external view returns(uint256,uint256,uint256,uint256)
  {
    require(accountNo[msg.sender]!=0,"Account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    return(customer[i].balance_WEI,customer[i].balance_INR_WEI,customer[i].balance_Dollar_WEI,customer[i].balance_Euro_WEI);
  }

  function getUserName() external view returns(string memory)
  {
    require(accountNo[msg.sender]!=0,"Account doesn't exist for this address!");
    uint256 i = accountNo[msg.sender]-1;
    return(customer[i].name);
  }

  function totalCustomer() external view onlyAdmin returns(uint256)
  {
    return(no_of_customer);
  }

  function totalActiveCustomer() external view onlyAdmin returns(uint256)
  {
    return(no_of_active_customer);
  }

  function totalBankBalance() external view onlyAdmin returns(uint256)
  {
    return(address(this).balance);
  }
  
}
