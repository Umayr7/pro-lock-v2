const { expect, assert } = require("chai");

describe("RealEstate contract", function () {
    let RealEstate, realEstate, owner, seller, buyer;

    beforeEach(async () => {
        RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        [owner, seller, buyer, _] = await ethers.getSigners();
    });

    describe('Deployment', () => {
        it("Should set the right owner", async () => {
            expect(await realEstate.owner()).to.equal(owner.address);
        });
    });
    
    describe('Properties', () => {
        it('create property', async () => {
            await realEstate.connect(seller).addProperty('ipfs test URI', 1);
            let propertyCount = await realEstate.propertyCount();
            let property = await realEstate.properties(propertyCount);

            // SUCCESS
            assert.equal(propertyCount, 1);

            assert.equal(property.tokenId, 1, 'price is correct');
            assert.equal(property.price, '1', 'price is correct');
            assert.equal(property.owner, seller.address, 'owner is correct');
            assert.equal(property.isAvailable, false, 'availability is correct');
        });

        it('lists properties', async () => {
            await realEstate.connect(seller).addProperty('ipfs test URI', 1);
            let propertyCount = await realEstate.propertyCount();
            let property = await realEstate.properties(propertyCount);

            assert.equal(property.tokenId.toNumber(), propertyCount, 'tokeId is correct');
            assert.equal(property.price, '1', 'price is correct');
            assert.equal(property.owner, seller.address, 'owner is correct');
            assert.equal(property.isAvailable, false, 'availability is correct');
        });
    });
});