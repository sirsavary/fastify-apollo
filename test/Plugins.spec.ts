import 'mocha';
import * as Chai from 'chai';
import {expect} from 'chai';
import * as ChaiGraphQL from 'chai-graphql';
import {createFastifyApp, createGQLSchema} from "./TestUtils";

Chai.use(ChaiGraphQL);

describe("GraphQL Plugin", () => {
  it("should return a valid response to a valid query", async () => {
    const app = createFastifyApp(createGQLSchema());
    
    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `{
          hello
        }`
      }
    });
    
    expect(JSON.parse(res.payload)).to.be.graphQL({hello: 'world'});
    expect(res.statusCode).to.equal(200);
  });

  it("should throw an error when given an invalid query", async () => {
    const app = createFastifyApp(createGQLSchema());

    const res = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: {
        query: `{
          invalid
        }`
      }
    });

    expect(JSON.parse(res.payload)).to.be.graphQLError();
    expect(res.statusCode).to.equal(400);
  });
});

describe("GraphiQL Plugin", () => {
  it("should not 404 on the /graphiql route", async () => {
    const app = createFastifyApp(createGQLSchema());

    const res = await app.inject({
      method: 'GET',
      url: '/graphiql',
    });

    expect(res.statusCode).to.equal(200);
  });
  
  //TODO write a test that verifies GraphiQL was served correctly and can make requests
});