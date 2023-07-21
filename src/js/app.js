App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('MyToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var MyTokenArtifact = data;
      App.contracts.MyToken = TruffleContract(MyTokenArtifact);
    
      // Set the provider for our contract
      App.contracts.MyToken.setProvider(App.web3Provider);

      return App.showEthereumAddress();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', function(event) {
      event.preventDefault();
  
      var amount = parseInt($('#TransferAmount').val()) * (10 ** 18);
      var toAddress = $('#TransferAddress').val();
  
      App.handleTransfer(amount, toAddress);
    });

    $(document).on('click', '#transfer5TokenButton', function(event) {
      event.preventDefault();
  
      var amount = 5 * (10 ** 18);
  
      App.handleTokenTransfer(amount);
    });
    $(document).on('click', '#transfer10TokenButton', function(event) {
      event.preventDefault();
  
      var amount = 10 * (10 ** 18);
  
      App.handleTokenTransfer(amount);
    });
    $(document).on('click', '#transfer15TokenButton', function(event) {
      event.preventDefault();
  
      var amount = 15 * (10 ** 18);
  
      App.handleTokenTransfer(amount);
    });
  },

  handleTransfer: function(amount, toAddress) {

    console.log('Transfer ' + amount + ' to ' + toAddress);

    var tokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.MyToken.deployed().then(function(instance) {
        tokenInstance = instance;

        return tokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleTokenTransfer: function(amount) {
    
    var toAddress = "0xdc0cf9D1e826Fa2EBAe9cd10b5f1c09D9B15983c";
    
    console.log('Transfer ' + amount + ' to ' + toAddress);

    var tokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.MyToken.deployed().then(function(instance) {
        tokenInstance = instance;

        return tokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  showEthereumAddress: function() {
    console.log('Getting Ethereum address...');
  
    var accountElement = document.getElementById("Account");
  
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
  
      var account = accounts[0];
  
      accountElement.innerHTML = account;
    });

    return App.getBalances();
  },

  getBalances: function() {
    console.log('Getting balances...');
  
    var tokenInstance;
  
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
  
      var account = accounts[0];
  
      App.contracts.MyToken.deployed().then(function(instance) {
        tokenInstance = instance;
  
        return Promise.all([
          tokenInstance.balanceOf(account),
          tokenInstance.decimals()
        ]);
      }).then(function(results) {
        var balance = results[0];
        var decimals = results[1].toNumber();
  
        balance = balance.div(10 ** decimals).toNumber();
  
        $('#Balance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
  
};
  
$(function() {
    $(window).load(function() {
        App.initWeb3();
    });
});
  
