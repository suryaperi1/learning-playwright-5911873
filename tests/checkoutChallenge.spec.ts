import { test, expect } from "@playwright/test";

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("product checkout", async ({ page }) => {
    //click on the first product product-name as  Combination Pliers
    await page.getByRole("link", { name: "Combination Pliers" }).click();
    //validate the product details page is loaded with the correct product name
    await expect(page.getByTestId("product-name")).toHaveText(
      "Combination Pliers",
    );
    //click on the add to cart button
    await page.getByTestId("add-to-cart").click();
    //click on the cart link in the nav bar
    await page.getByTestId("nav-cart").click();
    //await page.getByRole("link", { name: "Cart" }).click();
    //validate the cart page is loaded with the correct product name and quantity
    await expect(page.getByTestId("product-title")).toHaveText(
      "Combination Pliers",
    );
    await expect(page.getByTestId("product-quantity")).toHaveValue("1");
    //click on the proceed to checkout button
    await page.getByTestId("proceed-1").click();

    //wait for the message that the user is already signed in and click on the continue button
    await page.getByTestId("proceed-2").click();

    //Enter billing information and click on the continue button
    await page.getByTestId("state").fill("TX");
    await page.getByTestId("postal_code").fill("12345");
    await page.getByTestId("proceed-3").click();

    //Select the payment as Buy Now Pay Later and click on the Confirm button
    await page.getByTestId("payment-method").selectOption("Buy Now Pay Later");
    await page.getByTestId("monthly_installments").selectOption("3");

    await page.getByTestId("finish").click();
    await expect(page.getByTestId("payment-success-message")).toContainText(
      "Payment was successful",
    );
    await page.getByTestId("finish").click();
    await expect(page.getByText("Thanks for your order! Your")).toBeVisible();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("Order-confirmation.png", {
      mask: [page.getByTitle("Practice Software Testing - Toolshop")],
    });
  });
});

test.describe("Api challenge", () => {
  test("GET /products/search", async ({ request }) => {
    const apiUrl = "https://api.practicesoftwaretesting.com";
    const response = await request.get(
      apiUrl + "/products/search?q=thor%20hammer",
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    const product_id = body.data[0].id;
    const prod_response = await request.get(apiUrl + "/products/" + product_id);
    expect(prod_response.status()).toBe(200);
    const prod_body = await prod_response.json();
    expect(prod_body.name).toBe("Thor Hammer");
    expect(prod_body.stock).toBe(25);
  });
});
