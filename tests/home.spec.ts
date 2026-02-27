import { test, expect } from "@playwright/test";

test("Home page", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  //validate sign in
  await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  //check title
  await expect(page).toHaveTitle("Practice Software Testing - Toolshop - v5.0");
  //check the count of items
  const ProductGrid = page.locator(".col-md-9");
  // const ProductGrid = page.locator("container");
  await expect(ProductGrid.getByRole("link")).toHaveCount(9);
  expect(await ProductGrid.getByRole("link").count()).toBe(9);
  //SEarch for Thor Hammer
  await page.locator('[data-test="search-query"]').fill("Thor Hammer");
  await page.locator('[data-test="search-submit"]').click();

  await expect(page.locator('[data-test="search-caption"]')).toContainText(
    "Thor Hammer",
  );
  await expect(page.getByTestId("search-caption")).toContainText("Thor Hammer");

  //  //await expect(page.locator('[data-test="product-name"]')).toContainText(
  //    "Thor Hammer",
  //  );
  await expect(page.getByTestId("product-name")).toContainText("Thor Hammer");
});
