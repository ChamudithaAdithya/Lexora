package com.NoIdea.Lexora.Selenium.AICareerPersona;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
public class PersonaMatcher {
    public  static  void  main(String args[]){
        WebDriverManager.chromedriver().setup();

        // Setup Chrome options to disable password manager
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

        WebDriver driver = new ChromeDriver(options);
        WebDriverWait wait=new WebDriverWait(driver , Duration.ofSeconds(10));
        driver.get("http://localhost:5173/Lexora/");

        //Click signup button
        WebElement signupButton = driver.findElement(By.id("singInButton"));
        signupButton.click();

        WebElement email = driver.findElement(By.name("signinemail"));
        WebElement password = driver.findElement(By.name("signinpassword"));
        try {
            Thread.sleep(1000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        email.sendKeys("abc@gmail.com");
        password.sendKeys("00000000");

        //Click the Login button
        WebElement loginButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Log in']")));
        loginButton.click();


        // --- Wait for Sidebar to load and click Persona Matcher menu ---
        WebElement personaMatcherToggle = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[contains(text(), 'Persona Matcher')]")
        ));
        personaMatcherToggle.click();

        // --- Then click "Persona" sub-menu ---
        WebElement personaLink = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//span[text()='Persona']")
        ));
        personaLink.click();

        upload(driver,wait);
        //update persona
        WebElement updateButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Update')]")
        ));

        updateButton.click();
        upload(driver,wait);

        //delete persona
        WebElement deleteButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Delete')]")
        ));

        deleteButton.click();



        // Wait for the alert to be present

        wait.until(ExpectedConditions.alertIsPresent());

        // Switch to the alert
        driver.switchTo().alert().accept(); // Clicks "OK"

    }
    public static  void upload(WebDriver driver ,WebDriverWait wait) {
        WebElement uploadDiv = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(., 'Upload CV or Certificates')]")
        ));

        try {
            Thread.sleep(1000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        WebElement fileInput = driver.findElement(By.id("uploadInput"));
        fileInput.sendKeys("C:\\Users\\USER\\Downloads\\N.M.Bishar CV.pdf");


        WebElement matchButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Match persona') and not(@disabled)]")
        ));

// Click the button
        matchButton.click();

        // Wait until at least one valid persona row is displayed (excluding the "No career personas found" row)
        WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(20));
        wait1.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//td[contains(text(), '1')]/following-sibling::td")
        ));

        // Then wait until the Save button is clickable
        WebElement saveButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(), 'Save')]")
        ));

        // Click the Save button
        saveButton.click();

        // Wait for the alert to be present

        wait.until(ExpectedConditions.alertIsPresent());

        // Switch to the alert
        driver.switchTo().alert().accept(); // Clicks "OK"
    }

}
