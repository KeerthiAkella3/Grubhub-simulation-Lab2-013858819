var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('assert');
var expect = chai.expect;
var testInput_name = "Mocha";
var testInput_email = "mocha.testemail@gmail.com";
var testInput_password = "test";


   // Buyer sign In
    it("Test Case 1 - Buyer Sign in post method.", (done) => {
        chai.request('http://localhost:3001')
        .post(`/buyerLogin`)
        .send({emailId: "buyer@gmail.com",password : "1234"})
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);
            expect(res.user.validUser).to.equal(true);
        done();
        });
    })

    
    it("Test Case 2 - Restaurent Owner Signin in post method.", (done) => {
        chai.request('http://localhost:3001')
        .post(`/ownerSignIn`)
        .send({emailId: "admin",password : "admin"})
        .end((err, res) => {
            expect(err).to.be.null;
            res.body.should.be.a('object');
            res.status.should.be.equal(200);
            expect(res.body.validUser).to.equal(true);
        done();
        });
    })

    it("Test Case 3 - Buryer update post method.", (done) => {
        chai.request('http://localhost:3001')
        .post(`/updateProfile`)
        .send({buyerName: 'Kee', Address: '245 W, CA', phoneNumber: '123',
         table: "buyerTable", emailId: "admin",id : "41"})
        .end((err, res) => {
            expect(err).to.be.null;
           // res.body.should.be.a('object');
            res.status.should.be.equal(200);
            expect(res.body).to.equal(true);
        done();
        });
    })

    it("Test Case 4 - Owner update post method.", (done) => {
        chai.request('http://localhost:3001')
        .post(`/updateOwner`)
        .send({ownerName: 'Kee', Address: '245 W, CA', phoneNumber: '123', 
        restaurentName: "Dusita", cuisine: "Thai",
         table: "ownerTable", emailId: "admin",id : "6"})
        .end((err, res) => {
            expect(err).to.be.null;
           // res.body.should.be.a('object');
            res.status.should.be.equal(200);
            expect(res.body).to.equal(true);
        done();
        });
    })

    it("Test Case 5 - Buyer Sign up post method.", (done) => {
        chai.request('http://localhost:3001')
        .post(`/buyerSignUp`)
        .send({buyerName: "John",
        emailId: "faa@gmail.com",
        password: "john",
        phoneNumber: "123",
        Address: "SJSU, CA"})
        .end((err, res) => {
            expect(err).to.be.null;
            //res.body.should.be.a('object');
            res.status.should.be.equal(200);
            //response.data.responseMessage === "Successfully Added!"
            expect(res.body.signedUp).to.equal(true);
        done();
        });
    })

