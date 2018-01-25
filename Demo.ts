import {createFastifyApp, createGQLSchema} from "./test/TestUtils";

createFastifyApp(createGQLSchema()).listen(3000, (err) => {
  if (err) console.error(err);
});