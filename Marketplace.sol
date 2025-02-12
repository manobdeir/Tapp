// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        uint price;
        address payable seller;
        address buyer;
        bool isPurchased;
    }

    uint public productCount = 0;
    mapping(uint => Product) public products;

    event ProductListed(uint id, string name, uint price, address seller);
    event ProductPurchased(uint id, address buyer);

    function listProduct(string memory _name, uint _price) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _price, payable(msg.sender), address(0), false);
        emit ProductListed(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint _id) public payable {
        Product storage product = products[_id];
        require(product.id > 0 && product.id <= productCount, "Product does not exist.");
        require(!product.isPurchased, "Product already purchased.");
        require(msg.value >= product.price, "Insufficient funds.");

        product.buyer = msg.sender;
        product.isPurchased = true;
        product.seller.transfer(msg.value);
        emit ProductPurchased(_id, msg.sender);
    }
}

