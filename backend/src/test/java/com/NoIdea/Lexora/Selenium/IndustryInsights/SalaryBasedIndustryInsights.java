package com.NoIdea.Lexora.Selenium.IndustryInsights;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;

@SpringBootTest
public class SalaryBasedIndustryInsights {
    public static void main(String args[]) {

        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("http://localhost:5173/Lexora/");

        //Click signup button
        WebElement signupButton = driver.findElement(By.id("singInButton"));
        signupButton.click();

//		//Fill usename, email, password
//		WebElement signup_username = driver.findElement(By.id("username"));
//		WebElement signup_email = driver.findElement(By.name("email"));
//		WebElement signup_password = driver.findElement(By.name("password"));
//
//		signup_username.sendKeys("Anjalee");
//		signup_email.sendKeys("anjalisewmini5@gmail.com");
//		signup_password.sendKeys("12345678");

//		// Click the singUp button
//		WebElement singInButton = driver.findElement(By.id("signup"));
//		singInButton.click();

        // Find and fill email and password
        WebElement email = driver.findElement(By.name("signinemail"));
        WebElement password = driver.findElement(By.name("signinpassword"));

        email.sendKeys("abc@gmail.com");
        password.sendKeys("00000000");

        //Click the Login button
        WebElement loginButton = driver.findElement(By.id("loginButton"));
        loginButton.click();

        //Click Industry Insight button
        WebElement IndustryInsight = wait.until(ExpectedConditions.elementToBeClickable(By.id("IndustryInsights")));
        IndustryInsight.click();


        //Click salary trends button in Sidebar
        WebElement salaryTrends = wait.until(ExpectedConditions.elementToBeClickable(By.id("SalaryTrends")));
        salaryTrends.click();

        //Click pie chart button to get chart
        WebElement pieChart = wait.until(ExpectedConditions.elementToBeClickable(By.id("pie")));
        pieChart.click();

        try {
            Thread.sleep(40000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //Click Country to get chart
        WebElement Country = wait.until(ExpectedConditions.elementToBeClickable(By.id("Country")));
        Country.click();

        //input data for the searchbar
        WebElement SearchCountriesInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("SearchCountries")));
        SearchCountriesInput.sendKeys("United States");
        //Click Country to get chart
        WebElement SelectCountry = wait.until(ExpectedConditions.elementToBeClickable(By.id("United States")));
        SelectCountry.click();

        try {
            Thread.sleep(30000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //Click DateTime to get chart
        WebElement DateTime = wait.until(ExpectedConditions.elementToBeClickable(By.id("DateTime")));
        DateTime.click();

        //Click year to get chart
        WebElement JobTrendYearButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("year")));
        JobTrendYearButton.click();
        //Click month to get chart
        WebElement JobTrendMonthButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("month")));
        JobTrendYearButton.click();
        //Click week to get chart
        WebElement JobTrendWeekButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("week")));
        JobTrendWeekButton.click();
        //Click Apply button to get chart
        WebElement ApplyDateTime = wait.until(ExpectedConditions.elementToBeClickable(By.id("ApplyDateTime")));
        ApplyDateTime.click();

        try {
            Thread.sleep(40000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }



        //Click line chart button to get chart
        WebElement lineChart = wait.until(ExpectedConditions.elementToBeClickable(By.id("line")));
        lineChart.click();

        try {
            Thread.sleep(10000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //Click radar chart button to get chart
        WebElement radarChart = wait.until(ExpectedConditions.elementToBeClickable(By.id("radar")));
        radarChart.click();

        try {
            Thread.sleep(10000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //Click salary chart button to get chart
        WebElement salaryChart = wait.until(ExpectedConditions.elementToBeClickable(By.id("salary")));
        salaryChart.click();

        try {
            Thread.sleep(10000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //Click job category chart button to get chart
        WebElement SoftwareDevelopment = wait.until(ExpectedConditions.elementToBeClickable(By.id("Software Development")));
        SoftwareDevelopment.click();
        //Click job category chart button to get chart
        WebElement WebDevelopment = wait.until(ExpectedConditions.elementToBeClickable(By.id("Web Development")));
        WebDevelopment.click();

        try {
            Thread.sleep(50000);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println(driver.getTitle());
        driver.quit();
    }

}
