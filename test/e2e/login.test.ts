import { test, expect } from "@playwright/test"
import { CODE_SERVER_ADDRESS, PASSWORD } from "../utils/constants"

test.describe("login", () => {
  // Reset the browser so no cookies are persisted
  // by emptying the storageState
  const options = {
    contextOptions: {
      storageState: {},
    },
  }

  test("should see the login page", options, async ({ page }) => {
    await page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // It should send us to the login page
    expect(await page.title()).toBe("code-server login")
  })

  test("should be able to login", options, async ({ page }) => {
    await page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // Type in password
    await page.fill(".password", PASSWORD)
    // Click the submit button and login
    await page.click(".submit")
    await page.waitForLoadState("networkidle")
    // Make sure the editor actually loaded
    expect(await page.isVisible("div.monaco-workbench"))
  })

  test("should see an error message for missing password", options, async ({ page }) => {
    await page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // Skip entering password
    // Click the submit button and login
    await page.click(".submit")
    await page.waitForLoadState("networkidle")
    expect(await page.isVisible("text=Missing password"))
  })

  test("should see an error message for incorrect password", options, async ({ page }) => {
    await page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // Type in password
    await page.fill(".password", "password123")
    // Click the submit button and login
    await page.click(".submit")
    await page.waitForLoadState("networkidle")
    expect(await page.isVisible("text=Incorrect password"))
  })
})
