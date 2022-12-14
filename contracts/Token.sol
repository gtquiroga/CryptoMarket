// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public freeTokensClaimed;

    event Transfer(
        address indexed from,
        address indexed to, 
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender, 
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = 1000 * (10**decimals);
        balanceOf[address(this)] = totalSupply - balanceOf[msg.sender];
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        balanceOf[_from] = balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;

        emit Transfer(_from, _to, _value);

    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));

        _transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool succes){
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public  returns(bool succes){
        require(_value <= balanceOf[_from], 'insufficient balance');
        require(_value <= allowance[_from][msg.sender], 'insufficient allowance');

        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        _transfer(_from, _to, _value);

        return true;
    }

    function freeTokens() public returns(bool succes){
        require(freeTokensClaimed[msg.sender] == false, 'had already claimed free tokens');
        require(balanceOf[address(this)] >= 100, 'No mmore free tokens left');

        _transfer(address(this), msg.sender, 100 * (10**decimals));

        freeTokensClaimed[msg.sender] = true;

        return true;
    }
}