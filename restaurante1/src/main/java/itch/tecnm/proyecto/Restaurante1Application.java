package itch.tecnm.proyecto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class Restaurante1Application {

	public static void main(String[] args) {
		SpringApplication.run(Restaurante1Application.class, args);
	}

}
