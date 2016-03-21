import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(sinonChai);

import {Key} from '../key';
import {Kind} from '../kind';
import {WriteStringNoop, WriteListNoop} from '../ops';
import {StringWriteBackend, ListWriteBackend} from './write';

describe('StringWriteBackend', () => {

  describe('#withKey', () => {

    it('exposes backend if key is correct', () => {
      const k = new Key('foo', Kind.String);
      const n = new WriteStringNoop();
      const b = new StringWriteBackend(k, n);
      chai.expect(b.withKey(k)).to.be.equal(n);
    });

    it('exposes noop if key is incorrect', () => {
      const k = new Key('foo', Kind.String);
      const i = new Key('foo', Kind.List);
      const n = new WriteStringNoop();
      const b = new StringWriteBackend(k, n);
      chai.expect(b.withKey(i)).to.not.be.equal(n);
    });

  });

  describe('#withStringAt', () => {

    it('exposes backend if key is correct', () => {
      const k = new Key('foo', Kind.String);
      const n = new WriteStringNoop();
      const b = new StringWriteBackend(k, n);
      chai.expect(b.withStringAt(k)).to.be.equal(n);
    });

    it('exposes noop if key is incorrect', () => {
      const k = new Key('foo', Kind.String);
      const i = new Key('foo', Kind.List);
      const n = new WriteStringNoop();
      const b = new StringWriteBackend(k, n);
      chai.expect(b.withStringAt(i)).to.not.be.equal(n);
    });

  });

});

describe('ListWriteBackend', () => {

  describe('#withKey', () => {

    it('exposes backend if key is correct', () => {
      const k = new Key('foo', Kind.String);
      const n = new WriteListNoop();
      const b = new ListWriteBackend(k, n);
      chai.expect(b.withKey(k)).to.be.equal(n);
    });

    it('exposes noop if key is incorrect', () => {
      const k = new Key('foo', Kind.List);
      const i = new Key('foo', Kind.String);
      const n = new WriteListNoop();
      const b = new ListWriteBackend(k, n);
      chai.expect(b.withKey(i)).to.not.be.equal(n);
    });

  });

  describe('#withListAt', () => {

    it('exposes backend if key is correct', () => {
      const k = new Key('foo', Kind.String);
      const n = new WriteListNoop();
      const b = new ListWriteBackend(k, n);
      chai.expect(b.withListAt(k)).to.be.equal(n);
    });

    it('exposes noop if key is incorrect', () => {
      const k = new Key('foo', Kind.List);
      const i = new Key('foo', Kind.String);
      const n = new WriteListNoop();
      const b = new ListWriteBackend(k, n);
      chai.expect(b.withListAt(i)).to.not.be.equal(n);
    });

  });

});
