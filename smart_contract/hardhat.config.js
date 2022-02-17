
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/h4O_a4Lq7adon8Sixf4MrBoo2SRILB3x',
      accounts: ['32482866ccb251f1be37f5e056c9774e41409507582abc81dee547141f571301']
    }
  }
}