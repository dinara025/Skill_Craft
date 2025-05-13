package com.paf.skillcraft.skill_craft;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class SkillCraftApplication {

    public static void main(String[] args) {
        // ✅ Load environment variables from .env
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // ✅ Set them as system properties so Spring can access
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID", ""));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET", ""));

        SpringApplication.run(SkillCraftApplication.class, args);
    }
}
