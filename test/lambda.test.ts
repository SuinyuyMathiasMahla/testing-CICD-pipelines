import { lambdaHandler as createWeather } from "../src/createWeather";
//import { lambdaHandler as getWeather } from "../src/getWeather";
//import { lambdaHandler as deleteWeather } from "../src/deleteWeather";
//import { lambdaHandler as updateWeather } from "../src/updateWeather";
import { lambdaHandler as listWeathers } from "../src/listWeathers";

test("create weather", async () => {
  const result = await createWeather({
    body: JSON.stringify({
      weather: "hot",
      town: "Douala",
    }),
  });
  
  expect(result).toMatchObject({
    body: expect.any(String),
    statusCode: expect.any(Number),
  });
});

describe("listWeathers", () => {
  it("returns a valid response", async () => {
    const result = await listWeathers({});

    expect(result).toMatchObject({
      body: expect.any(String),
      statusCode: expect.any(Number),
    });
  });
});
