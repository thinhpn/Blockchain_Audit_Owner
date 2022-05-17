const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access Control", () => {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();
    const MyPets= await ethers.getContractFactory("MyPets", deployer);
    this.myPets = await MyPets.deploy("Lu");
  });
  describe("My Pets", () => {
    it("Should set dog name at deployment", async function () {
      expect(await this.myPets.MyDog()).to.eq("Lu");
    });

    it("Only owner can change my dog name", async function () {
      await this.myPets.connect(deployer).updateDog("kiki");
      expect(await this.myPets.MyDog()).to.eq("kiki");
    });

    it("Change owner", async function () {
      await this.myPets.transferOwnership(user.address);      
      expect(await this.myPets.owner()).to.eq(user.address);
    });

    it("Cannot change my dog name if not owner", async function () {      
      await expect(this.myPets.connect(attacker).updateDog("Abe")).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
})