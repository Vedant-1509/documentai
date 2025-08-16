package intershipapproach2.restapi.UI;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://ec2-16-170-249-229.eu-north-1.compute.amazonaws.com",
                        "http://16.170.249.229:8080") // your React dev server
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}

