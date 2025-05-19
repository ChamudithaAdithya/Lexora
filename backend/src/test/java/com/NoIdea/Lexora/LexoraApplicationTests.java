package com.NoIdea.Lexora;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.bonigarcia.wdm.WebDriverManager;

@SpringBootTest
class LexoraApplicationTests {

	public static void main(String args[]) {
		WebDriverManager.chromedriver().setup();
		WebDriver driver = new ChromeDriver();

		driver.get("http://localhost:5173/Lexora/");

		// Click the singIn button
		WebElement singInButton = driver.findElement(By.id("singInButton")); // or By.cssSelector() / By.xpath()
		singInButton.click();

		// Find and fill email and password
		WebElement email = driver.findElement(By.name("email"));
		WebElement password = driver.findElement(By.name("password"));

		email.sendKeys("anjalisewmini5@gmail.com");
		password.sendKeys("12345678");

		//Click the Login button
		WebElement loginButton = driver.findElement(By.id("loginButton")); // or By.cssSelector() / By.xpath()
		loginButton.click();

		try {
			Thread.sleep(3000);

		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		System.out.println(driver.getTitle());
		driver.quit();
	}
}
