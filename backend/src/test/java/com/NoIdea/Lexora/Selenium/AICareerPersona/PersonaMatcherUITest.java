package com.NoIdea.Lexora.Selenium.AICareerPersona;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*; // JUnit 5
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*; // for assertTrue, assertEquals, etc.
@Tag("selenium")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PersonaMatcherUITest {

    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--incognito");
        options.addArguments("--disable-save-password-bubble");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-blink-features=AutomationControlled");

        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        options.setExperimentalOption("prefs", prefs);

// Optionally add: clean user profile
        options.addArguments("user-data-dir=/tmp/temporary-profile");
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.get("http://localhost:5173/Lexora/");
    }

    @Test
    @Order(1)
    @DisplayName("Login Page UI Test")
    public void testLoginPageUI() {
        WebElement signInButton = driver.findElement(By.id("singInButton"));
        assertTrue(signInButton.isDisplayed(), "Sign In button is not visible");

        signInButton.click();

        WebElement emailField = driver.findElement(By.name("signinemail"));
        assertTrue(emailField.isDisplayed(), "Email input is not visible");
        assertEquals("Enter email to get started", emailField.getAttribute("placeholder"));

        WebElement passwordField = driver.findElement(By.name("signinpassword"));
        assertTrue(passwordField.isDisplayed(), "Password input is not visible");
        assertEquals("Enter your password", passwordField.getAttribute("placeholder"));


        WebElement loginBtn = driver.findElement(By.xpath("//button[text()='Log in']"));
        assertTrue(loginBtn.isEnabled(), "Login button is not enabled");

        String bgColor = loginBtn.getCssValue("background-color");
        System.out.println("Login button color: " + bgColor);
    }

    @Test
    @Order(2)
    @DisplayName("Persona Matcher UI Test")
    public void testPersonaMatcherUI() {
        login();

// Find the "Persona Matcher" span element
        WebElement spanContainer = driver.findElement(By.xpath("//span[contains(text(), 'Persona Matcher')]"));

// Assert that it's visible
        assertTrue(spanContainer.isDisplayed(), "Persona Matcher menu item is not visible");

// Assert the text matches exactly
        assertEquals("Persona Matcher", spanContainer.getText(), "Menu label does not match");

// Click the main menu
        spanContainer.click();

// Click the "Persona" submenu
        WebElement personaSubMenu = driver.findElement(By.xpath("//span[text()='Persona']"));
        assertTrue(personaSubMenu.isDisplayed(), "Persona submenu is not visible");
        personaSubMenu.click();


        WebElement uploadText = driver.findElement(By.xpath("//p[contains(text(), 'Upload CV or Certificates')]"));
        assertTrue(uploadText.isDisplayed(), "Upload text is not visible");
        assertEquals("Upload CV or Certificates", uploadText.getText(), "Upload text content mismatch");


        WebElement matchBtn = driver.findElement(By.xpath("//button[contains(text(), 'Match persona')]"));
        assertFalse(matchBtn.isEnabled(), "Match persona button should be disabled initially");
        upload();

        WebElement saveBtn = driver.findElement(By.xpath("//button[contains(text(), 'Save')]"));
        String fontSize = saveBtn.getCssValue("font-size");
        String color = saveBtn.getCssValue("background-color");
        assertTrue(saveBtn.isDisplayed(),"Save button not available");
        assertEquals("Save",saveBtn.getText(),"Save button contain mismatch");
        System.out.println("Save Button: font-size=" + fontSize + ", background=" + color);
    }

    @Test
    @Order(3)
    @DisplayName("Career Persona Table UI Test")
    public void testCareerPersonaTableUI() {
        login();

        // Navigate to Mentor AI page
        WebElement personaMatcherMenu = driver.findElement(By.xpath("//span[contains(text(),'Persona Matcher')]"));
        personaMatcherMenu.click();

        WebElement personaSubmenu = driver.findElement(By.xpath("//span[text()='Matched Personas']"));
        personaSubmenu.click();

        // Wait for table to be visible
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        WebElement personaTable = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//table")));

        // Wait for table headers to be present
        WebElement header1 = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//th[contains(text(), 'No.')]")));
        WebElement header2 = driver.findElement(By.xpath("//th[contains(text(), 'Career Persona')]"));
        WebElement header3 = driver.findElement(By.xpath("//th[contains(text(), 'Matching')]"));
        WebElement header4 = driver.findElement(By.xpath("//th[contains(text(), 'Suggestions')]"));

        assertEquals("NO.", header1.getText().trim(), "Header mismatch");
        assertEquals("CAREER PERSONA", header2.getText().trim());
        assertTrue(header3.getText().trim().toLowerCase().contains("matching"));
        assertEquals("SUGGESTIONS", header4.getText().trim());

        // Wait for at least one row
        WebElement firstRow = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//tbody/tr[1]/td[2]"))); // 2nd column: persona
        assertFalse(firstRow.getText().isEmpty(), "Career persona value missing");

        // Click "View" button in Suggestions column
        WebElement viewBtn = driver.findElement(By.xpath("//button[contains(., 'View')]"));
        assertTrue(viewBtn.isDisplayed(), "View button missing");






        // Check "Update" and "Delete" buttons
        WebElement updateBtn = driver.findElement(By.xpath("//button[contains(., 'Update')]"));
        WebElement deleteBtn = driver.findElement(By.xpath("//button[contains(., 'Delete')]"));

        assertTrue(updateBtn.isDisplayed());
        assertTrue(deleteBtn.isDisplayed());






    }



    private void login() {
        driver.findElement(By.id("singInButton")).click();
        driver.findElement(By.name("signinemail")).sendKeys("abc@gmail.com");
        driver.findElement(By.name("signinpassword")).sendKeys("00000000");
        driver.findElement(By.xpath("//button[text()='Log in']")).click();
    }
    public void upload() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        WebElement uploadDiv = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(., 'Upload CV or Certificates')]")
        ));

        try {
            Thread.sleep(1000); // Prefer WebDriverWait, but OK for now
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement fileInput = driver.findElement(By.id("uploadInput"));
        fileInput.sendKeys("C:\\Users\\USER\\Downloads\\N.M.Bishar CV.pdf");

        WebElement matchButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Match persona') and not(@disabled)]")
        ));
        matchButton.click();

//        wait.until(ExpectedConditions.presenceOfElementLocated(
//                By.xpath("//td[contains(text(), '1')]/following-sibling::td")
//        ));
//
//        WebElement saveButton = wait.until(ExpectedConditions.elementToBeClickable(
//                By.xpath("//button[contains(text(), 'Save')]")
//        ));
//        saveButton.click();
//
//        wait.until(ExpectedConditions.alertIsPresent());
//        driver.switchTo().alert().accept(); // Accepts alert
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
