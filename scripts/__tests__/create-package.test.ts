import { describe, test, expect } from "bun:test";

describe("package name validation", () => {
  function validateCamelCase(name: string): boolean {
    return /^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$/.test(name);
  }

  function convertToCamelCase(name: string): string {
    return name
      .split("-")
      .map((part, idx) =>
        idx === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join("");
  }

  test("validates valid camelCase names", () => {
    expect(validateCamelCase("myPackage")).toBe(true);
    expect(validateCamelCase("showcase")).toBe(true);
    expect(validateCamelCase("calculator")).toBe(true);
  });

  test("validates valid kebab-case names", () => {
    expect(validateCamelCase("my-package")).toBe(true);
    expect(validateCamelCase("new-package-test")).toBe(true);
    expect(validateCamelCase("app-test")).toBe(true);
  });

  test("rejects invalid names", () => {
    expect(validateCamelCase("My-Package")).toBe(false); // Starts with uppercase
    expect(validateCamelCase("my_package")).toBe(false); // Uses underscore
    expect(validateCamelCase("my package")).toBe(false); // Has space
    expect(validateCamelCase("123-package")).toBe(false); // Starts with number
    expect(validateCamelCase("")).toBe(false); // Empty
  });

  test("converts kebab-case to camelCase", () => {
    expect(convertToCamelCase("my-package")).toBe("myPackage");
    expect(convertToCamelCase("new-test-package")).toBe("newTestPackage");
    expect(convertToCamelCase("showcase")).toBe("showcase");
  });

  test("keeps valid camelCase as-is", () => {
    expect(convertToCamelCase("myPackage")).toBe("myPackage");
    expect(convertToCamelCase("calculator")).toBe("calculator");
  });
});

describe("subdomain validation", () => {
  function validateSubdomain(subdomain: string): boolean {
    return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain);
  }

  test("validates valid subdomains", () => {
    expect(validateSubdomain("showcase")).toBe(true);
    expect(validateSubdomain("my-app")).toBe(true);
    expect(validateSubdomain("app123")).toBe(true);
    expect(validateSubdomain("a")).toBe(true);
    expect(validateSubdomain("a1")).toBe(true);
  });

  test("rejects invalid subdomains", () => {
    expect(validateSubdomain("My-App")).toBe(false); // Has uppercase
    expect(validateSubdomain("-app")).toBe(false); // Starts with hyphen
    expect(validateSubdomain("app-")).toBe(false); // Ends with hyphen
    expect(validateSubdomain("my_app")).toBe(false); // Has underscore
    expect(validateSubdomain("my app")).toBe(false); // Has space
    expect(validateSubdomain("")).toBe(false); // Empty
  });

  test("validates subdomains with max length", () => {
    const maxLength = "a".repeat(63);
    expect(validateSubdomain(maxLength)).toBe(true);

    const tooLong = "a".repeat(64);
    expect(validateSubdomain(tooLong)).toBe(false);
  });
});
