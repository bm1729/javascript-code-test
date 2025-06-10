import { upperCase } from "./foo";

describe("foo", () => {
  it("should return true", () => {
    expect(true).toBe(true);
  });

  it("should return false", () => {
    expect(false).toBe(false);
  });

  it("uppercases a string", () => {
    expect(upperCase("hello world")).toBe("HELLO WORLD");
  });
});
