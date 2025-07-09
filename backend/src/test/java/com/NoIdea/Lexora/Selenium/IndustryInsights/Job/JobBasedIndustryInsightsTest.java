package com.NoIdea.Lexora.Selenium.IndustryInsights.Job;

import io.github.bonigarcia.wdm.WebDriverManager;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class JobBasedIndustryInsightsTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private Path tempProfileDir;

    @BeforeEach
    public void setUp() throws IOException {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();

        // Create a unique temp directory for the user data dir
        tempProfileDir = Files.createTempDirectory("chrome-profile-" + UUID.randomUUID());
        options.addArguments("--user-data-dir=" + tempProfileDir.toAbsolutePath());

        driver = new ChromeDriver(options);

        wait = new WebDriverWait(driver, Duration.ofSeconds(60));
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(60));
        driver.get("http://localhost:5173/Lexora/");
    }

    @AfterEach
    public void tearDown() throws IOException {
        if (driver != null) {
            driver.quit();
        }
        // Optional cleanup
        FileUtils.deleteDirectory(tempProfileDir.toFile());
    }

    private void waitAndClick(By locator) {
        WebElement element = wait.until(ExpectedConditions.elementToBeClickable(locator));
        element.click();
    }

    private void waitAndSendKeys(By locator, String value) {
        WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(locator));
        element.clear();
        element.sendKeys(value);
    }

    private void waitForChartToLoad() {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("showTrends")));
    }

    private void loginToApplication() {
        waitAndClick(By.id("singInButton"));
        waitAndSendKeys(By.name("signinemail"), "anjalisewmini5@gmail.com");
        waitAndSendKeys(By.name("signinpassword"), "12345678");
        waitAndClick(By.id("loginButton"));
    }

    @Test
    @DisplayName("Job Based Industry Insights Workflow Test")
    public void testJobBasedIndustryInsights() {

        // Step 1: Login
        loginToApplication();

        // Step 2: Navigate to Job Trends
        waitAndClick(By.id("Industry Insights"));
        waitAndClick(By.id("JobTrends"));

        // Step 3: Select Country
        waitAndClick(By.id("Country"));
        waitAndSendKeys(By.id("SearchCountries"), "United States");
        waitAndClick(By.id("United States"));
        waitForChartToLoad();

        // Step 4: Date Filters
        waitAndClick(By.id("DateTime"));
        waitAndClick(By.id("year"));
        waitAndClick(By.id("year")); // clicked twice in original
        waitAndClick(By.id("week"));
        waitAndClick(By.id("ApplyDateTime"));
        waitForChartToLoad();

        // Step 5: View Charts
        waitAndClick(By.id("pie"));
        waitForChartToLoad();

        waitAndClick(By.id("line"));
        waitForChartToLoad();

        waitAndClick(By.id("radar"));
        waitForChartToLoad();

        waitAndClick(By.id("salary"));
        waitForChartToLoad();

        // Step 6: Select Job Categories
        waitAndClick(By.id("Software Development"));
        waitAndClick(By.id("Web Development"));
        waitForChartToLoad();

        // Step 7: Final Assertion
        assertTrue(driver.getTitle().toLowerCase().contains("lexora") || driver.getCurrentUrl().contains("Lexora"),
                "User should remain on Lexora page after all interactions.");
    }
}
