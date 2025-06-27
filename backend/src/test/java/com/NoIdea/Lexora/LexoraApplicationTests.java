package com.NoIdea.Lexora;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.bonigarcia.wdm.WebDriverManager;

import java.time.Duration;

@SpringBootTest
class LexoraApplicationTests {

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

		email.sendKeys("anjalisewmini5@gmail.com");
		password.sendKeys("12345678");

		//Click the Login button
		WebElement loginButton = driver.findElement(By.id("loginButton"));
		loginButton.click();

		//Click the Roadmap within sidebar
		WebElement Roadmap = wait.until(ExpectedConditions.elementToBeClickable(By.id("Roadmaps")));
		Roadmap.click();

		//Click the searchRoadmap within sidebar
		WebElement RoadmapGenerator = wait.until(ExpectedConditions.elementToBeClickable(By.id("Roadmaps Generator")));
		RoadmapGenerator.click();

		//input data for the searchbar
		WebElement GenerateRoadmapInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("SX4")));
		GenerateRoadmapInput.sendKeys("Frontend Developer");

		//Click Generate Roadmap button
		WebElement GenerateRoadmap = driver.findElement(By.id("GenerateButton"));
		GenerateRoadmap.click();

		//Click option 1 button
		WebElement OptionOneSelection = driver.findElement(By.id("OptionOneSelection"));
		OptionOneSelection.click();

		//Input skills
		WebElement SkillRoadmapInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("SkillRoadmap")));
		SkillRoadmapInput.sendKeys("React");

        //Click skill based generate roadmap button
		WebElement SkillGenerateRoadmap = driver.findElement(By.id("SkillGenerateRoadmap"));
		SkillGenerateRoadmap.click();

		try {
			Thread.sleep(30000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		//Click to save generated roadmap
		WebElement SaveRoadmap = wait.until(ExpectedConditions.elementToBeClickable(By.id("SaveRoadmap")));
		SaveRoadmap.click();

		try {
			Thread.sleep(50000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		//Click view button
		WebElement ViewRoadmap = wait.until(ExpectedConditions.elementToBeClickable(By.id("ViewRoadmap")));
		ViewRoadmap.click();

		try {
			Thread.sleep(40000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		//Click back button
		WebElement BackRoadmap = wait.until(ExpectedConditions.elementToBeClickable(By.id("BackRoadmap")));
		BackRoadmap.click();

		//Click delete button
		WebElement DeleteRoadmap = wait.until(ExpectedConditions.elementToBeClickable(By.id("DeleteRoadmap")));
		DeleteRoadmap.click();



		//Click job trends button in Sidebar
		WebElement JobTrendButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("JobTrends")));
		JobTrendButton.click();

		try {
			Thread.sleep(40000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		//Click year to get chart
		WebElement JobTrendYearButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("year")));
		JobTrendYearButton.click();
		//Click month to get chart
		JobTrendYearButton.click();

		try {
			Thread.sleep(40000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}




		System.out.println(driver.getTitle());
		driver.quit();
	}

}
