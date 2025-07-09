package com.NoIdea.Lexora.Selenium.IndustryInsights.Skill;

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

public class SkillBasedIndustryInsightsTest {

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

    private void loginToApplication() {
        waitAndClick(By.id("singInButton"));
        waitAndSendKeys(By.name("signinemail"), "anjalisewmini5@gmail.com");
        waitAndSendKeys(By.name("signinpassword"), "12345678");
        waitAndClick(By.id("loginButton"));
    }

    // Wait untill all is appeard
    private void waitForChartToLoad() {
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("showTrends")));
    }

    @Test
    @DisplayName("Industry Insights Workflow Test")
    public void testSkillBasedIndustryInsights() {
        // Step 1: Login
        loginToApplication();

        // Step 2: Navigate to Skill Trends
        waitAndClick(By.id("Industry Insights"));
        waitAndClick(By.id("SkillTrends"));

        // Step 3: Show Pie Chart
        waitForChartToLoad();
        waitAndClick(By.id("pie"));
        waitAndClick(By.id("line"));
        waitAndClick(By.id("radar"));
        waitAndClick(By.id("salary"));
        // chart element

        // Step 4: Select Country
        waitAndClick(By.id("Country"));
        waitAndSendKeys(By.id("SearchCountries"), "United States");
        waitAndClick(By.id("United States"));

        // Step 5: Date Filters
        waitAndClick(By.id("DateTime"));
        waitAndClick(By.id("year"));
        waitAndClick(By.id("week"));
        waitAndClick(By.id("ApplyDateTime"));

        // Step 6: View Charts
        waitAndClick(By.id("line"));
        waitAndClick(By.id("radar"));
        waitAndClick(By.id("salary"));

        // Step 7: Job Category Selections
        waitAndClick(By.id("Software Development"));
        waitAndClick(By.id("Web Development"));

        // Step 8: Verify Page Still Active
        assertTrue(driver.getTitle().toLowerCase().contains("lexora") || driver.getCurrentUrl().contains("Lexora"),
                "User should remain in Lexora site after charts are viewed.");
    }
}
