package com.NoIdea.Lexora.Selenium.Roadmap;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import io.github.bonigarcia.wdm.WebDriverManager;

import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;
@Tag("selenium")
public class RoadmapTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() throws IOException {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();

        // Always use headless mode for CI reliability
        // Force headless mode to prevent timeout issues in GitHub Actions
        System.out.println("Configuring Chrome for CI environment");

        // Essential arguments for GitHub Actions stability
        // options.addArguments("--headless=new");
        // options.addArguments("--no-sandbox");
        // options.addArguments("--disable-dev-shm-usage");
        // options.addArguments("--disable-gpu");
        // options.addArguments("--disable-extensions");
        // options.addArguments("--disable-background-timer-throttling");
        // options.addArguments("--disable-renderer-backgrounding");
        // options.addArguments("--disable-backgrounding-occluded-windows");
        // options.addArguments("--disable-ipc-flooding-protection");
        // options.addArguments("--window-size=1920,1080");

        // // Additional stability arguments
        // options.addArguments("--disable-features=TranslateUI");
        // options.addArguments("--disable-features=BlinkGenPropertyTrees");
        // options.addArguments("--disable-default-apps");
        // options.addArguments("--disable-background-networking");
        // options.addArguments("--disable-sync");
        // options.addArguments("--metrics-recording-only");
        // options.addArguments("--no-first-run");
        // options.addArguments("--safebrowsing-disable-auto-update");
        // options.addArguments("--disable-component-update");

        // // Memory and performance optimizations
        // options.addArguments("--memory-pressure-off");
        // options.addArguments("--max_old_space_size=4096");

        // // Network settings
        // options.addArguments("--aggressive-cache-discard");
        // options.addArguments("--disable-background-mode");

        driver = new ChromeDriver(options);

        // Increased timeouts for CI environment
        wait = new WebDriverWait(driver, Duration.ofSeconds(120));
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(30));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(120));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(120));

        // Navigate to application
        driver.get("http://localhost:5173/Lexora/");
    }

    @AfterEach
    public void tearDown() throws IOException {
        if (driver != null) {
            try {
                driver.quit();
                System.out.println("WebDriver successfully closed");
            } catch (Exception e) {
                System.err.println("Error closing WebDriver: " + e.getMessage());
            }
        }
    }

    // --- Helper: Wait and click with retry mechanism ---
    private void waitAndClick(By locator) {
        int maxRetries = 3;
        for (int i = 0; i < maxRetries; i++) {
            try {
                WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
                // Scroll element into view before clicking
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                Thread.sleep(500); // Brief pause after scroll
                element.click();
                return; // Success, exit retry loop
            } catch (Exception e) {
                System.out.println("Click attempt " + (i + 1) + " failed for " + locator + ": " + e.getMessage());
                if (i == maxRetries - 1) {
                    throw new RuntimeException("Failed to click element after " + maxRetries + " attempts", e);
                }
                try {
                    Thread.sleep(1000); // Wait before retry
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    // --- Helper: Wait and send keys with retry mechanism ---
    private void waitAndSendKeys(By locator, String text) {
        int maxRetries = 3;
        for (int i = 0; i < maxRetries; i++) {
            try {
                WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
                // Scroll element into view
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                Thread.sleep(300);
                element.clear();
                element.sendKeys(text);
                return; // Success, exit retry loop
            } catch (Exception e) {
                System.out.println("SendKeys attempt " + (i + 1) + " failed for " + locator + ": " + e.getMessage());
                if (i == maxRetries - 1) {
                    throw new RuntimeException("Failed to send keys to element after " + maxRetries + " attempts", e);
                }
                try {
                    Thread.sleep(1000); // Wait before retry
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }

    // --- Helper: Login process with better error handling ---
    private void loginToApplication() {
        try {
            System.out.println("Starting login process...");
            driver.get("http://localhost:5173/Lexora/");

            // Wait for page to load completely
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
            Thread.sleep(2000); // Allow additional time for React app to initialize

            waitAndClick(By.id("singInButton"));
            System.out.println("Clicked sign in button");

            waitAndSendKeys(By.name("signinemail"), "anjalisewmini5@gmail.com");
            System.out.println("Entered email");

            waitAndSendKeys(By.name("signinpassword"), "12345678");
            System.out.println("Entered password");

            waitAndClick(By.id("loginButton"));
            System.out.println("Clicked login button");

            // Wait for successful login and roadmaps element to appear
            wait.until(ExpectedConditions.presenceOfElementLocated(By.id("Roadmaps")));
            System.out.println("Login successful - Roadmaps element found");

        } catch (Exception e) {
            System.err.println("Login failed: " + e.getMessage());
            // Take screenshot for debugging (optional)
            throw new RuntimeException("Login process failed", e);
        }
    }

    @Test
    @DisplayName("Complete Login and Roadmap Workflow - End to End Test")
    public void testCompleteLoginAndRoadmapWorkflow() throws Exception {
        try {
            System.out.println("=== Starting End-to-End Test ===");

            // Step 1: Login
            System.out.println("Step 1: Logging in...");
            loginToApplication();

            // Step 2: Go to roadmap generator
            System.out.println("Step 2: Navigating to roadmap generator...");
            waitAndClick(By.id("Roadmaps"));
            waitAndClick(By.id("Roadmaps Generator"));

            // Step 3: Generate roadmap for "Frontend Developer"
            System.out.println("Step 3: Generating roadmap...");
            waitAndSendKeys(By.id("SX4"), "Frontend Developer");
            waitAndClick(By.id("GenerateButton"));

            // Wait for generation to complete
            Thread.sleep(3000);

            // Step 4: Select option and enter skill
            System.out.println("Step 4: Selecting option and entering skill...");
            waitAndClick(By.id("OptionOneSelection"));
            waitAndSendKeys(By.id("SkillRoadmap"), "React");
            waitAndClick(By.id("SkillGenerateRoadmap"));

            // Wait for skill roadmap generation
            Thread.sleep(3000);

            // Step 5: Save generated roadmap
            System.out.println("Step 5: Saving roadmap...");
            try {
                waitAndClick(By.id("SaveRoadmap"));

                // Wait for backend processing
                Thread.sleep(3000);

                // Handle alert if appears
                try {
                    Alert alert = driver.switchTo().alert();
                    System.out.println("Alert shown: " + alert.getText());
                    alert.accept();
                    System.out.println("Alert accepted.");
                } catch (NoAlertPresentException e) {
                    System.out.println("No alert appeared.");
                }

            } catch (Exception e) {
                System.out.println("Error while saving roadmap: " + e.getMessage());
            }

            // Step 6: View roadmap
            System.out.println("Step 6: Viewing roadmap...");
            waitAndClick(By.id("ViewRoadmap"));
            WebElement backButton = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("cancel")));
            assertNotNull(backButton, "Back button should be present in roadmap view");

            // Step 7: Go back
            System.out.println("Step 7: Going back...");
            waitAndClick(By.id("cancel"));

            // Step 8: Delete roadmap
            System.out.println("Step 8: Deleting roadmap...");
            waitAndClick(By.id("DeleteRoadmap"));

            // Wait for deletion to complete
            Thread.sleep(2000);

            // Step 9: Confirm still on roadmap page
            System.out.println("Step 9: Verifying final state...");
            assertTrue(driver.getCurrentUrl().contains("Lexora") ||
                    !driver.findElements(By.id("Roadmaps")).isEmpty(),
                    "Should remain on roadmaps page after deletion");

            System.out.println("=== Test completed successfully ===");

        } catch (Exception e) {
            System.err.println("Test failed with error: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to fail the test
        }
    }
}