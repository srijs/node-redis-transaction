import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(sinonChai);

import {ReadKeyConst, ReadStringConst, ReadListConst} from '../ops';
import {Val, StringGetVal, ListLengthVal} from './values';

describe('Val', () => {

  it('passes through existence status from backend', async () => {
    const backend = new ReadKeyConst();
    const val = new Val(backend);
    const spy = sinon.spy(backend, 'exists');
    await chai.expect(val.exists()).to.eventually.be.equal(true);
    chai.expect(spy).to.be.called;
  });

  it('is non-existent after delete', async () => {
    const backend = new ReadKeyConst();
    const val = new Val(backend);
    await val.delete();
    await chai.expect(val.exists()).to.eventually.be.equal(false);
  });

});

describe('StringGetVal', () => {

  it('passes through existence status from backend', async () => {
    const backend = new ReadStringConst('foo');
    const val = new StringGetVal(backend);
    const spy = sinon.spy(backend, 'exists');
    await chai.expect(val.exists()).to.eventually.be.equal(true);
    chai.expect(spy).to.be.called;
  });

  it('passes through value from backend', async () => {
    const backend = new ReadStringConst('foo');
    const val = new StringGetVal(backend);
    const spy = sinon.spy(backend, 'get');
    await chai.expect(val.get()).to.eventually.be.equal('foo');
    chai.expect(spy).to.be.called;
  });

  it('is non-existent after delete', async () => {
    const backend = new ReadStringConst('foo');
    const val = new StringGetVal(backend);
    await val.delete();
    await chai.expect(val.exists()).to.eventually.be.equal(false);
  });

  it('overwrites value when set', async () => {
    const backend = new ReadStringConst('foo');
    const val = new StringGetVal(backend);
    await val.set('bar');
    await chai.expect(val.get()).to.eventually.be.equal('bar');
  });

});

describe('ListLengthVal', () => {

  it('passes through existence status from backend', async () => {
    const backend = new ReadListConst(['foo', 'bar']);
    const val = new ListLengthVal(backend);
    const spy = sinon.spy(backend, 'exists');
    await chai.expect(val.exists()).to.eventually.be.equal(true);
    chai.expect(spy).to.be.called;
  });

  it('passes through length from backend', async () => {
    const backend = new ReadListConst(['foo', 'bar']);
    const val = new ListLengthVal(backend);
    const spy = sinon.spy(backend, 'length');
    await chai.expect(val.length()).to.eventually.be.equal(2);
    chai.expect(spy).to.be.called;
  });

  it('is non-existent after delete', async () => {
    const backend = new ReadListConst(['foo', 'bar']);
    const val = new ListLengthVal(backend);
    await val.delete();
    await chai.expect(val.exists()).to.eventually.be.equal(false);
  });

  it('increases length when appended', async () => {
    const backend = new ReadListConst(['foo', 'bar']);
    const val = new ListLengthVal(backend);
    await val.append(['baz']);
    await chai.expect(val.length()).to.eventually.be.equal(3);
  });

});
