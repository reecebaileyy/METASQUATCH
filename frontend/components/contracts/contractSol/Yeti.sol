// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract Yeti is ERC721A, Ownable {
  
    uint256 _maxSupply = 300;
    uint256 maxMintAmountPerTx = 2;
    uint256 maxMintAmountPerWallet = 2;

    string baseURL = "";
    string ExtensionURL = ".json";
    string HiddenURL;

    bool whitelistFeature = false;
    bytes32 hashRoot;

    bool paused = false;
    bool revealed = false;

    uint256 public constant squatchNeeded = 2;
    uint256 public constant landNeeded = 1;

    address public metasquatchAddress;
    address public landAddress;
    address public rewardPool;

    uint public constant _mintAmount = 1; 


    //          string memory hidden, string memory base, bytes32 hashroot   <= For constructor
    constructor(string memory _name, string memory _ticker, address _MSAddress, address _landAddress, address _rewardPoolAddress) ERC721A(_name, _ticker) {
        metasquatchAddress = _MSAddress;
        landAddress = _landAddress;
        rewardPool = _rewardPoolAddress;
    }

    // ================= Mint Function =======================

    // function Mint()public payable{
    //     require(!paused, "The contract is paused!");
    //     require(totalSupply() + _mintAmount <= _maxSupply, "Max supply exceeded!");


    //     if (_msgSender() != owner()) {
    //             require(hasParents(_msgSender()), "Need more Metasquatchs/Land");
    //             IMetasquatch(metasquatchAddress).transferFrom(_msgSender(), address(this), 
    //             IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender())[IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender()).length - 1]);
    //     }

    //         if(IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) >= 4){
            
    //         require(totalSupply() + IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) / 2 <= _maxSupply, "Max supply exceeded!");
            
    //         for(uint i = 0; i < IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) / 2; i++){
    //             require(IRewardPool(rewardPool).addNodeInfo(totalSupply() + _mintAmount, _msgSender()), "Can't update rewardpool data");
    //         }
    //         _safeMint(_msgSender(), IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) / 2);
    //         }else{
    //         _safeMint(_msgSender(), _mintAmount);
    //         }
    // }

    function mint() public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(balanceOf(msg.sender) < 10, "You have 10 Yetis.");

    if (_msgSender() != owner()) {
      require(hasParents(_msgSender()), "Need more Metasquatchs/Land");
      if(IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) >= 4){
      for(uint i = 1; i < IMetasquatch(metasquatchAddress).balanceOf(_msgSender()) / 2; i++){
        require(totalSupply() + _mintAmount <= _maxSupply, "Max supply exceeded!");
        _safeMint(_msgSender(), totalSupply() + _mintAmount);
        require(IRewardPool(rewardPool).addNodeInfo(totalSupply() + _mintAmount, _msgSender()), "Can't update rewardpool data");
      }
    }else{
      _safeMint(_msgSender(), supply + _mintAmount);
    }

        IMetasquatch(metasquatchAddress).approve(address(this), IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender())[IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender()).length - 1]);
        IMetasquatch(metasquatchAddress).transferFrom(_msgSender(), address(this), 
            IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender())[IMetasquatch(metasquatchAddress).walletOfOwner(_msgSender()).length - 1]);
    }
  }

    // =================== Orange Functions (Owner Only) ===============

    function pause(bool state) public onlyOwner {
        paused = state;
    }

    function safeMint(address to, uint256 quantity) public onlyOwner {
        _safeMint(to, quantity);
    }

    function setHiddenURL(string memory uri) public onlyOwner {
        HiddenURL = uri;
    }

    function setbaseURL(string memory uri) public onlyOwner{
        baseURL = uri;
    }

    function setExtensionURL(string memory uri) public onlyOwner{
        ExtensionURL = uri;
    }

        function setRewardPool(address _rewardPool) public onlyOwner{
            rewardPool = _rewardPool;
    }
    
    function setLandAddress(address _landAddress) public onlyOwner{
            landAddress = _landAddress;
    }
    
    function setMSAddress(address _metasquatch) public onlyOwner{
            metasquatchAddress = _metasquatch;
    }  

    // ================================ Withdraw Function ====================

    function withdraw() public onlyOwner {
        uint256 CurrentContractBalance = address(this).balance;

        (bool os, ) = payable(owner()).call{value: CurrentContractBalance}("");
        require(os);

    }

    // =================== Blue Functions (View Only) ====================

    function tokenURI(uint256 tokenId) public view override(ERC721A) returns (string memory){
        require(_exists(tokenId),"ERC721Metadata: URI query for nonexistent token");

    if (revealed == false) {
      return HiddenURL;
    }

        return super.tokenURI(tokenId);
    }

    function checkWhitelist() public view returns (bool){
        return whitelistFeature;
    }


    function _baseURI() internal view virtual override returns (string memory) {
    return baseURL;
    }


    function maxSupply() public view returns (uint256){
        return _maxSupply;
    }

    function canMint(address _address) public view returns(bool){
        return hasParents(_msgSender() != address(0)? _msgSender() :_address) && !paused ? true : false;
    }
    
    // ================ Internal Functions ===================
    function hasParents(address sender) public view returns(bool){
        return ILand(landAddress).balanceOf(sender) >= landNeeded && IMetasquatch(metasquatchAddress).balanceOf(sender) >= squatchNeeded ? true : false;
    }
}

interface ILand {
    function balanceOf(address sender) external view returns(uint);
}


interface IMetasquatch {
    function approve(address to, uint256 tokenId) external;
    function balanceOf(address sender) external view returns(uint);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) external;
    function walletOfOwner(address _owner) external view returns(uint256[] memory);
}

interface IRewardPool {
    function addNodeInfo(uint _nftId, address _owner) external returns (bool);
    function updateNodeOwner(uint _nftId, address _owner) external returns (bool);
    function claimReward(uint _nftId) external returns (bool);
}
