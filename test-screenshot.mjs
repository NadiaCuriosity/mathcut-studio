import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch({ headless: true });

// Desktop
const desktop = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 1,
});
await desktop.goto("http://localhost:5174");
await desktop.evaluate(() => localStorage.clear());
await desktop.reload();
await desktop.waitForLoadState("networkidle");
await desktop.waitForTimeout(1500);

// Desktop ×10 (Surprise Me picks this)
await desktop.click('button:has-text("Surprise Me")');
await desktop.waitForTimeout(4500);
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: "screenshots/desktop-10x.png" });
console.log("Desktop: 10x");

// Wrap, back, ×12
await desktop.click('button:has-text("WRAP")');
await desktop.waitForTimeout(1500);
await desktop.click('button:has-text("BACK TO STUDIO")');
await desktop.waitForTimeout(1000);
await desktop.click('button:has-text("×12")');
await desktop.waitForTimeout(4500);
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: "screenshots/desktop-12x.png" });
console.log("Desktop: 12x");

// Wrap, back, ×3 (small array)
await desktop.click('button:has-text("WRAP")');
await desktop.waitForTimeout(1500);
await desktop.click('button:has-text("BACK TO STUDIO")');
await desktop.waitForTimeout(1000);
await desktop.click('button:has-text("×3")');
await desktop.waitForTimeout(4500);
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: "screenshots/desktop-3x.png" });
console.log("Desktop: 3x");

// Mobile
const mobile = await browser.newPage({
  viewport: { width: 414, height: 896 },
  deviceScaleFactor: 2,
});
await mobile.goto("http://localhost:5174");
await mobile.evaluate(() => localStorage.clear());
await mobile.reload();
await mobile.waitForLoadState("networkidle");
await mobile.waitForTimeout(1500);

await mobile.click('button:has-text("×12")');
await mobile.waitForTimeout(4500);
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "screenshots/mobile-12x.png" });
console.log("Mobile: 12x");

// Wrap, back, ×3
await mobile.click('button:has-text("WRAP")');
await mobile.waitForTimeout(1500);
await mobile.click('button:has-text("BACK TO STUDIO")');
await mobile.waitForTimeout(1000);
await mobile.click('button:has-text("×3")');
await mobile.waitForTimeout(4500);
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: "screenshots/mobile-3x.png" });
console.log("Mobile: 3x");

await browser.close();
console.log("All screenshots saved");
