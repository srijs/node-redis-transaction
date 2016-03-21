import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

chai.use(chaiAsPromised);
chai.use(sinonChai);

import {Fact} from './fact';

describe('Fact', () => {

  it('calls the loader when not yet loaded', async () => {
    const loader = sinon.stub().returns(Promise.resolve(42));
    const fact = new Fact(loader);
    await chai.expect(fact.get()).to.eventually.be.equal(42);
    chai.expect(loader).to.be.called;
  });

  it('does not call the loader after a set', async () => {
    const loader = sinon.stub().returns(Promise.resolve(42));
    const fact = new Fact(loader);
    fact.set(42);
    await chai.expect(fact.get()).to.eventually.be.equal(42);
    chai.expect(loader).to.be.not.called;
  });

});
