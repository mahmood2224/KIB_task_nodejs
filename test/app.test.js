const expect = require('chai').expect;
const fileHelper = require("../helpers/file_helper");
describe('file helper test', () => {
    it('should return 0', () => {
        expect(fileHelper.validateFile("./public/test_cases/test_case_0.csv").length).to.equal(0);
    });

    it('should return 1', () => {
        expect(fileHelper.validateFile("./public/test_cases/test_case_1.txt").length).to.equal(1);
    });

    it('should get object with brand' , ()=>{
        expect(fileHelper.getBrandOrders("ID2,Chicago,shoes,1,Air".split(","))).to.have.property("brand")
    })

    it('should get object with product ' , ()=>{
        expect(fileHelper.getBrandOrders("ID2,Chicago,shoes,1,Air".split(","))).to.have.property("product")
    })

    it('should get object with qty' , ()=>{
        expect(fileHelper.getProductQty("ID2,Chicago,shoes,1,Air".split(","))).to.have.property("qty")
    })

    it('should get object with product ' , ()=>{
        expect(fileHelper.getProductQty("ID2,Chicago,shoes,1,Air".split(","))).to.have.property("product")
    })


});