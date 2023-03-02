const tokenABI = require('./ABIs/Token_ABI.json')
const minisABI = require('./ABIs/Node_ABI.json')
const rpABI = require('./ABIs/Pool_ABI.json')
const msABI = require('./ABIs/MS_ABI.json')
const landABI = require('./ABIs/Land_ABI.json')

const tokenAddress = '0x9e03dd578b8FF49100a0900442fa979582faF252'
const msAddress = '0x5aFdb1f4FaFBbE5AF3B9F286C93BDcc6F2859aD1' 
const rpAddress = '0x92cDAA4AC43Ce0f9D039b9955F49059774F72add'
const landAddress = '0x24A074c8558013A3E9EAbf5Ef742BE389BC013c9'
const minisAddress = '0x94b239302BD13E9B3958Cd7E7Ff51791e8BBe99e'

const Addresses = {tokenAddress, minisAddress, rpAddress, landAddress, msAddress}
const ABIs = {tokenABI, minisABI, rpABI, landABI, msABI} 

export {Addresses, ABIs}

//Optimize the minis contract, make sure it works.